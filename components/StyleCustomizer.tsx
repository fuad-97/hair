import React from 'react';
import type { StyleOptions } from '../types';
import { Gender } from '../types';
import {
  HAIR_TEXTURE,
  HAIR_LENGTH,
  BEARD_STYLES
} from '../constants';
import { Icon } from './Icon';

interface StyleCustomizerProps {
  activeGender: Gender;
  setActiveGender: (gender: Gender) => void;
  styleOptions: StyleOptions;
  setStyleOptions: React.Dispatch<React.SetStateAction<StyleOptions>>;
  onGenerate: () => void;
  isLoading: boolean;
  isImageUploaded: boolean;
}

const OptionSelect: React.FC<{
  label: string;
  options: string[];
  value: string | undefined;
  onChange: (value: string) => void;
  icon: string;
}> = ({ label, options, value, onChange, icon }) => (
  <div className="mb-4">
    <label className="flex items-center text-sm font-medium text-gray-600 mb-2">
      <Icon name={icon} className="h-4 w-4 mr-2 text-gray-400" />
      {label}
    </label>
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
    >
      <option value="">Select...</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

export const StyleCustomizer: React.FC<StyleCustomizerProps> = ({
  activeGender,
  setActiveGender,
  styleOptions,
  setStyleOptions,
  onGenerate,
  isLoading,
  isImageUploaded,
}) => {
  const handleOptionChange = (key: keyof StyleOptions, value: string) => {
    setStyleOptions((prev) => ({ ...prev, [key]: value }));
  };

  const tabs = [
    { gender: Gender.Female, label: "Women's Styles", icon: "female" },
    { gender: Gender.Male, label: "Men's Styles", icon: "male" }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">2. Customize Your Style</h2>
      
      <div className="flex border-b border-gray-200 mb-4">
        {tabs.map(tab => (
          <button
            key={tab.gender}
            onClick={() => {
                setActiveGender(tab.gender);
                setStyleOptions({}); // Reset options on gender switch
            }}
            className={`flex-1 flex items-center justify-center py-2 px-1 text-sm font-medium transition-colors ${
              activeGender === tab.gender
                ? 'border-b-2 border-pink-500 text-pink-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon name={tab.icon} className="h-5 w-5 mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      <div>
        {activeGender === Gender.Female && (
          <>
            <OptionSelect label="Hair Texture" options={HAIR_TEXTURE} value={styleOptions.hairTexture} onChange={(v) => handleOptionChange('hairTexture', v)} icon="swatch" />
            <OptionSelect label="Hair Length" options={HAIR_LENGTH} value={styleOptions.hairLength} onChange={(v) => handleOptionChange('hairLength', v)} icon="ruler" />
          </>
        )}
        {activeGender === Gender.Male && (
          <>
            <OptionSelect label="Hair Texture" options={HAIR_TEXTURE} value={styleOptions.hairTexture} onChange={(v) => handleOptionChange('hairTexture', v)} icon="swatch" />
            <OptionSelect label="Hair Length" options={HAIR_LENGTH} value={styleOptions.hairLength} onChange={(v) => handleOptionChange('hairLength', v)} icon="ruler" />
            <OptionSelect label="Beard Style" options={BEARD_STYLES} value={styleOptions.beardStyle} onChange={(v) => handleOptionChange('beardStyle', v)} icon="beard" />
          </>
        )}
      </div>

      <button
        onClick={onGenerate}
        disabled={isLoading || !isImageUploaded}
        className="w-full mt-4 bg-pink-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-pink-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          <>
            <Icon name="sparkles" className="h-5 w-5 mr-2" />
            Generate Styles
          </>
        )}
      </button>
      {!isImageUploaded && <p className="text-xs text-red-500 mt-2 text-center">Please upload an image to generate styles.</p>}
    </div>
  );
};