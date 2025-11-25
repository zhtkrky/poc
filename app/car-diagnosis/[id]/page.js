'use client';

import { useRouter } from 'next/navigation';
import { use, useState } from 'react';
import CarDiagram from '../../components/CarDiagram';
import ConfirmDialog from '../../components/ConfirmDialog';
import { ErrorMessage } from '../../components/ErrorMessage';
import Header from '../../components/Header';
import { CardSkeleton } from '../../components/LoadingSpinner';
import PartDetailsModal from '../../components/PartDetailsModal';
import { useDeleteDiagnosisMutation, useGetDiagnosisQuery, useUpdatePartMutation } from '../../lib/api/diagnosisApi';

export default function CarDiagnosisPage({ params }) {
  const router = useRouter();
  const { id } = use(params); // Unwrap the params Promise
  const [selectedPart, setSelectedPart] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: diagnosis, isLoading, error, refetch } = useGetDiagnosisQuery(id);
  const [updatePart] = useUpdatePartMutation();
  const [deleteDiagnosis, { isLoading: isDeleting }] = useDeleteDiagnosisMutation();

  const handlePartClick = (partInfo) => {
    const fullPartData = diagnosis?.parts?.find(p => p.id === partInfo.id) || partInfo;
    setSelectedPart(fullPartData);
    setIsModalOpen(true);
  };

  const handleSavePart = async (updatedPart) => {
    try {
      await updatePart({
        diagnosisId: diagnosis.id,
        part: updatedPart,
      }).unwrap();
      
      // Optimistically update the local state
      refetch();
    } catch (err) {
      console.error('Failed to update part:', err);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      original: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
      painted: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
      replaced: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
      damaged: 'text-red-400 bg-red-400/10 border-red-400/20',
      not_checked: 'text-gray-400 bg-gray-400/10 border-gray-400/20',
    };
    return colors[status] || colors.not_checked;
  };

  const getStatusLabel = (status) => {
    const labels = {
      original: 'Original',
      painted: 'Painted',
      replaced: 'Replaced',
      damaged: 'Damaged',
      not_checked: 'Not Checked',
    };
    return labels[status] || 'Unknown';
  };

  const inspectedParts = diagnosis?.parts?.filter(p => p.status !== 'not_checked') || [];
  const notCheckedCount = diagnosis?.parts?.filter(p => p.status === 'not_checked').length || 0;

  const handleDelete = async () => {
    try {
      await deleteDiagnosis(id).unwrap();
      router.push('/car-diagnosis');
    } catch (err) {
      console.error('Failed to delete diagnosis:', err);
      alert('Failed to delete diagnosis. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <div className="flex-1 ml-64">
        <Header />
        
        <main className="p-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm text-muted">
              <button
                onClick={() => router.push('/car-diagnosis')}
                className="hover:text-white transition-colors"
              >
                Car Diagnoses
              </button>
              <span>/</span>
              <span className="text-white">
                {diagnosis ? `${diagnosis.vehicleInfo.year} ${diagnosis.vehicleInfo.make} ${diagnosis.vehicleInfo.model}` : 'Loading...'}
              </span>
            </div>
          </div>

          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                  🚗 Car Diagnosis
                </h1>
                <p className="text-muted text-sm">
                  Click on any car part to inspect and add comments about damage or replacements
                </p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowDeleteDialog(true)}
                  className="px-6 py-3 bg-card border border-red-400/20 rounded-lg text-red-400 font-medium hover:bg-red-400/10 transition-colors flex items-center gap-2"
                >
                  <span>🗑️</span>
                  Delete
                </button>
                <button className="px-6 py-3 bg-primary rounded-lg text-white font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 flex items-center gap-2">
                  <span>📄</span>
                  Export Report
                </button>
              </div>
            </div>

            {/* Vehicle Info */}
            {diagnosis?.vehicleInfo && (
              <div className="bg-card border border-card-border rounded-xl p-6 grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <p className="text-xs text-muted mb-1">Make</p>
                  <p className="font-semibold">{diagnosis.vehicleInfo.make}</p>
                </div>
                <div>
                  <p className="text-xs text-muted mb-1">Model</p>
                  <p className="font-semibold">{diagnosis.vehicleInfo.model}</p>
                </div>
                <div>
                  <p className="text-xs text-muted mb-1">Year</p>
                  <p className="font-semibold">{diagnosis.vehicleInfo.year}</p>
                </div>
                <div>
                  <p className="text-xs text-muted mb-1">VIN</p>
                  <p className="font-semibold text-sm">{diagnosis.vehicleInfo.vin}</p>
                </div>
                <div>
                  <p className="text-xs text-muted mb-1">License Plate</p>
                  <p className="font-semibold">{diagnosis.vehicleInfo.licensePlate}</p>
                </div>
              </div>
            )}
          </div>

          {/* Error State */}
          {error && <ErrorMessage error={error} onRetry={refetch} className="mb-8" />}

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <CardSkeleton className="h-96" />
              </div>
              <div>
                <CardSkeleton className="h-96" />
              </div>
            </div>
          )}

          {/* Main Content */}
          {!isLoading && diagnosis && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Car Diagram */}
              <div className="lg:col-span-2">
                <div className="bg-card border border-card-border rounded-xl p-8">
                  <h2 className="text-xl font-bold mb-6">Vehicle Diagram</h2>
                  <CarDiagram diagnosis={diagnosis} onPartClick={handlePartClick} />
                </div>
              </div>

              {/* Inspection Summary */}
              <div className="space-y-6">
                {/* Stats */}
                <div className="bg-card border border-card-border rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-4">Inspection Progress</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted">Total Parts</span>
                      <span className="text-2xl font-bold">{diagnosis.parts.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted">Inspected</span>
                      <span className="text-2xl font-bold text-primary">{inspectedParts.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted">Not Checked</span>
                      <span className="text-2xl font-bold text-gray-400">{notCheckedCount}</span>
                    </div>
                    <div className="pt-4 border-t border-card-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted">Progress</span>
                        <span className="text-sm font-semibold">{Math.round((inspectedParts.length / diagnosis.parts.length) * 100)}%</span>
                      </div>
                      <div className="w-full bg-card-border rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-primary to-secondary h-full transition-all duration-500"
                          style={{ width: `${(inspectedParts.length / diagnosis.parts.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Inspected Parts List */}
                <div className="bg-card border border-card-border rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-4">Inspected Parts</h3>
                  {inspectedParts.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2">🔍</div>
                      <p className="text-muted text-sm">No parts inspected yet</p>
                      <p className="text-muted text-xs mt-1">Click on the diagram to start</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {inspectedParts.map((part) => (
                        <div
                          key={part.id}
                          onClick={() => handlePartClick(part)}
                          className="p-4 bg-background border border-card-border rounded-lg hover:border-primary/50 cursor-pointer transition-all group"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">{part.name}</h4>
                            <span className={`text-xs px-2 py-1 rounded border ${getStatusColor(part.status)}`}>
                              {getStatusLabel(part.status)}
                            </span>
                          </div>
                          {part.comment && (
                            <p className="text-xs text-muted line-clamp-2">{part.comment}</p>
                          )}
                          {part.updatedAt && (
                            <p className="text-xs text-muted mt-2">
                              Updated: {new Date(part.updatedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Part Details Modal */}
      <PartDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        part={selectedPart}
        onSave={handleSavePart}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Diagnosis"
        message="Are you sure you want to delete this diagnosis? This action cannot be undone and you will be redirected to the list page."
        confirmText="Delete"
        confirmStyle="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
