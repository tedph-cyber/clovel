'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TetrisLoading from '@/components/ui/tetris-loader';
import { Eye, EyeOff, Mail, Lock, ArrowRight, BookOpen, Users, Sparkles, CheckCircle } from 'lucide-react';

// Loading component for Suspense fallback
function LoginLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <div className="flex items-center justify-center mb-4">
              <TetrisLoading size="sm" speed="normal" showLoadingText={false} />
            </div>
            <CardTitle className="text-2xl font-bold text-center text-gray-900">
              Loading...
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}

// Main login component that uses useSearchParams
function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  // Check for success message from registration
  useEffect(() => {
    const message = searchParams.get('message');
    if (message) {
      setSuccessMessage(message);
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setSuccessMessage(''); // Clear any success message
    
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'login',
          email: formData.email,
          password: formData.password,
          rememberMe: formData.rememberMe,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Login successful - redirect to dashboard or home
        const redirectTo = searchParams.get('redirect') || '/';
        router.push(redirectTo);
      } else {
        // Handle login error
        setErrors({ submit: result.error || 'Login failed. Please check your credentials.' });
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50">
      <div className="flex min-h-screen">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-500 to-orange-400 p-12 flex-col justify-center items-center relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full"></div>
            <div className="absolute bottom-32 right-16 w-24 h-24 bg-white rounded-full"></div>
            <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white rounded-full"></div>
            <div className="absolute bottom-1/4 left-1/4 w-20 h-20 bg-white rounded-full"></div>
          </div>
          
          {/* Content */}
          <div className="text-center text-white z-10 max-w-md">
            <div className="mb-8">
              <Image
                src="/clovel.png"
                alt="Clovel"
                width={120}
                height={120}
                className="mx-auto mb-6 drop-shadow-lg"
              />
              <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
              <p className="text-xl text-emerald-100">
                Continue your reading adventure where you left off
              </p>
            </div>
            
            <div className="space-y-4 text-emerald-100">
              <div className="flex items-center space-x-3">
                <BookOpen className="h-6 w-6" />
                <span>Access your personal library</span>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="h-6 w-6" />
                <span>Connect with fellow readers</span>
              </div>
              <div className="flex items-center space-x-3">
                <Sparkles className="h-6 w-6" />
                <span>Discover personalized recommendations</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <Image
                src="/clovel.png"
                alt="Clovel"
                width={80}
                height={80}
                className="mx-auto mb-4"
              />
              <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
            </div>

            {/* Success Message */}
            {successMessage && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <p className="text-sm text-green-700">{successMessage}</p>
                </div>
              </div>
            )}

            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-gray-900 hidden lg:block">
                  Sign In to Your Account
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Enter your credentials to continue
                </p>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Field */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      name="email"
                      type="email"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`pl-10 ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-emerald-500'}`}
                      disabled={isLoading}
                      autoComplete="email"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`pl-10 pr-10 ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-emerald-500'}`}
                      disabled={isLoading}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                    )}
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                        disabled={isLoading}
                      />
                      <span className="ml-2 text-sm text-gray-700">Remember me</span>
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {/* Submit Error */}
                  {errors.submit && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                      <p className="text-sm text-red-700">{errors.submit}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-emerald-500 to-orange-400 hover:from-emerald-600 hover:to-orange-500 text-white shadow-lg"
                    size="lg"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="scale-50">
                          <TetrisLoading size="sm" speed="fast" showLoadingText={false} />
                        </div>
                        <span>Signing In...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>Sign In</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    )}
                  </Button>

                  {/* Demo Account */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">or</span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-gray-300 hover:bg-gray-50"
                    onClick={() => {
                      setFormData({
                        email: 'demo@clovel.com',
                        password: 'demo123',
                        rememberMe: false,
                      });
                    }}
                    disabled={isLoading}
                  >
                    Try Demo Account
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Register Link */}
            <div className="text-center mt-6">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link 
                  href="/register" 
                  className="font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  Create one here
                </Link>
              </p>
            </div>

            {/* Back to Home */}
            <div className="text-center mt-4">
              <Link 
                href="/" 
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors inline-flex items-center space-x-1"
              >
                <ArrowRight className="h-3 w-3 rotate-180" />
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginPageContent />
    </Suspense>
  );
}
