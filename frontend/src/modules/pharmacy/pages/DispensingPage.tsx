/**
 * Dispensing Page
 * Main workflow for dispensing medications with validation and business rule enforcement
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type {
  Prescription,
  PrescriptionItem,
  CreateDispensingDTO,
  DispensingValidationResult,
} from '../types';
import {
  useValidateDispensingRequest,
  useDispense,
  usePrescriptionDetail,
  useDrugStock,
  useDoctorLimits,
} from '../hooks/queries';
import {
  Button,
  Alert,
  EmptyState,
  Dialog,
  FormGroup,
  Input,
  Select,
  SpinnerLoader,
  ConfirmDialog,
} from '../components/common/CommonComponents';
import { RoleGuard, DispensingGuard } from '../guards/RoleGuard';
import {
  isBatchExpired,
  getDaysUntilExpiry,
  isBatchExpiringsSoon,
  validateDispensingQuantity,
  formatQuantity,
  getStatusLabel,
} from '../utils/formatters';
import type { UserRole } from '../types';

interface DispensingPageProps {
  prescriptionId?: string;
  userRole: UserRole;
  onDispensingComplete?: () => void;
}

const DispensingFormSchema = z.object({
  prescriptionItemId: z.string().min(1, 'Please select a prescription item'),
  drugId: z.string().min(1, 'Drug ID is required'),
  batchId: z.string().min(1, 'Please select a batch'),
  quantityDispensed: z.number().min(1, 'Quantity must be greater than 0'),
  notes: z.string().optional(),
});

type DispensingFormData = z.infer<typeof DispensingFormSchema>;

export const DispensingPage: React.FC<DispensingPageProps> = ({
  prescriptionId,
  userRole,
  onDispensingComplete,
}) => {
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [selectedItem, setSelectedItem] = useState<PrescriptionItem | null>(null);
  const [validationResult, setValidationResult] = useState<DispensingValidationResult | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { data: prescription, isLoading: isPrescriptionLoading } =
    usePrescriptionDetail(prescriptionId || null);

  const { data: drugStock } = useDrugStock(selectedItem?.drugId || null);
  const { data: doctorLimits } = useDoctorLimits(prescription?.doctorId || null);

  const validateMutation = useValidateDispensingRequest();
  const dispenseMutation = useDispense();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<DispensingFormData>({
    resolver: zodResolver(DispensingFormSchema),
  });

  const watchQuantity = watch('quantityDispensed');
  const watchBatchId = watch('batchId');

  // Update selected prescription when data loads
  React.useEffect(() => {
    if (prescription && !selectedPrescription) {
      setSelectedPrescription(prescription);
    }
  }, [prescription, selectedPrescription]);

  const handleSelectItem = (item: PrescriptionItem) => {
    setSelectedItem(item);
    reset();
    setValidationResult(null);
  };

  const handleValidate = async (data: DispensingFormData) => {
    try {
      const result = await validateMutation.mutateAsync(data);
      setValidationResult(result);

      if (result.isValid && result.violations.limitViolation) {
        setShowConfirmDialog(true);
      } else if (result.isValid) {
        setShowConfirmDialog(true);
      }
    } catch (error) {
      setValidationResult({
        isValid: false,
        errors: [{ field: 'general', message: 'Validation failed', code: 'VALIDATION_ERROR' }],
        warnings: [],
        violations: {
          stockShortage: false,
          batchExpired: false,
          limitViolation: null,
        },
      });
    }
  };

  const handleConfirmDispense = async (data: DispensingFormData) => {
    try {
      const result = await dispenseMutation.mutateAsync(data);
      setSuccessMessage(
        `Successfully dispensed ${data.quantityDispensed} units of ${selectedItem?.drugName}`
      );
      reset();
      setSelectedItem(null);
      setValidationResult(null);
      setShowConfirmDialog(false);
      onDispensingComplete?.();
    } catch (error) {
      setValidationResult({
        isValid: false,
        errors: [{ field: 'general', message: 'Dispensing failed', code: 'DISPENSE_ERROR' }],
        warnings: [],
        violations: {
          stockShortage: false,
          batchExpired: false,
          limitViolation: null,
        },
      });
    }
  };

  return (
    <DispensingGuard
      userRole={userRole}
      fallback={
        <div className="p-6">
          <EmptyState
            title="Access Denied"
            description="Only pharmacists and admins can perform dispensing operations."
            icon="🔒"
          />
        </div>
      }
    >
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dispense Medication</h1>
          <p className="text-gray-600 mt-2">
            Process prescription dispensing with validation and audit trail
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <Alert
            type="success"
            title="Dispensing Complete"
            message={successMessage}
            onDismiss={() => setSuccessMessage(null)}
          />
        )}

        {/* Prescription Selection */}
        {!selectedPrescription ? (
          <PrescriptionSearchForm onSelectPrescription={setSelectedPrescription} />
        ) : (
          <>
            {/* Selected Prescription Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-blue-900">
                    {selectedPrescription.prescriptionNumber}
                  </h3>
                  <p className="text-sm text-blue-700">
                    Patient: {selectedPrescription.patientName} | Doctor:{' '}
                    {selectedPrescription.doctorName}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedPrescription(null);
                    setSelectedItem(null);
                    reset();
                  }}
                >
                  Change
                </Button>
              </div>
            </div>

            {/* Prescription Items */}
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">Medications to Dispense</h3>
              <div className="grid gap-2">
                {selectedPrescription.items.map((item) => (
                  <PrescriptionItemCard
                    key={item.id}
                    item={item}
                    isSelected={selectedItem?.id === item.id}
                    onSelect={() => handleSelectItem(item)}
                    canDispense={item.status !== 'DISPENSED'}
                  />
                ))}
              </div>
            </div>

            {/* Dispensing Form */}
            {selectedItem && (
              <DispensingForm
                prescriptionItem={selectedItem}
                drugStock={drugStock}
                doctorLimits={doctorLimits}
                validationResult={validationResult}
                isValidating={validateMutation.isPending}
                isDispensingLoading={dispenseMutation.isPending}
                onSubmit={handleSubmit((data) => handleValidate(data))}
                onConfirm={handleSubmit((data) => handleConfirmDispense(data))}
                register={register}
                errors={errors}
                showConfirmDialog={showConfirmDialog}
                onConfirmClose={() => setShowConfirmDialog(false)}
                violationCheck={validationResult?.violations.limitViolation || null}
              />
            )}
          </>
        )}
      </div>
    </DispensingGuard>
  );
};

// ============================================================================
// SUPPORTING COMPONENTS
// ============================================================================

interface PrescriptionSearchFormProps {
  onSelectPrescription: (prescription: Prescription) => void;
}

const PrescriptionSearchForm: React.FC<PrescriptionSearchFormProps> = ({
  onSelectPrescription,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <FormGroup label="Search Prescription" required>
        <Input
          type="text"
          placeholder="Enter prescription number (e.g., RX-2024-00001) or patient name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </FormGroup>
      <Button
        variant="primary"
        onClick={() => {
          // In a real app, this would search and select the prescription
          // For now, showing placeholder behavior
        }}
      >
        Search & Select Prescription
      </Button>
    </div>
  );
};

interface PrescriptionItemCardProps {
  item: PrescriptionItem;
  isSelected: boolean;
  onSelect: () => void;
  canDispense: boolean;
}

const PrescriptionItemCard: React.FC<PrescriptionItemCardProps> = ({
  item,
  isSelected,
  onSelect,
  canDispense,
}) => {
  const remaining = item.quantity - item.dispensedQuantity;

  return (
    <div
      onClick={onSelect}
      className={`p-4 rounded-lg border-2 cursor-pointer transition ${
        isSelected
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 bg-white hover:border-gray-300'
      } ${!canDispense ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{item.drugName}</h4>
          <p className="text-sm text-gray-600">
            Category: {item.category} | Frequency: {item.frequency}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Remaining: {remaining} {item.unit} / {item.quantity} {item.unit}
          </p>
        </div>
        <div className="text-right">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
              remaining === 0
                ? 'bg-green-100 text-green-800'
                : remaining < item.quantity
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-blue-100 text-blue-800'
            }`}
          >
            {remaining === 0 ? 'Fully Dispensed' : `${remaining} Remaining`}
          </span>
        </div>
      </div>
    </div>
  );
};

interface DispensingFormProps {
  prescriptionItem: PrescriptionItem;
  drugStock: any;
  doctorLimits: any[];
  validationResult: DispensingValidationResult | null;
  isValidating: boolean;
  isDispensingLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onConfirm: (e: React.FormEvent) => void;
  register: any;
  errors: any;
  showConfirmDialog: boolean;
  onConfirmClose: () => void;
  violationCheck: any;
}

const DispensingForm: React.FC<DispensingFormProps> = ({
  prescriptionItem,
  drugStock,
  doctorLimits,
  validationResult,
  isValidating,
  isDispensingLoading,
  onSubmit,
  onConfirm,
  register,
  errors,
  showConfirmDialog,
  onConfirmClose,
  violationCheck,
}) => {
  return (
    <form onSubmit={onSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
      <h3 className="font-semibold text-lg text-gray-900">
        Dispense: {prescriptionItem.drugName}
      </h3>

      {/* Validation Errors */}
      {validationResult && !validationResult.isValid && (
        <Alert
          type="error"
          title="Validation Failed"
          message={validationResult.errors[0]?.message || 'Please check the form below'}
        />
      )}

      {/* Warnings */}
      {validationResult?.warnings.length ? (
        <Alert
          type="warning"
          title="Warnings"
          message={validationResult.warnings.map((w) => w.message).join(', ')}
        />
      )}

      {/* Batch Selection */}
      {drugStock?.batches && (
        <FormGroup label="Select Batch" required>
          <Select
            options={drugStock.batches
              .filter((b: any) => !isBatchExpired(b.expiryDate))
              .map((b: any) => ({
                value: b.id,
                label: `${b.batchNumber} - ${b.availableQuantity} units (Expires: ${new Date(b.expiryDate).toLocaleDateString()})`,
              }))}
            error={!!errors.batchId}
            {...register('batchId')}
          />
          {errors.batchId && <p className="text-red-600 text-sm">{errors.batchId.message}</p>}
        </FormGroup>
      )}

      {/* Quantity */}
      <FormGroup label="Quantity to Dispense" required hint={`Max: ${prescriptionItem.quantity - prescriptionItem.dispensedQuantity} units`}>
        <Input
          type="number"
          min="1"
          max={prescriptionItem.quantity - prescriptionItem.dispensedQuantity}
          error={!!errors.quantityDispensed}
          {...register('quantityDispensed', { valueAsNumber: true })}
        />
        {errors.quantityDispensed && (
          <p className="text-red-600 text-sm">{errors.quantityDispensed.message}</p>
        )}
      </FormGroup>

      {/* Notes */}
      <FormGroup label="Notes (Optional)">
        <Input
          type="text"
          placeholder="Any special instructions or observations..."
          {...register('notes')}
        />
      </FormGroup>

      {/* Violation Warning */}
      {violationCheck && (
        <Alert
          type="warning"
          title="Doctor Limit Warning"
          message={`Doctor has used ${violationCheck.currentUsage} units. Daily limit: ${violationCheck.dailyLimit}`}
        />
      )}

      <div className="flex gap-2 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => onConfirmClose()}
          disabled={isValidating}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isValidating}
        >
          Validate & Review
        </Button>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onConfirm={onConfirm}
        onCancel={onConfirmClose}
        title="Confirm Dispensing"
        message={`Dispense ${prescriptionItem.quantity} units of ${prescriptionItem.drugName} to ${prescriptionItem.quantity} units? This action will be audited.`}
        confirmText="Confirm Dispensing"
        cancelText="Review Again"
        isLoading={isDispensingLoading}
      />
    </form>
  );
};

export default DispensingPage;
