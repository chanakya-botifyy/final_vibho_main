import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ResetPasswordForm } from '../components/Auth/ResetPasswordForm';

const ResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  
  const handleBackToSignIn = () => {
    navigate('/');
  };

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">Invalid Reset Link</h1>
          <p className="mb-4">The password reset link is invalid or has expired.</p>
          <button 
            onClick={handleBackToSignIn}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return <ResetPasswordForm token={token} onBack={handleBackToSignIn} />;
};

export default ResetPasswordPage;