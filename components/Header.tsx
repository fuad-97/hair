
import React from 'react';
import { Icon } from './Icon';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center">
        <Icon name="scissors" className="h-8 w-8 text-pink-500 mr-3"/>
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
          AI Salon <span className="text-pink-500">Stylist</span>
        </h1>
      </div>
    </header>
  );
};
