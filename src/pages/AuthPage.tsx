import React, { useState } from 'react';
import { LoginForm } from '../components/Auth/LoginForm';
import { SignupForm } from '../components/Auth/SignupForm';
import { ForgotPasswordForm } from '../components/Auth/ForgotPasswordForm';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const toggleForm = () => {
    setIsLogin(prev => !prev);
    setShowForgotPassword(false);
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleBackToSignIn = () => {
    setShowForgotPassword(false);
  };

  if (showForgotPassword) {
    return <ForgotPasswordForm onBack={handleBackToSignIn} />;
  }

  return isLogin ? (
    <LoginForm onToggleForm={toggleForm} onForgotPassword={handleForgotPassword} />
  ) : (
    <SignupForm onToggleForm={toggleForm} />
  );
};

export default AuthPage;