import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import apiClient from '@/api/apiClient';
import type { AuthResponse } from '@/types/auth';

export default function OAuth2Callback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { establishSession } = useAuth();
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      toast.error(error.replace(/_/g, ' ') || 'Authentication failed');
      navigate(ROUTES.LOGIN, { replace: true });
      return;
    }

    if (!code) {
      toast.error('No authorization code provided');
      navigate(ROUTES.LOGIN, { replace: true });
      return;
    }

    const exchangeCode = async () => {
      try {
        const response = await apiClient.post<{ data: AuthResponse }>('/auth/oauth2/exchange', { code });
        const { accessToken, refreshToken, user } = response.data.data;
        establishSession(user, accessToken, refreshToken);
        toast.success(`Welcome back, ${user.firstName}!`);
        if (user.roles?.includes('ROLE_ADMIN')) {
          navigate(ROUTES.ADMIN, { replace: true });
        } else {
          navigate(ROUTES.HOME, { replace: true });
        }
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Failed to exchange authorization code');
        navigate(ROUTES.LOGIN, { replace: true });
      }
    };

    exchangeCode();
  }, [searchParams, navigate, establishSession]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <Loader2 className="w-12 h-12 text-[#F59E0B] animate-spin mb-4" />
      <h2 className="text-white text-xl font-semibold">Completing authentication...</h2>
      <p className="text-gray-400 mt-2">Please wait while we log you in securely.</p>
    </div>
  );
}
