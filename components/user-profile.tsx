'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { User, UserService } from '@/lib/database';

export default function UserProfile() {
  const { data: session } = useSession();
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserDetails() {
      if (session?.user?.email) {
        try {
          const user = await UserService.getUserByEmail(session.user.email);
          setUserDetails(user);
        } catch (error) {
          console.error('Error fetching user details:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }

    fetchUserDetails();
  }, [session]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (!session) {
    return <div>No has iniciado sesión</div>;
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center space-x-4">
        {session.user.image && (
          <img
            src={session.user.image}
            alt={session.user.name || 'Usuario'}
            className="w-16 h-16 rounded-full"
          />
        )}
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {session.user.name || 'Usuario'}
          </h2>
          <p className="text-gray-600">{session.user.email}</p>
        </div>
      </div>

      {userDetails && (
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Proveedor SSO
            </label>
            <p className="mt-1 text-sm text-gray-900 capitalize">
              {userDetails.sso_provider}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Rol
            </label>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              userDetails.role === 'admin' ? 'bg-purple-100 text-purple-800' :
              userDetails.role === 'user' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {userDetails.role}
            </span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Estado
            </label>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              userDetails.status === 'active' ? 'bg-green-100 text-green-800' :
              userDetails.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {userDetails.status}
            </span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Último login
            </label>
            <p className="mt-1 text-sm text-gray-900">
              {userDetails.last_login_at 
                ? new Date(userDetails.last_login_at).toLocaleString('es-ES')
                : 'Primera vez'
              }
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Miembro desde
            </label>
            <p className="mt-1 text-sm text-gray-900">
              {new Date(userDetails.created_at).toLocaleDateString('es-ES')}
            </p>
          </div>

          {userDetails.company && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Empresa
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {userDetails.company}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 text-xs text-gray-500">
        <p>ID de sesión: {session.user.id}</p>
        {userDetails && (
          <p>ID de base de datos: {userDetails.id}</p>
        )}
      </div>
    </div>
  );
}