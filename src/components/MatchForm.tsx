import React from 'react';
import { X } from 'lucide-react';
import { interests } from '../lib/utils';
import type { FormData } from '../types';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
};

export function MatchForm({ isOpen, onClose, onSubmit }: Props) {
  const [step, setStep] = React.useState(1);
  const [formData, setFormData] = React.useState<FormData>({
    region: 'North America',
    interests: [],
    genderPreference: [],
    zkProofVerified: false,
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="mb-8">
          <div className="flex justify-between mb-4">
            {[1, 2, 3, 4, 5].map((num) => (
              <div
                key={num}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= num
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {num}
              </div>
            ))}
          </div>
        </div>

        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Select Region</h2>
            <div className="space-y-2">
              {['North America', 'South America', 'Europe', 'Asia'].map((region) => (
                <button
                  key={region}
                  onClick={() => {
                    setFormData({ ...formData, region: region as any });
                    setStep(2);
                  }}
                  className="w-full p-3 text-left rounded-lg border hover:bg-gray-50"
                >
                  {region}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Select Interests</h2>
            <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
              {interests.map((interest) => (
                <label
                  key={interest.id}
                  className="flex items-center space-x-2 p-2 rounded border"
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
                  />
                  <span>{interest.label}</span>
                </label>
              ))}
            </div>
            <button
              onClick={() => setStep(3)}
              className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg"
            >
              Next
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Gender Preference</h2>
            <div className="space-y-2">
              {['male', 'female', 'non-binary'].map((gender) => (
                <label key={gender} className="flex items-center space-x-2 p-2 rounded border">
                  <input
                    type="checkbox"
                    checked={formData.genderPreference.includes(gender as any)}
                    onChange={(e) => {
                      const newPreferences = e.target.checked
                        ? [...formData.genderPreference, gender as any]
                        : formData.genderPreference.filter((g) => g !== gender);
                      setFormData({ ...formData, genderPreference: newPreferences });
                    }}
                  />
                  <span className="capitalize">{gender}</span>
                </label>
              ))}
            </div>
            <button
              onClick={() => setStep(4)}
              className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg"
            >
              Next
            </button>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">ZK Proof Verification</h2>
            <p className="text-gray-600 mb-4">
              Verify your identity using zero-knowledge proof technology
            </p>
            <button
              onClick={() => {
                setFormData({ ...formData, zkProofVerified: true });
                setStep(5);
              }}
              className="w-full bg-purple-600 text-white py-2 rounded-lg"
            >
              Verify Identity
            </button>
          </div>
        )}

        {step === 5 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">All Set!</h2>
            <p className="text-gray-600 mb-4">
              You're ready to find your perfect match!
            </p>
            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 rounded-lg"
            >
              Start Matching
            </button>
          </div>
        )}
      </div>
    </div>
  );
}