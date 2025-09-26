import { NextResponse } from 'next/server';

export async function GET() {
  const enabledProviders = [];

  // Depuración: incluir valores de variables de entorno en la respuesta
  const debugEnv = {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || null,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || null,
    AZURE_AD_CLIENT_ID: process.env.AZURE_AD_CLIENT_ID || null,
    AZURE_AD_CLIENT_SECRET: process.env.AZURE_AD_CLIENT_SECRET || null,
  };

  // Verificar Google OAuth
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    enabledProviders.push({
      id: 'google',
      name: 'Google',
      enabled: true,
      icon: '🌐',
      buttonColor: '#4285f4'
    });
  }

  // Verificar Microsoft Azure AD
  if (process.env.AZURE_AD_CLIENT_ID && process.env.AZURE_AD_CLIENT_SECRET) {
    enabledProviders.push({
      id: 'azure-ad',
      name: 'Microsoft',
      enabled: true,
      icon: '🏢',
      buttonColor: '#0078d4'
    });
  }

  return NextResponse.json({ providers: enabledProviders, debugEnv });
}