'use client';

import { useUserStatus } from '@/lib/hooks/useUserStatus';
import { ReactNode } from 'react';

interface ProtectedPageProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'user' | 'viewer';
  fallback?: ReactNode;
}

export default function ProtectedPage({ 
  children, 
  requiredRole = 'user',
  fallback
}: ProtectedPageProps) {
  const { isLoading, isActive, user, error } = useUserStatus();

  if (isLoading) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Error de verificación
          </h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!isActive) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Acceso denegado
          </h2>
          <p className="text-gray-600">Tu cuenta no está activa.</p>
        </div>
      </div>
    );
  }

  // Verificar rol si es requerido
  if (requiredRole && user?.role) {
    const roleHierarchy: Record<string, number> = {
      'admin': 3,
      'user': 2,
      'viewer': 1,
    };

    const hasPermission = roleHierarchy[user.role] >= roleHierarchy[requiredRole];
    
    if (!hasPermission) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              Permisos insuficientes
            </h2>
            <p className="text-gray-600">
              Necesitas permisos de {requiredRole} para acceder a esta página.
            </p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}