import React, { useState } from 'react';
import { Heart, X, Check, User, Tag, Shield, ChevronRight, ChevronLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { ReclaimProofRequest } from '@reclaimprotocol/js-sdk';

interface FormData {
  name: string;
  bio: string;
  interests: string[];
  kycVerified?: boolean;
  reclaimProofs?: any;
}

const Profile = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [requestUrl, setRequestUrl] = useState('');
  const [proofs, setProofs] = useState([]);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    bio: '',
    interests: [],
    kycVerified: true,
  });
  const [currentInterest, setCurrentInterest] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'failed' | null>(null);

  const handleInterestAdd = () => {
    if (currentInterest.trim() && !formData.interests.includes(currentInterest.trim())) {
      setFormData({
        ...formData,
        interests: [...formData.interests, currentInterest.trim()]
      });
      setCurrentInterest('');
    }
  };

  const handleInterestRemove = (interest: string) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter(i => i !== interest)
    });
  };

  const validateForm = () => {
    if (step === 1) {
      if (!formData.name.trim()) {
        setError('Name is required');
        return false;
      }
      if (!formData.bio.trim()) {
        setError('Bio is required');
        return false;
      }
    }
    if (step === 2 && formData.interests.length === 0) {
      setError('Add at least one interest');
      return false;
    }
    setError('');
    return true;
  };

  const handleNextStep = () => {
    if (validateForm()) {
      setStep(step + 1);
    }
  };

  const getVerificationReq = async () => {
    try {
      setIsLoading(true);
      setError('');
      setVerificationStatus('pending');

      const APP_ID = '0xc0F8A34dd0a107efe2074259858CE08E9d537C18';
      const APP_SECRET = '0xc96aad29eafdc0701943ce863b61782c0994c989a247fe2ad161c0ed967c2bec';
      const PROVIDER_ID = 'f9f383fd-32d9-4c54-942f-5e9fda349762';

      const reclaimProofRequest = await ReclaimProofRequest.init(APP_ID, APP_SECRET, PROVIDER_ID);
      const url = await reclaimProofRequest.getRequestUrl();
      setRequestUrl(url);

      await reclaimProofRequest.startSession({
        onSuccess: async (verificationProofs) => {
          setProofs(verificationProofs);
          setVerificationStatus('success');
          setFormData(prev => ({
            ...prev,
            kycVerified: true,
            reclaimProofs: verificationProofs
          }));
          await handleCreateProfile(verificationProofs);
        },
        onError: (error) => {
          console.error('Verification failed', error);
          setError('Verification failed. Please try again.');
          setVerificationStatus('failed');
        },
      });
    } catch (err) {
      console.error('Error starting verification:', err);
      setError('Failed to start verification. Please try again.');
      setVerificationStatus('failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProfile = async (verificationProofs?: any) => {
    try {
      setIsLoading(true);
      setError('');

      const profileData = {
        ...formData,
        kycVerified: true,
        reclaimProofs: verificationProofs || proofs
      };

      const response = await fetch('http://localhost:5001/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create profile');
      }

      localStorage.setItem('userData', JSON.stringify(data.data));
      localStorage.setItem('profile_success', 'true');

      setStep(4);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      console.error('Error creating profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-gray-700 font-medium block">Display Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-300"
                placeholder="Enter your display name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-gray-700 font-medium block">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-300 h-32 resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-gray-700 font-medium block">Add Your Interests</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentInterest}
                  onChange={(e) => setCurrentInterest(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleInterestAdd()}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-300"
                  placeholder="Type an interest and press Enter"
                />
                <button
                  onClick={handleInterestAdd}
                  className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-300"
                >
                  Add
                </button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {formData.interests.map((interest, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-red-50 text-red-600 border border-red-200 group hover:bg-red-100 transition-colors duration-300"
                >
                  {interest}
                  <button
                    onClick={() => handleInterestRemove(interest)}
                    className="ml-2 p-1 rounded-full hover:bg-red-200 transition-colors duration-300"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-12 h-12 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">KYC Verification</h3>
            <p className="text-gray-600 mb-6">
              Verify your identity using your Gmail account
            </p>

            {error && (
              <p className="text-red-500 text-sm mb-4">{error}</p>
            )}

            {!requestUrl && (
              <button
                onClick={getVerificationReq}
                disabled={isLoading}
                className={`px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-300 flex items-center justify-center mx-auto ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                ) : null}
                {isLoading ? 'Generating QR Code...' : 'Start Verification'}
              </button>
            )}

            {requestUrl && verificationStatus === 'pending' && (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl shadow-lg inline-block">
                  <QRCode value={requestUrl} />
                </div>
                <p className="text-gray-600">
                  Scan the QR code using your mobile device to verify your Gmail account
                </p>
              </div>
            )}

            {verificationStatus === 'success' && (
              <div className="text-green-500 font-medium flex items-center justify-center">
                <Check className="w-5 h-5 mr-2" />
                Verification successful! Processing...
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-12 h-12 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Profile Created!</h3>
            <p className="text-gray-600">
              Your profile has been successfully created and verified. Start exploring matches!
            </p>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl hover:from-red-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-red-300/50"
            >
              <Home className="w-5 h-5 mr-2" />
              Go to Homepage
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F8] py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-12">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-200 -translate-y-1/2">
                <div 
                  className="h-full bg-gradient-to-r from-red-500 to-rose-500 transition-all duration-500 ease-out"
                  style={{ width: `${((step - 1) / 3) * 100}%` }}
                />
              </div>
              {[
                { icon: User, label: 'Profile' },
                { icon: Tag, label: 'Interests' },
                { icon: Shield, label: 'Verify' },
                { icon: Heart, label: 'Complete' }
              ].map((s, i) => (
                <div
                  key={i}
                  className={`relative flex flex-col items-center ${
                    i + 1 <= step ? 'text-red-600' : 'text-gray-400'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      i + 1 <= step
                        ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white'
                        : 'bg-gray-200'
                    } transition-all duration-300`}
                  >
                    <s.icon className="w-5 h-5" />
                  </div>
                  <span className="mt-2 text-sm font-medium">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            {error && step !== 3 && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">
                {error}
              </div>
            )}
            {renderStep()}
          </div>

          {step < 4 && step !== 3 && (
            <div className="flex justify-between mt-8">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="inline-flex items-center px-6 py-3 text-gray-600 hover:text-red-600 transition-colors duration-300"
                  disabled={isLoading}
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Back
                </button>
              )}
              {step < 3 && (
                <button
                  onClick={handleNextStep}
                  disabled={isLoading}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl hover:from-red-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-red-300/50 ml-auto"
                >
                  Next Step
                  <ChevronRight className="w-5 h-5 ml-2" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;