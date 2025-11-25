const mockData = require('../data/mockData');

class DiagnosisService {
  /**
   * Get all diagnoses
   * @returns {Array} List of all diagnoses
   */
  getAllDiagnoses() {
    return mockData.carDiagnoses;
  }

  /**
   * Get a single diagnosis by ID
   * @param {number|string} id - Diagnosis ID
   * @returns {Object|null} Diagnosis object or null if not found
   */
  getDiagnosisById(id) {
    const diagnosisId = parseInt(id);
    return mockData.carDiagnoses.find(diagnosis => diagnosis.id === diagnosisId) || null;
  }

  /**
   * Create a new diagnosis
   * @param {Object} vehicleInfo - Vehicle information
   * @returns {Object} Created diagnosis
   * @throws {Error} If validation fails
   */
  createDiagnosis(vehicleInfo) {
    // Validate vehicle info
    this.validateVehicleInfo(vehicleInfo);

    // Generate new ID
    const newId = mockData.carDiagnoses.length > 0 
      ? Math.max(...mockData.carDiagnoses.map(d => d.id)) + 1 
      : 1;

    // Create new diagnosis with default parts
    const newDiagnosis = {
      id: newId,
      vehicleInfo: {
        make: vehicleInfo.make,
        model: vehicleInfo.model,
        year: vehicleInfo.year,
        vin: vehicleInfo.vin,
        licensePlate: vehicleInfo.licensePlate
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      parts: [
        { id: 'hood', name: 'Hood (D)', status: 'not_checked', comment: '', updatedAt: null },
        { id: 'front_bumper', name: 'Front Bumper', status: 'not_checked', comment: '', updatedAt: null },
        { id: 'left_door', name: 'Left Front Door (D)', status: 'not_checked', comment: '', updatedAt: null },
        { id: 'right_door', name: 'Right Front Door (D)', status: 'not_checked', comment: '', updatedAt: null },
        { id: 'left_rear_door', name: 'Left Rear Door (B)', status: 'not_checked', comment: '', updatedAt: null },
        { id: 'right_rear_door', name: 'Right Rear Door (B)', status: 'not_checked', comment: '', updatedAt: null },
        { id: 'trunk', name: 'Trunk (L)', status: 'not_checked', comment: '', updatedAt: null },
        { id: 'rear_bumper', name: 'Rear Bumper (L)', status: 'not_checked', comment: '', updatedAt: null },
        { id: 'left_fender', name: 'Left Fender (P)', status: 'not_checked', comment: '', updatedAt: null },
        { id: 'right_fender', name: 'Right Fender (P)', status: 'not_checked', comment: '', updatedAt: null },
      ]
    };

    // Add to mock data
    mockData.carDiagnoses.push(newDiagnosis);

    return newDiagnosis;
  }

  /**
   * Update diagnosis vehicle information
   * @param {number|string} id - Diagnosis ID
   * @param {Object} vehicleInfo - Updated vehicle information
   * @returns {Object} Updated diagnosis
   * @throws {Error} If diagnosis not found or validation fails
   */
  updateDiagnosis(id, vehicleInfo) {
    const diagnosisId = parseInt(id);
    const diagnosisIndex = mockData.carDiagnoses.findIndex(d => d.id === diagnosisId);

    if (diagnosisIndex === -1) {
      throw new Error('Diagnosis not found');
    }

    // Validate vehicle info (partial update allowed)
    this.validateVehicleInfo(vehicleInfo, false);

    // Update diagnosis
    const updatedDiagnosis = {
      ...mockData.carDiagnoses[diagnosisIndex],
      vehicleInfo: {
        ...mockData.carDiagnoses[diagnosisIndex].vehicleInfo,
        ...vehicleInfo
      },
      updatedAt: new Date().toISOString(),
    };

    mockData.carDiagnoses[diagnosisIndex] = updatedDiagnosis;

    return updatedDiagnosis;
  }

  /**
   * Update a specific part in a diagnosis
   * @param {number|string} diagnosisId - Diagnosis ID
   * @param {string} partId - Part ID
   * @param {Object} partData - Updated part data
   * @returns {Object} Updated part
   * @throws {Error} If diagnosis or part not found
   */
  updatePart(diagnosisId, partId, partData) {
    const diagId = parseInt(diagnosisId);
    const diagnosis = mockData.carDiagnoses.find(d => d.id === diagId);

    if (!diagnosis) {
      throw new Error('Diagnosis not found');
    }

    const partIndex = diagnosis.parts.findIndex(p => p.id === partId);

    if (partIndex === -1) {
      throw new Error('Part not found');
    }

    // Update part
    diagnosis.parts[partIndex] = {
      ...diagnosis.parts[partIndex],
      ...partData,
      updatedAt: new Date().toISOString(),
    };

    // Update diagnosis timestamp
    diagnosis.updatedAt = new Date().toISOString();

    return diagnosis.parts[partIndex];
  }

  /**
   * Delete a diagnosis
   * @param {number|string} id - Diagnosis ID
   * @returns {boolean} True if deleted successfully
   * @throws {Error} If diagnosis not found
   */
  deleteDiagnosis(id) {
    const diagnosisId = parseInt(id);
    const diagnosisIndex = mockData.carDiagnoses.findIndex(d => d.id === diagnosisId);

    if (diagnosisIndex === -1) {
      throw new Error('Diagnosis not found');
    }

    mockData.carDiagnoses.splice(diagnosisIndex, 1);
    return true;
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
