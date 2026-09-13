import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, AlertCircle, Video } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';

const RegisterPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const { register } = useAuth();
  const { toast } = useAlert();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // Basic Validations
    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      toast.warning('Passwords do not match.', 'Validation Error');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      toast.warning('Password must be at least 6 characters long.', 'Weak Password');
      return;
    }

    setIsSubmitting(true);
    try {
      await register(firstName, lastName, email, password);
      toast.success('Account created successfully! Welcome to InterviewAI.', 'Registration Complete');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.message || 'Registration failed. Please verify your details.';
      setFormError(msg);
      toast.error(msg, 'Registration Failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 mesh-bg">
      {/* Branding float */}
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 font-display font-bold text-xl tracking-tight text-midnight">
        <div className="bg-primary text-white p-1.5 rounded-lg flex items-center justify-center">
          <Video size={18} />
        </div>
        <span>Interview<span className="text-primary">AI</span></span>
      </Link>

      <div className="w-full max-w-md">
        <div className="glass-card p-8 md:p-10 border border-white/60 shadow-premium">
          <div className="flex flex-col gap-2 mb-8">
            <h2 className="font-display font-extrabold text-2xl md:text-3xl text-midnight">Create Account</h2>
            <p className="text-sm text-gray-500">Register to start your mock interview practice.</p>
          </div>

          {formError && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex gap-2.5 items-start">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">First Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                    <User size={14} />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Jane"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-cream-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all bg-cream/10"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Last Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                    <User size={14} />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-cream-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all bg-cream/10"
                  />
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                  <Mail size={14} />
                </span>
                <input
                  type="email"
                  required
                  placeholder="jane.doe@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-cream-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all bg-cream/10"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                  <Lock size={14} />
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-cream-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all bg-cream/10"
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Confirm Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                  <Lock size={14} />
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-cream-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all bg-cream/10"
                />
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-2 mt-1">
              <input
                type="checkbox"
                required
                id="terms"
                className="w-4 h-4 rounded border-cream-border text-primary focus:ring-primary/20 mt-0.5"
              />
              <label htmlFor="terms" className="text-xs text-gray-500 cursor-pointer leading-relaxed">
                I agree to let InterviewAI analyze my camera feed and voice for confidence indicators.
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full py-3.5 mt-3 flex items-center justify-center gap-2 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{isSubmitting ? 'Creating Account...' : 'Sign Up'}</span>
              {!isSubmitting && <ArrowRight size={16} />}
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-gray-500">
            Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
