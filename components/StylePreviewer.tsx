
import React, { useState } from 'react';
import type { GeneratedImage } from '../types';
import { LoadingSpinner } from './LoadingSpinner';
import { Icon } from './Icon';

interface StylePreviewerProps {
  isLoading: boolean;
  error: string | null;
  generatedImages: GeneratedImage[];
  originalImageUrl: string | null;
}

const ImageCard: React.FC<{ image: GeneratedImage }> = ({ image }) => {
  const [isFavorited, setIsFavorited] = useState(false);

  return (
    <div className="relative group overflow-hidden rounded-lg shadow-lg">
      <img src={image.src} alt="Generated style" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-4 w-full flex justify-between items-center">
        <div className="flex space-x-2">
            <button className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors">
              <Icon name="download" className="h-5 w-5" />
            </button>
             <button className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors">
              <Icon name="share" className="h-5 w-5" />
            </button>
        </div>
        <button 
          onClick={() => setIsFavorited(!isFavorited)}
          className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
        >
          <Icon name="heart" className={`h-5 w-5 ${isFavorited ? 'text-red-500 fill-current' : ''}`} />
        </button>
      </div>
    </div>
  );
};

export const StylePreviewer: React.FC<StylePreviewerProps> = ({ isLoading, error, generatedImages, originalImageUrl }) => {
  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center text-red-500 bg-red-50 p-8 rounded-lg">
            <Icon name="error" className="h-12 w-12 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Oops! Something went wrong.</h3>
            <p>{error}</p>
        </div>
      );
    }

    if (generatedImages.length > 0) {
      return (
         <>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your New Look!</h2>
          <p className="text-gray-500 mb-6">Here are the AI-generated styles based on your selections. Click on any image to view details.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {generatedImages.map((image) => (
              <ImageCard key={image.id} image={image} />
            ))}
          </div>
         </>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="w-full max-w-md">
            <img src="https://picsum.photos/seed/salon/600/400" alt="Placeholder salon" className="rounded-lg shadow-xl mb-6" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-700 mb-2">Visualize Your Perfect Style</h3>
        <p className="text-gray-500 max-w-md">Upload your photo and choose your desired style options to see the magic happen. The AI will generate style previews for you here.</p>
      </div>
    );
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-md min-h-[600px] flex flex-col justify-center">
      {renderContent()}
    </div>
  );
};
