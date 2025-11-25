'use client';

import { useState } from 'react';

const VehicleInfoForm = ({ initialData = {}, onSubmit, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState({
    make: initialData.make || '',
    model: initialData.model || '',
    year: initialData.year || new Date().getFullYear(),
    vin: initialData.vin || '',
    licensePlate: initialData.licensePlate || '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.make.trim()) {
      newErrors.make = 'Make is required';
    }

    if (!formData.model.trim()) {
      newErrors.model = 'Model is required';
    }

    const year = parseInt(formData.year);
    const currentYear = new Date().getFullYear();
    if (!formData.year || isNaN(year) || year < 1900 || year > currentYear + 1) {
      newErrors.year = `Year must be between 1900 and ${currentYear + 1}`;
    }

    if (!formData.vin.trim()) {
      newErrors.vin = 'VIN is required';
    }

    if (!formData.licensePlate.trim()) {
      newErrors.licensePlate = 'License plate is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Make */}
      <div>
        <label htmlFor="make" className="block text-sm font-semibold text-muted mb-2">
          Make <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          id="make"
          name="make"
          value={formData.make}
          onChange={handleChange}
          placeholder="e.g., Toyota, Honda, Ford"
          className={`w-full px-4 py-3 bg-card border rounded-lg text-white placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
            errors.make ? 'border-red-400' : 'border-card-border'
          }`}
        />
        {errors.make && <p className="text-red-400 text-xs mt-1">{errors.make}</p>}
      </div>

      {/* Model */}
      <div>
        <label htmlFor="model" className="block text-sm font-semibold text-muted mb-2">
          Model <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          id="model"
          name="model"
          value={formData.model}
          onChange={handleChange}
          placeholder="e.g., Camry, Civic, F-150"
          className={`w-full px-4 py-3 bg-card border rounded-lg text-white placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
            errors.model ? 'border-red-400' : 'border-card-border'
          }`}
        />
        {errors.model && <p className="text-red-400 text-xs mt-1">{errors.model}</p>}
      </div>

      {/* Year */}
      <div>
        <label htmlFor="year" className="block text-sm font-semibold text-muted mb-2">
          Year <span className="text-red-400">*</span>
        </label>
        <input
          type="number"
          id="year"
          name="year"
          value={formData.year}
          onChange={handleChange}
          placeholder="e.g., 2020"
          min="1900"
          max={new Date().getFullYear() + 1}
          className={`w-full px-4 py-3 bg-card border rounded-lg text-white placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
            errors.year ? 'border-red-400' : 'border-card-border'
          }`}
        />
        {errors.year && <p className="text-red-400 text-xs mt-1">{errors.year}</p>}
      </div>

      {/* VIN */}
      <div>
        <label htmlFor="vin" className="block text-sm font-semibold text-muted mb-2">
          VIN <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          id="vin"
          name="vin"
          value={formData.vin}
          onChange={handleChange}
          placeholder="e.g., 1HGBH41JXMN109186"
          className={`w-full px-4 py-3 bg-card border rounded-lg text-white placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
            errors.vin ? 'border-red-400' : 'border-card-border'
          }`}
        />
        {errors.vin && <p className="text-red-400 text-xs mt-1">{errors.vin}</p>}
      </div>

      {/* License Plate */}
      <div>
        <label htmlFor="licensePlate" className="block text-sm font-semibold text-muted mb-2">
          License Plate <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          id="licensePlate"
          name="licensePlate"
          value={formData.licensePlate}
          onChange={handleChange}
          placeholder="e.g., ABC-1234"
          className={`w-full px-4 py-3 bg-card border rounded-lg text-white placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
            errors.licensePlate ? 'border-red-400' : 'border-card-border'
          }`}
        />
        {errors.licensePlate && <p className="text-red-400 text-xs mt-1">{errors.licensePlate}</p>}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 px-4 py-3 bg-card border border-card-border rounded-lg text-white font-medium hover:bg-card-border/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-4 py-3 bg-primary rounded-lg text-white font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
};

export default VehicleInfoForm;
