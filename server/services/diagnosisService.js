const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class DiagnosisService {
  /**
   * Get all diagnoses
   * @returns {Promise<Array>} List of all diagnoses
   */
  async getAllDiagnoses() {
    const diagnoses = await prisma.carDiagnosis.findMany({
      include: { parts: true }
    });
    
    return diagnoses.map(d => ({
      ...d,
      vehicleInfo: JSON.parse(d.vehicleInfo)
    }));
  }

  /**
   * Get a single diagnosis by ID
   * @param {number|string} id - Diagnosis ID
   * @returns {Promise<Object|null>} Diagnosis object or null if not found
   */
  async getDiagnosisById(id) {
    const diagnosis = await prisma.carDiagnosis.findUnique({
      where: { id: parseInt(id) },
      include: { parts: true }
    });
    
    if (!diagnosis) return null;
    
    return {
      ...diagnosis,
      vehicleInfo: JSON.parse(diagnosis.vehicleInfo)
    };
  }

  /**
   * Create a new diagnosis
   * @param {Object} vehicleInfo - Vehicle information
   * @returns {Promise<Object>} Created diagnosis
   * @throws {Error} If validation fails
   */
  async createDiagnosis(vehicleInfo) {
    // Validate vehicle info
    this.validateVehicleInfo(vehicleInfo);

    const defaultParts = [
      { partId: 'hood', name: 'Hood (D)', status: 'not_checked', comment: '' },
      { partId: 'front_bumper', name: 'Front Bumper', status: 'not_checked', comment: '' },
      { partId: 'left_door', name: 'Left Front Door (D)', status: 'not_checked', comment: '' },
      { partId: 'right_door', name: 'Right Front Door (D)', status: 'not_checked', comment: '' },
      { partId: 'left_rear_door', name: 'Left Rear Door (B)', status: 'not_checked', comment: '' },
      { partId: 'right_rear_door', name: 'Right Rear Door (B)', status: 'not_checked', comment: '' },
      { partId: 'trunk', name: 'Trunk (L)', status: 'not_checked', comment: '' },
      { partId: 'rear_bumper', name: 'Rear Bumper (L)', status: 'not_checked', comment: '' },
      { partId: 'left_fender', name: 'Left Fender (P)', status: 'not_checked', comment: '' },
      { partId: 'right_fender', name: 'Right Fender (P)', status: 'not_checked', comment: '' },
    ];

    const newDiagnosis = await prisma.carDiagnosis.create({
      data: {
        vehicleInfo: JSON.stringify({
          make: vehicleInfo.make,
          model: vehicleInfo.model,
          year: vehicleInfo.year,
          vin: vehicleInfo.vin,
          licensePlate: vehicleInfo.licensePlate
        }),
        parts: {
          create: defaultParts
        }
      },
      include: { parts: true }
    });

    return {
      ...newDiagnosis,
      vehicleInfo: JSON.parse(newDiagnosis.vehicleInfo)
    };
  }

  /**
   * Update diagnosis vehicle information
   * @param {number|string} id - Diagnosis ID
   * @param {Object} vehicleInfo - Updated vehicle information
   * @returns {Promise<Object>} Updated diagnosis
   * @throws {Error} If diagnosis not found or validation fails
   */
  async updateDiagnosis(id, vehicleInfo) {
    const diagnosisId = parseInt(id);

    // Validate vehicle info (partial update allowed)
    this.validateVehicleInfo(vehicleInfo, false);

    try {
      // First get existing vehicle info to merge
      const existingDiagnosis = await prisma.carDiagnosis.findUnique({
        where: { id: diagnosisId }
      });

      if (!existingDiagnosis) {
        throw new Error('Diagnosis not found');
      }

      const currentVehicleInfo = JSON.parse(existingDiagnosis.vehicleInfo);
      const updatedVehicleInfo = {
        ...currentVehicleInfo,
        ...vehicleInfo
      };

      const updatedDiagnosis = await prisma.carDiagnosis.update({
        where: { id: diagnosisId },
        data: {
          vehicleInfo: JSON.stringify(updatedVehicleInfo)
        },
        include: { parts: true }
      });

      return {
        ...updatedDiagnosis,
        vehicleInfo: JSON.parse(updatedDiagnosis.vehicleInfo)
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new Error('Diagnosis not found');
      }
      throw error;
    }
  }

  /**
   * Update a specific part in a diagnosis
   * @param {number|string} diagnosisId - Diagnosis ID
   * @param {string} partId - Part ID (string ID like 'hood')
   * @param {Object} partData - Updated part data
   * @returns {Promise<Object>} Updated part
   * @throws {Error} If diagnosis or part not found
   */
  async updatePart(diagnosisId, partId, partData) {
    const diagId = parseInt(diagnosisId);

    // Find the part first
    // We need to find part by diagnosisId AND partId (string)
    // Since partId is not unique globally, we can't use findUnique on partId alone unless we have a composite key or use findFirst
    // But we can use findFirst
    
    const part = await prisma.carPart.findFirst({
      where: {
        diagnosisId: diagId,
        partId: partId
      }
    });

    if (!part) {
      throw new Error('Part not found');
    }

    const updatedPart = await prisma.carPart.update({
      where: { id: part.id }, // Use the internal unique ID
      data: {
        ...partData,
        updatedAt: new Date()
      }
    });

    // Update diagnosis timestamp
    await prisma.carDiagnosis.update({
      where: { id: diagId },
      data: { updatedAt: new Date() }
    });

    return updatedPart;
  }

  /**
   * Delete a diagnosis
   * @param {number|string} id - Diagnosis ID
   * @returns {Promise<boolean>} True if deleted successfully
   * @throws {Error} If diagnosis not found
   */
  async deleteDiagnosis(id) {
    try {
      await prisma.carDiagnosis.delete({
        where: { id: parseInt(id) }
      });
      return true;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new Error('Diagnosis not found');
      }
      throw error;
    }
  }

  /**
   * Validate vehicle information
   * @param {Object} data - Vehicle info to validate
   * @param {boolean} requireAll - Whether all fields are required (for create vs update)
   * @throws {Error} If validation fails
   */
  validateVehicleInfo(data, requireAll = true) {
    if (requireAll) {
      if (!data.make || typeof data.make !== 'string' || data.make.trim().length === 0) {
        throw new Error('Vehicle make is required and must be a non-empty string');
      }

      if (!data.model || typeof data.model !== 'string' || data.model.trim().length === 0) {
        throw new Error('Vehicle model is required and must be a non-empty string');
      }

      if (!data.year || isNaN(parseInt(data.year))) {
        throw new Error('Vehicle year is required and must be a number');
      }

      const year = parseInt(data.year);
      const currentYear = new Date().getFullYear();
      if (year < 1900 || year > currentYear + 1) {
        throw new Error(`Vehicle year must be between 1900 and ${currentYear + 1}`);
      }

      if (!data.vin || typeof data.vin !== 'string' || data.vin.trim().length === 0) {
        throw new Error('VIN is required and must be a non-empty string');
      }

      if (!data.licensePlate || typeof data.licensePlate !== 'string' || data.licensePlate.trim().length === 0) {
        throw new Error('License plate is required and must be a non-empty string');
      }
    } else {
      // For updates, validate only if fields are provided
      if (data.make !== undefined && (typeof data.make !== 'string' || data.make.trim().length === 0)) {
        throw new Error('Vehicle make must be a non-empty string');
      }

      if (data.model !== undefined && (typeof data.model !== 'string' || data.model.trim().length === 0)) {
        throw new Error('Vehicle model must be a non-empty string');
      }

      if (data.year !== undefined) {
        const year = parseInt(data.year);
        if (isNaN(year)) {
          throw new Error('Vehicle year must be a number');
        }
        const currentYear = new Date().getFullYear();
        if (year < 1900 || year > currentYear + 1) {
          throw new Error(`Vehicle year must be between 1900 and ${currentYear + 1}`);
        }
      }

      if (data.vin !== undefined && (typeof data.vin !== 'string' || data.vin.trim().length === 0)) {
        throw new Error('VIN must be a non-empty string');
      }

      if (data.licensePlate !== undefined && (typeof data.licensePlate !== 'string' || data.licensePlate.trim().length === 0)) {
        throw new Error('License plate must be a non-empty string');
      }
    }
  }

  /**
   * Calculate diagnosis progress
   * @param {Object} diagnosis - Diagnosis object
   * @returns {number} Progress percentage (0-100)
   */
  calculateProgress(diagnosis) {
    if (!diagnosis || !diagnosis.parts || diagnosis.parts.length === 0) {
      return 0;
    }

    const inspectedParts = diagnosis.parts.filter(p => p.status !== 'not_checked').length;
    return Math.round((inspectedParts / diagnosis.parts.length) * 100);
  }
}

// Export singleton instance
module.exports = new DiagnosisService();
