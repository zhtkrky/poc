'use client';

import Link from 'next/link';

const DiagnosisCard = ({ diagnosis, onDelete }) => {
  const calculateProgress = () => {
    if (!diagnosis.parts || diagnosis.parts.length === 0) return 0;
    const inspected = diagnosis.parts.filter(p => p.status !== 'not_checked').length;
    return Math.round((inspected / diagnosis.parts.length) * 100);
  };

  const getStatusBadge = () => {
    const progress = calculateProgress();
    if (progress === 100) {
      return { label: 'Complete', color: 'text-green-400 bg-green-400/10 border-green-400/20' };
    } else if (progress > 0) {
      return { label: 'In Progress', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' };
    } else {
      return { label: 'Not Started', color: 'text-gray-400 bg-gray-400/10 border-gray-400/20' };
    }
  };

  const progress = calculateProgress();
  const status = getStatusBadge();

  return (
    <div className="bg-card border border-card-border rounded-xl p-6 hover:border-primary/50 transition-all group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">
            {diagnosis.vehicleInfo.year} {diagnosis.vehicleInfo.make} {diagnosis.vehicleInfo.model}
          </h3>
          <p className="text-sm text-muted">
            VIN: {diagnosis.vehicleInfo.vin}
          </p>
        </div>
        <span className={`text-xs px-3 py-1 rounded-full border ${status.color}`}>
          {status.label}
        </span>
      </div>

      {/* Vehicle Details */}
      <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-card-border">
        <div>
          <p className="text-xs text-muted mb-1">License Plate</p>
          <p className="text-sm font-semibold">{diagnosis.vehicleInfo.licensePlate}</p>
        </div>
        <div>
          <p className="text-xs text-muted mb-1">Last Updated</p>
          <p className="text-sm font-semibold">
            {new Date(diagnosis.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted">Inspection Progress</span>
          <span className="text-sm font-bold text-primary">{progress}%</span>
        </div>
        <div className="w-full bg-card-border rounded-full h-2 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-primary to-secondary h-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Link
          href={`/car-diagnosis/${diagnosis.id}`}
          className="flex-1 px-4 py-2 bg-primary rounded-lg text-white text-sm font-medium hover:bg-primary/90 transition-colors text-center"
        >
          View Details
        </Link>
        <button
          onClick={(e) => {
            e.preventDefault();
            onDelete(diagnosis.id);
          }}
          className="px-4 py-2 bg-card border border-red-400/20 rounded-lg text-red-400 text-sm font-medium hover:bg-red-400/10 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DiagnosisCard;
