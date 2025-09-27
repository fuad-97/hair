import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { StyleCustomizer } from './components/StyleCustomizer';
import { StylePreviewer } from './components/StylePreviewer';
import { generateStyleVariations } from './services/geminiService';
import { Gender, type GeneratedImage, type StyleOptions } from './types';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeGender, setActiveGender] = useState<Gender>(Gender.Female);
  const [styleOptions, setStyleOptions] = useState<StyleOptions>({});

  const handleGenerateStyles = useCallback(async () => {
    if (!originalImage) {
      setError("Please upload an image first.");
      return;
    }

    setIsLoading(true);
    setGeneratedImages([]);
    setError(null);

    try {
      const results = await generateStyleVariations(originalImage, styleOptions, activeGender);
      setGeneratedImages(results);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred while generating styles.");
    } finally {
      setIsLoading(false);
    }
  }, [originalImage, styleOptions, activeGender]);

  const handleImageUpload = (file: File) => {
    setOriginalImage(file);
    setGeneratedImages([]);
    setError(null);
  };

  const handleImageClear = () => {
    setOriginalImage(null);
    setGeneratedImages([]);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 xl:col-span-3 space-y-8">
            <ImageUploader onImageUpload={handleImageUpload} onImageClear={handleImageClear} />
            <StyleCustomizer
              activeGender={activeGender}
              setActiveGender={setActiveGender}
              styleOptions={styleOptions}
              setStyleOptions={setStyleOptions}
              onGenerate={handleGenerateStyles}
              isLoading={isLoading}
              isImageUploaded={!!originalImage}
            />
          </div>
          <div className="lg:col-span-8 xl:col-span-9">
            <StylePreviewer
              isLoading={isLoading}
              error={error}
              generatedImages={generatedImages}
              originalImageUrl={originalImage ? URL.createObjectURL(originalImage) : null}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;