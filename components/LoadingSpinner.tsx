
import React from 'react';
import { Icon } from './Icon';

export const LoadingSpinner: React.FC = () => {
  const messages = [
    "Warming up the AI stylist...",
    "Blending colors and pixels...",
    "Crafting your new look...",
    "This takes a bit of magic...",
  ];

  const [message, setMessage] = React.useState(messages[0]);

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setMessage(prevMessage => {
        const currentIndex = messages.indexOf(prevMessage);
        return messages[(currentIndex + 1) % messages.length];
      });
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-4 border-pink-200 rounded-full"></div>
        <div className="absolute inset-0 border-t-4 border-pink-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
            <Icon name="scissors" className="h-10 w-10 text-pink-500 animate-pulse" />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-2">AI is working its magic...</h3>
      <p className="text-gray-500">{message}</p>
    </div>
  );
};
