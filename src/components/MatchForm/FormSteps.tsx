import React from 'react';
import { Button } from '../ui/Button';
import { interests, regions, genders } from '../../lib/utils';
import type { FormData } from '../../types';

interface FormStepsProps {
  step: number;
  formData: FormData;
  setFormData: (data: FormData) => void;
  setStep: (step: number) => void;
  onSubmit: (data: FormData) => void;
}

export function FormSteps({ step, formData, setFormData, setStep, onSubmit }: FormStepsProps) {
  const steps = {
    1: (
      <div>
        <h2 className="text-2xl font-bold mb-4">Select Region</h2>
        <div className="space-y-2">
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => {
                setFormData({ ...formData, region });
                setStep(2);
              }}
              className="w-full p-3 text-left rounded-lg border hover:bg-gray-50 transition-colors"
            >
              {region}
            </button>
          ))}
        </div>
      </div>
    ),
    2: (
      <div>
        <h2 className="text-2xl font-bold mb-4">Select Interests</h2>
        <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
          {interests.map((interest) => (
            <label
              key={interest.id}
              className="flex items-center space-x-2 p-2 rounded border hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <input
                type="checkbox"
                checked={formData.interests.includes(interest.id)}
                onChange={(e) => {
                  const newInterests = e.target.checked
                    ? [...formData.interests, interest.id]
                    : formData.interests.filter((id) => id !== interest.id);
                  setFormData({ ...formData, interests: newInterests });
                }}
                className="rounded text-purple-600 focus:ring-purple-500"
              />
              <span>{interest.label}</span>
            </label>
          ))}
        </div>
        <Button
          onClick={() => setStep(3)}
          className="mt-4 w-full"
          disabled={formData.interests.length === 0}
        >
          Next
        </Button>
      </div>
    ),
    3: (
      <div>
        <h2 className="text-2xl font-bold mb-4">Gender Preference</h2>
        <div className="space-y-2">
          {genders.map((gender) => (
            <label
              key={gender}
              className="flex items-center space-x-2 p-2 rounded border hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <input
                type="checkbox"
                checked={formData.genderPreference.includes(gender)}
                onChange={(e) => {
                  const newPreferences = e.target.checked
                    ? [...formData.genderPreference, gender]
                    : formData.genderPreference.filter((g) => g !== gender);
                  setFormData({ ...formData, genderPreference: newPreferences });
                }}
                className="rounded text-purple-600 focus:ring-purple-500"
              />
              <span className="capitalize">{gender}</span>
            </label>
          ))}
        </div>
        <Button
          onClick={() => setStep(4)}
          className="mt-4 w-full"
          disabled={formData.genderPreference.length === 0}
        >
          Next
        </Button>
      </div>
    ),
    4: (
      <div>
        <h2 className="text-2xl font-bold mb-4">ZK Proof Verification</h2>
        <p className="text-gray-600 mb-4">
          Verify your identity using zero-knowledge proof technology
        </p>
        <Button
          onClick={() => {
            setFormData({ ...formData, zkProofVerified: true });
            setStep(5);
          }}
          className="w-full"
        >
          Verify Identity
        </Button>
      </div>
    ),
    5: (
      <div>
        <h2 className="text-2xl font-bold mb-4">All Set!</h2>
        <p className="text-gray-600 mb-4">
          You're ready to find your perfect match!
        </p>
        <Button
          onClick={() => onSubmit(formData)}
          variant="gradient"
          className="w-full"
        >
          Start Matching
        </Button>
      </div>
    ),
  };

  return steps[step as keyof typeof steps] || null;
}