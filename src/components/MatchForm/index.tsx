import React from 'react';
import { X } from 'lucide-react';
import { StepIndicator } from './StepIndicator';
import { FormSteps } from './FormSteps';
import type { FormData } from '../../types';

interface MatchFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
}

export function MatchForm({ isOpen, onClose, onSubmit }: MatchFormProps) {
  const [step, setStep] = React.useState(1);
  const [formData, setFormData] = React.useState<FormData>({
    region: 'North America',
    interests: [],
    genderPreference: [],
    zkProofVerified: false,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <StepIndicator currentStep={step} totalSteps={5} />
        
        <FormSteps
          step={step}
          formData={formData}
          setFormData={setFormData}
          setStep={setStep}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}