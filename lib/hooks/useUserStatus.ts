'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface UserStatus {
  isLoading: boolean;
  isActive: boolean;
  user: any;
  error?: string;
}

export function useUserStatus(): UserStatus {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userStatus, setUserStatus] = useState<UserStatus>({
    isLoading: true,
    isActive: false,
    user: null,
  });

  useEffect(() => {
    async function checkUserStatus() {
      if (status === 'loading') return;
      
      if (!session?.user?.email) {
        setUserStatus({
          isLoading: false,
          isActive: false,
          user: null,
          error: 'No hay sesión activa'
        });
        return;
      }

      try {
        // Llamar a API route que SÍ puede usar Node.js
        const response = await fetch('/api/user/status');
        
        if (!response.ok) {
          throw new Error('Error verificando estado del usuario');
        }

        const userData = await response.json();

        if (userData.status === 'suspended') {
          router.push('/login?error=AccountSuspended');
          return;
        }

        if (userData.status === 'inactive') {
          router.push('/login?error=AccountInactive');
          return;
        }

        setUserStatus({
          isLoading: false,
          isActive: userData.status === 'active',
          user: userData,
        });

      } catch (error) { 
        setUserStatus({
          isLoading: false,
          isActive: true, // En caso de error, permitir acceso
          user: session.user,
          error: 'Error verificando estado'
        });
      }
    }

    checkUserStatus();
  }, [session, status, router]);

  return userStatus;
}

// Hook para verificar si es admin
export function useIsAdmin(): boolean {
  const { data: session } = useSession();
  return (session?.user as any)?.role === 'admin';
}

// Hook para verificar permisos específicos
export function useHasPermission(requiredRole: 'admin' | 'user' | 'viewer'): boolean {
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role as 'admin' | 'user' | 'viewer';
  
  const roleHierarchy: Record<'admin' | 'user' | 'viewer', number> = {
    'admin': 3,
    'user': 2,
    'viewer': 1,
  };

  if (!userRole || !roleHierarchy[userRole]) return false;
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}
