'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ConfirmDialog from '../components/ConfirmDialog';
import DiagnosisCard from '../components/DiagnosisCard';
import { ErrorMessage } from '../components/ErrorMessage';
import Header from '../components/Header';
import { CardSkeleton } from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import VehicleInfoForm from '../components/VehicleInfoForm';
import { useCreateDiagnosisMutation, useDeleteDiagnosisMutation, useGetAllDiagnosesQuery } from '../lib/api/diagnosisApi';

export default function CarDiagnosisListPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data: diagnoses, isLoading, error, refetch } = useGetAllDiagnosesQuery();
  const [deleteDiagnosis, { isLoading: isDeleting }] = useDeleteDiagnosisMutation();
  const [createDiagnosis, { isLoading: isCreating }] = useCreateDiagnosisMutation();

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      await deleteDiagnosis(deleteId).unwrap();
      setDeleteId(null);
    } catch (err) {
      console.error('Failed to delete diagnosis:', err);
    }
  };

  const handleCreate = async (vehicleInfo) => {
    try {
      const result = await createDiagnosis(vehicleInfo).unwrap();
      setShowCreateModal(false);
      // Navigate to the new diagnosis detail page
      router.push(`/car-diagnosis/${result.id}`);
    } catch (err) {
      console.error('Failed to create diagnosis:', err);
      alert('Failed to create diagnosis. Please try again.');
    }
  };

  const handleCancelCreate = () => {
    setShowCreateModal(false);
  };

  const filteredDiagnoses = diagnoses?.filter(diagnosis => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      diagnosis.vehicleInfo.make.toLowerCase().includes(search) ||
      diagnosis.vehicleInfo.model.toLowerCase().includes(search) ||
      diagnosis.vehicleInfo.year.toString().includes(search) ||
      diagnosis.vehicleInfo.vin.toLowerCase().includes(search) ||
      diagnosis.vehicleInfo.licensePlate.toLowerCase().includes(search)
    );
  });

  return (
    <div className="flex min-h-screen bg-background">
      <div className="flex-1 ml-64">
        <Header />
        
        <main className="p-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                  🚗 Car Diagnoses
                </h1>
                <p className="text-muted text-sm">
                  Manage all vehicle inspection diagnoses
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-primary rounded-lg text-white font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 flex items-center gap-2"
              >
                <span>➕</span>
                Create New Diagnosis
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by make, model, year, VIN, or license plate..."
                className="w-full px-4 py-3 pl-12 bg-card border border-card-border rounded-lg text-white placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-xl">
                🔍
              </span>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
                >
                  ✖
                </button>
              )}
            </div>
          </div>

          {/* Error State */}
          {error && <ErrorMessage error={error} onRetry={refetch} className="mb-8" />}

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredDiagnoses?.length === 0 && !searchTerm && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🚗</div>
              <h3 className="text-xl font-bold mb-2">No Diagnoses Yet</h3>
              <p className="text-muted mb-6">Create your first vehicle diagnosis to get started</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary rounded-lg text-white font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              >
                <span>➕</span>
                Create New Diagnosis
              </button>
            </div>
          )}

          {/* No Search Results */}
          {!isLoading && filteredDiagnoses?.length === 0 && searchTerm && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-2">No Results Found</h3>
              <p className="text-muted mb-6">
                No diagnoses match "{searchTerm}"
              </p>
              <button
                onClick={() => setSearchTerm('')}
                className="px-6 py-3 bg-card border border-card-border rounded-lg text-white font-medium hover:bg-card-border/50 transition-colors"
              >
                Clear Search
              </button>
            </div>
          )}

          {/* Diagnoses Grid */}
          {!isLoading && filteredDiagnoses && filteredDiagnoses.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted">
                  Showing {filteredDiagnoses.length} of {diagnoses.length} diagnoses
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDiagnoses.map((diagnosis) => (
                  <DiagnosisCard
                    key={diagnosis.id}
                    diagnosis={diagnosis}
                    onDelete={(id) => setDeleteId(id)}
                  />
                ))}
              </div>
            </>
          )}
        </main>
      </div>

      {/* Create Diagnosis Modal */}
      <Modal 
        isOpen={showCreateModal} 
        onClose={handleCancelCreate}
        title="Create New Diagnosis"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted">
            Enter vehicle information to create a new diagnosis
          </p>
          <VehicleInfoForm
            onSubmit={handleCreate}
            onCancel={handleCancelCreate}
            isLoading={isCreating}
          />
        </div>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Diagnosis"
        message="Are you sure you want to delete this diagnosis? This action cannot be undone."
        confirmText="Delete"
        confirmStyle="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
