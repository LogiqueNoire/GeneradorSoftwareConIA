'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

interface TourState {
  shouldShow: boolean;
  isLoading: boolean;
  tourCompleted: boolean;
}

export function useTour() {
  const { data: session, status, update } = useSession();
  const [tourState, setTourState] = useState<TourState>({
    shouldShow: false,
    isLoading: true,
    tourCompleted: false,
  });
  const [forceApiCheck, setForceApiCheck] = useState(false);

  useEffect(() => {
    async function checkTourStatus() {
      if (status === 'loading') return;
      
      if (!session?.user) {
        setTourState({
          shouldShow: false,
          isLoading: false,
          tourCompleted: true,
        });
        return;
      }

      // Si acabamos de completar el tour, siempre consultar la API
      const sessionTourCompleted = (session.user as any)?.tourCompleted;
      
      if (!forceApiCheck && sessionTourCompleted === false) {
        // Si en la sesión dice que NO ha completado el tour, mostrarlo
        setTourState({
          shouldShow: true,
          isLoading: false,
          tourCompleted: false,
        });
        return;
      } else if (!forceApiCheck && sessionTourCompleted === true) {
        // Si en la sesión dice que SÍ ha completado el tour, no mostrarlo
        setTourState({
          shouldShow: false,
          isLoading: false,
          tourCompleted: true,
        });
        return;
      }

      // Consultar la API para obtener el estado actual
      try {
        const response = await fetch('/api/tour', {
          // Añadir timestamp para evitar cache
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setTourState({
            shouldShow: data.shouldShowTour,
            isLoading: false,
            tourCompleted: data.tourCompleted,
          });
          
          // Reset force check flag
          if (forceApiCheck) {
            setForceApiCheck(false);
          }
        } else {
          setTourState({
            shouldShow: false,
            isLoading: false,
            tourCompleted: true,
          });
        }
      } catch (error) {
        setTourState({
          shouldShow: false,
          isLoading: false,
          tourCompleted: true,
        });
      }
    }

    checkTourStatus();
  }, [session, status, forceApiCheck]);

  const completeTour = async () => {
    try {
      const response = await fetch('/api/tour', {
        method: 'POST',
      });

      if (response.ok) {
        // Primero actualizar estado local inmediatamente
        setTourState(prev => ({
          ...prev,
          shouldShow: false,
          tourCompleted: true,
        }));
        
        // Forzar verificación con la API en el próximo ciclo
        setForceApiCheck(true);
        
        // Actualizar sesión de NextAuth
        await update();
        
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const skipTour = () => {
    // Marcar como completado
    completeTour();
  };

  return {
    ...tourState,
    completeTour,
    skipTour,
  };
}