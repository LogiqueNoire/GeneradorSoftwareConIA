'use client';

import { useState, useEffect } from 'react';
import { useTour } from '@/lib/hooks/useTour';

interface TourStep {
  id: string;
  title: string;
  content: string;
  target?: string; // selector CSS del elemento a resaltar
  position: 'top' | 'bottom' | 'left' | 'right';
  action?: 'highlight' | 'click' | 'navigate'; // acción a realizar
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: '¡Bienvenido! 👋',
    content: 'Te damos la bienvenida a nuestra plataforma. Te mostramos las funciones principales en unos sencillos pasos.',
    position: 'bottom'
  },
  {
    id: 'navigation',
    title: 'Navegación 🧭', 
    content: 'Aquí tienes el menú de navegación. Desde aquí puedes acceder a todas las secciones de la plataforma.',
    target: 'nav, header, [role="navigation"], .navigation, .navbar, .menu, .top-bar',
    position: 'bottom',
    action: 'highlight' // Solo resaltar
  },
  {
    id: 'profile',
    title: 'Tu Perfil 👤',
    content: 'Haz clic en tu avatar o menú de usuario para acceder a tu perfil y configuración de cuenta.',
    target: '[data-tour="profile"], .user-menu, .profile-button, .user-avatar, .user-info, .dropdown-toggle, .avatar',
    position: 'left',
    action: 'click' // Intentar hacer click
  },
  {
    id: 'main-features', 
    title: 'Área Principal ⚡',
    content: 'Esta es el área principal donde encontrarás todas las herramientas y funciones de la plataforma.',
    target: '.main-content, main, [data-tour="features"], .content, .dashboard, .container, .main',
    position: 'top',
    action: 'highlight'
  },
  {
    id: 'finish',
    title: '¡Todo listo! 🎉',
    content: 'Ya conoces lo básico. Explora la plataforma y si necesitas ayuda, visita la sección de Soporte.',
    position: 'bottom'
  }
];

export default function InteractiveTour() {
  const { shouldShow, isLoading, completeTour, skipTour } = useTour();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [modalPosition, setModalPosition] = useState({ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' });

  // Efecto para resaltar elemento target y posicionar modal
  const highlightElementAndPosition = (selector?: string, position: string = 'bottom', action?: string) => {
    // Remover highlights previos
    document.querySelectorAll('.tour-highlight, .tour-spotlight').forEach(el => {
      el.classList.remove('tour-highlight', 'tour-spotlight');
    });

    // Remover overlay anterior si existe
    const existingOverlay = document.querySelector('.tour-custom-overlay');
    if (existingOverlay) {
      existingOverlay.remove();
    }

    if (selector) {
      // Buscar el elemento con múltiples selectores
      const selectors = selector.split(',').map(s => s.trim());
      let element: Element | null = null;
      
      // Primero intentar con selectores CSS estándar
      for (const sel of selectors) {
        try {
          element = document.querySelector(sel);
          if (element) break;
        } catch (e) {
          // Ignorar selectores inválidos
          continue;
        }
      }

      // Si no encuentra elemento, buscar por texto en caso de perfil
      if (!element && selector.includes('profile')) {
        // Buscar elementos que contengan texto relacionado con perfil
        const allElements = document.querySelectorAll('*');
        for (const el of allElements) {
          const text = el.textContent?.toLowerCase() || '';
          if (text.includes('perfil') || text.includes('profile') || text.includes('usuario') || text.includes('user')) {
            if (el.tagName === 'BUTTON' || el.tagName === 'A' || el.closest('button') || el.closest('a')) {
              element = el.tagName === 'BUTTON' || el.tagName === 'A' ? el : (el.closest('button') || el.closest('a'));
              break;
            }
          }
        }
      }

      if (element) {
        // Crear overlay personalizado tipo spotlight
        const rect = element.getBoundingClientRect();
        const overlay = document.createElement('div');
        overlay.className = 'tour-custom-overlay';
        overlay.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.4);
          z-index: 39;
          pointer-events: none;
        `;

        // Crear agujero spotlight
        const spotlightRadius = 8;
        const clipPath = `circle(${Math.max(rect.width, rect.height) / 2 + spotlightRadius}px at ${rect.left + rect.width / 2}px ${rect.top + rect.height / 2}px)`;
        overlay.style.clipPath = `polygon(0% 0%, 0% 100%, ${rect.left - spotlightRadius}px 100%, ${rect.left - spotlightRadius}px ${rect.top - spotlightRadius}px, ${rect.right + spotlightRadius}px ${rect.top - spotlightRadius}px, ${rect.right + spotlightRadius}px ${rect.bottom + spotlightRadius}px, ${rect.left - spotlightRadius}px ${rect.bottom + spotlightRadius}px, ${rect.left - spotlightRadius}px 100%, 100% 100%, 100% 0%)`;

        document.body.appendChild(overlay);

        // Resaltar elemento con animación especial
        element.classList.add('tour-spotlight');
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Ejecutar acción si se especifica
        if (action === 'click') {
          setTimeout(() => {
            // Simular click en el elemento después de un pequeño delay
            (element as HTMLElement).click();
          }, 1500);
        }
        
        // Posicionar modal cerca del elemento
        const modalWidth = 400;
        const modalHeight = 300;
        const margin = 20;
        
        let top = rect.top;
        let left = rect.left;
        
        switch (position) {
          case 'bottom':
            top = rect.bottom + margin;
            left = rect.left + (rect.width / 2) - (modalWidth / 2);
            break;
          case 'top':
            top = rect.top - modalHeight - margin;
            left = rect.left + (rect.width / 2) - (modalWidth / 2);
            break;
          case 'left':
            top = rect.top + (rect.height / 2) - (modalHeight / 2);
            left = rect.left - modalWidth - margin;
            break;
          case 'right':
            top = rect.top + (rect.height / 2) - (modalHeight / 2);
            left = rect.right + margin;
            break;
          default:
            top = window.innerHeight / 2 - modalHeight / 2;
            left = window.innerWidth / 2 - modalWidth / 2;
        }
        
        // Asegurar que el modal esté dentro de la ventana
        top = Math.max(margin, Math.min(top, window.innerHeight - modalHeight - margin));
        left = Math.max(margin, Math.min(left, window.innerWidth - modalWidth - margin));
        
        setModalPosition({
          top: `${top}px`,
          left: `${left}px`,
          transform: 'none'
        });
      } else {
        // Si no encuentra el elemento, centrar modal sin overlay
        setModalPosition({
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        });
      }
    } else {
      // Sin target, centrar modal sin overlay
      setModalPosition({
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      });
    }
  };

  // Highlight del paso actual - MOVER ANTES DE LOS RETURNS
  useEffect(() => {
    if (shouldShow && !isLoading && isVisible) {
      const currentTourStep = tourSteps[currentStep];
      if (currentTourStep) {
        highlightElementAndPosition(currentTourStep.target, currentTourStep.position, currentTourStep.action);
      }
    }
  }, [currentStep, shouldShow, isLoading, isVisible]);

  // Cleanup effect cuando el componente se desmonta
  useEffect(() => {
    return () => {
      // Limpiar highlights y overlays cuando el componente se desmonta
      document.querySelectorAll('.tour-highlight, .tour-spotlight').forEach(el => {
        el.classList.remove('tour-highlight', 'tour-spotlight');
      });
      
      const existingOverlay = document.querySelector('.tour-custom-overlay');
      if (existingOverlay) {
        existingOverlay.remove();
      }
    };
  }, []);

  if (isLoading) {
    return null;
  }

  if (!shouldShow || !isVisible) {
    return null;
  }

  const currentTourStep = tourSteps[currentStep];
  const isLastStep = currentStep === tourSteps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (isLastStep) {
      handleFinish();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleFinish = async () => {
    await completeTour();
    setIsVisible(false);
  };

  const handleSkip = async () => {
    await skipTour();
    setIsVisible(false);
  };

  return (
    <>
      {/* Modal del tour - SIN OVERLAY NEGRO GENERAL */}
      <div 
        className="fixed z-50 bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 tour-modal border-2 border-blue-500"
        style={{
          top: modalPosition.top,
          left: modalPosition.left,
          transform: modalPosition.transform,
          maxWidth: '400px',
          width: 'calc(100vw - 32px)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(59, 130, 246, 0.3)'
        }}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <span className="mr-2">👋</span>
              {currentTourStep.title}
            </h3>
            <button
              onClick={handleSkip}
              className="text-gray-400 hover:text-gray-600 text-sm hover:bg-gray-100 rounded px-2 py-1 transition-colors"
            >
              Saltar tour
            </button>
          </div>
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1 flex justify-between">
              <span>Paso {currentStep + 1} de {tourSteps.length}</span>
              <span>{Math.round(((currentStep + 1) / tourSteps.length) * 100)}%</span>
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          <p className="text-gray-700 leading-relaxed">
            {currentTourStep.content}
          </p>
          
          {/* Indicador de acción */}
          {currentTourStep.action === 'click' && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700 flex items-center">
                <span className="mr-2">👆</span>
                El elemento se activará automáticamente en 1.5 segundos
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={isFirstStep}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              isFirstStep 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200'
            }`}
          >
            ← Anterior
          </button>

          <div className="flex space-x-2">
            <button
              onClick={handleSkip}
              className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
            >
              Saltar
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-md transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {isLastStep ? 'Finalizar 🎉' : 'Siguiente →'}
            </button>
          </div>
        </div>
      </div>

      {/* Estilos CSS para el spotlight y highlight */}
      <style jsx global>{`
        .tour-spotlight {
          position: relative !important;
          z-index: 40 !important;
          border-radius: 8px !important;
          box-shadow: 
            0 0 0 4px rgba(59, 130, 246, 0.8),
            0 0 0 8px rgba(59, 130, 246, 0.4),
            0 0 30px rgba(59, 130, 246, 0.3) !important;
          animation: tour-spotlight-pulse 2s infinite ease-in-out;
          transition: all 0.3s ease-in-out !important;
        }
        
        @keyframes tour-spotlight-pulse {
          0% { 
            box-shadow: 
              0 0 0 4px rgba(59, 130, 246, 0.8),
              0 0 0 8px rgba(59, 130, 246, 0.4),
              0 0 30px rgba(59, 130, 246, 0.3);
          }
          50% { 
            box-shadow: 
              0 0 0 6px rgba(59, 130, 246, 1),
              0 0 0 12px rgba(59, 130, 246, 0.6),
              0 0 40px rgba(59, 130, 246, 0.5);
          }
          100% { 
            box-shadow: 
              0 0 0 4px rgba(59, 130, 246, 0.8),
              0 0 0 8px rgba(59, 130, 246, 0.4),
              0 0 30px rgba(59, 130, 246, 0.3);
          }
        }
        
        .tour-modal {
          pointer-events: all;
          animation: tour-modal-appear 0.3s ease-out;
        }
        
        @keyframes tour-modal-appear {
          0% { 
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          100% { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .tour-custom-overlay {
          animation: tour-overlay-appear 0.3s ease-out;
        }
        
        @keyframes tour-overlay-appear {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
    </>
  );
}