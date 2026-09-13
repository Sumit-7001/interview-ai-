import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, ArrowRight, AlertCircle, Video } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const { login } = useAuth();
  const { toast } = useAlert();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const isExpired = searchParams.get('expired') === 'true';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      toast.success('Signed in successfully. Welcome to your workspace!', 'Welcome Back');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.message || 'Login failed. Please verify email and password.';
      setFormError(msg);
      toast.error(msg, 'Authentication Failed');
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
            <h2 className="font-display font-extrabold text-2xl md:text-3xl text-midnight">Welcome Back</h2>
            <p className="text-sm text-gray-500">Sign in to your practice room dashboard.</p>
          </div>

          {isExpired && (
            <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex gap-2.5 items-start">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>Your session has expired. Please sign in again.</span>
            </div>
          )}

          {formError && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex gap-2.5 items-start">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-cream-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all bg-cream/10"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Password</label>
                <Link to="#" className="text-xs text-primary font-medium hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-cream-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all bg-cream/10"
                />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2 mt-1">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded border-cream-border text-primary focus:ring-primary/20"
              />
              <label htmlFor="remember" className="text-xs font-medium text-gray-500 cursor-pointer">Remember this device</label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full py-3.5 mt-2 flex items-center justify-center gap-2 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{isSubmitting ? 'Verifying Account...' : 'Sign In'}</span>
              {!isSubmitting && <ArrowRight size={16} />}
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-gray-500">
            Don't have an account? <Link to="/register" className="text-primary font-semibold hover:underline">Create an account</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
