import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';
import { toast } from 'sonner';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const { login, register, loading } = useAuth(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login({ email, password });
        toast.success("Welcome back!");
      } else {
        await register({ email, password, name });
        toast.success("Account created successfully!");
      }
      navigate(ROUTES.HOME);
    } catch (error: any) {
      toast.error(error?.message || "Authentication failed. Please try again.");
    }
  };

  const handleGoogleAuth = () => {
    // Redirect to Spring Boot OAuth2 endpoint
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-black overflow-hidden" style={{ height: '100vh' }}>
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 scale-105"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1920")'
        }}
      />
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 z-0 bg-black/60 backdrop-blur-[2px]" />

      {/* Back to Home Button */}
      <Link 
        to={ROUTES.HOME}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-gray-300 hover:text-white transition-colors group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-semibold tracking-wide uppercase">Home</span>
      </Link>

      <div className="relative z-10 w-full max-w-md" style={{ maxHeight: '100vh', overflowY: 'auto' }}>
        {/* Logo / Header */}
        <div className="text-center flex flex-col items-center font-sans" style={{ marginBottom: '20px', marginTop: '10px' }}>
          <img 
            src="/logo.jpeg" 
            alt="The Soul On Summit Logo" 
            className="rounded-full shadow-lg shadow-black/40 border-2 border-white/10" 
            style={{ width: '96px', height: '96px', marginBottom: '16px', objectFit: 'cover' }} 
          />
          <h1 className="text-white font-sans font-extrabold tracking-tight" style={{ fontSize: '28px', lineHeight: '1.2' }}>
            {isLogin ? 'Welcome Back' : 'Join the Adventure'}
          </h1>
          <p className="text-gray-300 font-medium font-sans" style={{ marginTop: '4px', fontSize: '14px' }}>
            {isLogin 
              ? 'Log in to manage your bookings and explore new treks.' 
              : 'Create an account to start your journey into the mountains.'}
          </p>
        </div>

        {/* Glassmorphism Card */}
        <div 
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[20px] shadow-2xl"
          style={{ padding: '24px' }}
        >
          <form onSubmit={handleSubmit} className="flex flex-col" style={{ gap: '16px' }}>
            
            {/* Name Input (Register Only) */}
            {!isLogin && (
              <div className="flex flex-col animate-in fade-in slide-in-from-top-2 duration-300" style={{ gap: '8px' }}>
                <label className="text-[14px] font-semibold text-gray-200 ml-1">Full Name</label>
                <div className="relative">
                  <User 
                    className="absolute text-gray-400" 
                    style={{ left: '14px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px' }} 
                  />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent focus:bg-white/10 transition-all"
                    style={{ padding: '12px 14px 12px 42px', fontSize: '14px' }}
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col" style={{ gap: '8px' }}>
              <label className="text-[14px] font-semibold text-gray-200 ml-1">Email Address</label>
              <div className="relative">
                <Mail 
                  className="absolute text-gray-400" 
                  style={{ left: '14px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px' }} 
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent focus:bg-white/10 transition-all"
                  style={{ padding: '12px 14px 12px 42px', fontSize: '14px' }}
                />
              </div>
            </div>

            <div className="flex flex-col" style={{ gap: '8px' }}>
              <div className="flex items-center justify-between ml-1">
                <label className="text-[14px] font-semibold text-gray-200">Password</label>
                {isLogin && (
                  <button type="button" className="text-xs font-medium text-[#F59E0B] hover:text-[#FCD34D] transition-colors">
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock 
                  className="absolute text-gray-400" 
                  style={{ left: '14px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px' }} 
                />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent focus:bg-white/10 transition-all"
                  style={{ padding: '12px 14px 12px 42px', fontSize: '14px', letterSpacing: password ? '2px' : 'normal' }}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#F59E0B] hover:bg-[#D97706] text-[#1C2B3A] font-bold rounded-xl shadow-[0_8px_20px_rgba(245,158,11,0.3)] transition-all hover:-translate-y-0.5 group flex justify-center items-center disabled:opacity-50 disabled:hover:translate-y-0"
              style={{ height: '46px', marginTop: '8px', fontSize: '15px' }}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : isLogin ? 'Sign In' : 'Create Account'}
              {!loading && <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </form>

          <div className="flex items-center justify-between" style={{ marginTop: '24px', marginBottom: '20px' }}>
            <div className="h-px bg-white/10 flex-1" />
            <span className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Or continue with</span>
            <div className="h-px bg-white/10 flex-1" />
          </div>

          <Button 
            type="button" 
            variant="outline" 
            onClick={handleGoogleAuth}
            className="w-full bg-white hover:bg-gray-50 text-gray-900 border-none rounded-xl font-bold transition-all shadow-md flex items-center justify-center"
            style={{ height: '46px', fontSize: '14px' }}
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign in with Google
          </Button>
        </div>

        {/* Toggle between Login and Register */}
        <div className="text-center" style={{ marginTop: '24px' }}>
          <p className="text-gray-300 font-medium text-[14px]">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#F59E0B] font-bold hover:text-[#FCD34D] hover:underline transition-all focus:outline-none"
            >
              {isLogin ? 'Register now' : 'Sign In'}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}
