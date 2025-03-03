import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Family } from '../types/types';
import { getTokenDetails, verifyProfileToken, ProfileVerificationError } from '../services/profileLinkService';
import AnimatedPage from './common/AnimatedPage';

interface VerificationState {
  phone: string;
  nic: string;
  maskedPhone: string;
  maskedNIC: string;
  step: number;
  error: string | null;
  loading: boolean;
  verified: boolean;
}

const ProfileVerification: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [state, setState] = useState<VerificationState>({
    phone: '',
    nic: '',
    maskedPhone: '',
    maskedNIC: '',
    step: 0,
    error: null,
    loading: true,
    verified: false
  });

  useEffect(() => {
    const loadTokenDetails = async () => {
      try {
        if (!token) throw new Error('No token provided');
        const details = await getTokenDetails(token);
        setState(prev => ({
          ...prev,
          maskedPhone: details.maskedPhone,
          maskedNIC: details.maskedNIC,
          loading: false
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error instanceof ProfileVerificationError ? error.message : 'Failed to load verification details',
          loading: false
        }));
      }
    };

    loadTokenDetails();
  }, [token]);

  const handleVerify = async () => {
    if (!token) return;
    
    // setState(prev => ({ ...prev, loading: true, error: null }));
    try {
        
      console.log('Starting verification with:', { token, phone: state.phone, nic: state.nic });
      await verifyProfileToken(token, state.phone, state.nic);
      // return
      console.log('Verification successful, redirecting to family profile...');
      setState(prev => ({ ...prev, verified: true, loading: false }));
      
      // Get token details again to get the familyId after verification
      const details = await getTokenDetails(token);
      navigate(`/families/${details.familyId}?token=${token}`);
    } catch (error) {
      console.error('Verification failed:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof ProfileVerificationError ? error.message : 'Failed to verify profile link',
        loading: false
      }));
    }
  };

  const handleNext = () => {
    setState(prev => ({ ...prev, step: prev.step + 1 }));
  };

  const steps = ['Phone Verification', 'NIC Verification'];

  if (state.loading) {
    return (
      <AnimatedPage>
        <div className="min-h-screen bg-[#fbfbfd] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  if (state.error) {
    return (
      <AnimatedPage>
        <div className="min-h-screen bg-[#fbfbfd] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="max-w-md w-full"
          >
            <div className="bg-white rounded-3xl shadow-lg p-8 text-center border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Verification Failed
              </h2>
              <p className="text-gray-500 mb-8">
                {state.error}
              </p>
              <button
                onClick={() => navigate('/')}
                className="w-full bg-[#0071e3] text-white rounded-full py-3 px-4 font-medium hover:bg-[#0077ED] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0071e3] transform transition-all duration-200"
              >
                Return Home
              </button>
            </div>
          </motion.div>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-[#fbfbfd] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="max-w-md w-full"
        >
          <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-semibold text-center text-gray-900 mb-2">
              Verify Your Identity
            </h2>
            <p className="text-gray-500 text-center mb-8">
              Please verify your identity to access your family profile
            </p>

            <div className="mb-8">
              <div className="flex items-center justify-between">
                {steps.map((label, index) => (
                  <div key={label} className="flex flex-col items-center flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 
                      ${index === state.step ? 'bg-[#0071e3] text-white' : 
                        index < state.step ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                      {index + 1}
                    </div>
                    <div className="text-sm text-gray-500">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {state.step === 0 ? (
                <motion.div
                  key="phone"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter your phone number matching:
                    </label>
                    <div className="font-mono text-lg mb-4 text-gray-900">
                      {state.maskedPhone}
                    </div>
                    <input
                      type="text"
                      value={state.phone}
                      onChange={(e) => setState(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent"
                      placeholder="Enter phone number"
                    />
                  </div>

                  <button
                    onClick={handleNext}
                    disabled={!state.phone}
                    className={`w-full bg-[#0071e3] text-white rounded-full py-3 px-4 font-medium 
                      ${!state.phone ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#0077ED]'} 
                      transform transition-all duration-200`}
                  >
                    Next
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="nic"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter your NIC number matching:
                    </label>
                    <div className="font-mono text-lg mb-4 text-gray-900">
                      {state.maskedNIC}
                    </div>
                    <input
                      type="text"
                      value={state.nic}
                      onChange={(e) => setState(prev => ({ ...prev, nic: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent"
                      placeholder="Enter NIC number"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setState(prev => ({ ...prev, step: 0 }))}
                      className="flex-1 border border-[#0071e3] text-[#0071e3] rounded-full py-3 px-4 font-medium 
                        hover:bg-[#0071e3]/5 transform transition-all duration-200"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleVerify}
                      disabled={!state.nic || state.loading}
                      className={`flex-1 bg-[#0071e3] text-white rounded-full py-3 px-4 font-medium 
                        ${(!state.nic || state.loading) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#0077ED]'} 
                        transform transition-all duration-200`}
                    >
                      {state.loading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        </div>
                      ) : (
                        'Verify'
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatedPage>
  );
};

export default ProfileVerification;