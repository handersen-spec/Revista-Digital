import React from 'react';
import { Metadata } from 'next';
import CookiePreferences from '@/components/CookiePreferences';

export const metadata: Metadata = {
  title: 'Configurações de Cookies - Auto Prestige',
  description: 'Gerencie suas preferências de cookies e controle quais dados são coletados pela Auto Prestige.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Configurações de Cookies
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Controle suas preferências de cookies e entenda como utilizamos diferentes tipos de cookies 
              para melhorar sua experiência no site.
            </p>
          </div>
          
          <CookiePreferences />
        </div>
      </div>
    </div>
  );
}
