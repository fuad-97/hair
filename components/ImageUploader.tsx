import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Icon } from './Icon';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  onImageClear: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, onImageClear }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleCloseCamera = useCallback(() => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
    setMediaStream(null);
  }, [mediaStream]);
  
  const handleFileChange = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        onImageUpload(file);
        handleCloseCamera();
      }
    }
  };

  const handleOpenCamera = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setIsCameraOpen(true);
        setMediaStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera: ", err);
        alert("Could not access camera. Please check permissions and ensure you're using a secure (https) connection.");
      }
    } else {
        alert("Your browser does not support camera access.");
    }
  };

  const handleTakePhoto = () => {
    if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        if (context) {
            context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            canvas.toBlob((blob) => {
                if(blob) {
                    const photoFile = new File([blob], "camera-photo.jpg", { type: "image/jpeg" });
                    // FIX: `FileListItem` is a helper function, not a constructor, so the `new` keyword should be removed.
                    handleFileChange(FileListItem(photoFile));
                }
            }, 'image/jpeg');
        }
    }
  };

  // Helper for handleTakePhoto to use handleFileChange
  function FileListItem(file: File) {
    const b = new ClipboardEvent("").clipboardData || new DataTransfer()
    b.items.add(file)
    return b.files
  }

  const handleClear = () => {
    if (preview) {
        URL.revokeObjectURL(preview);
    }
    setPreview(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
    onImageClear();
  }
  
  useEffect(() => {
    return () => {
      handleCloseCamera();
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [handleCloseCamera, preview]);
  
  const onDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }, []);
  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }, []);
  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); }, []);
  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); handleFileChange(e.dataTransfer.files); }, []);

  const onBrowseClick = () => fileInputRef.current?.click();

  const renderInitialState = () => (
     <div className="flex flex-col items-center">
        <Icon name="upload" className="h-12 w-12 text-gray-400 mb-2" />
        <p className="text-gray-500 mb-2">Drag & drop an image here</p>
        <p className="text-gray-400 text-sm mb-4">or</p>
        <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={onBrowseClick} className="bg-gray-100 text-gray-700 font-semibold py-2 px-6 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center">
                <Icon name="folder" className="h-5 w-5 mr-2" />
                Browse Files
            </button>
            <button onClick={handleOpenCamera} className="bg-gray-100 text-gray-700 font-semibold py-2 px-6 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center">
                <Icon name="camera" className="h-5 w-5 mr-2" />
                Use Camera
            </button>
        </div>
    </div>
  );

  const renderCameraState = () => (
     <div className="space-y-4">
        <video ref={videoRef} className="w-full h-auto rounded-md" autoPlay playsInline muted />
        <canvas ref={canvasRef} className="hidden" />
        <div className="flex justify-center gap-4">
            <button onClick={handleTakePhoto} className="bg-pink-500 text-white p-4 rounded-full shadow-lg hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500" aria-label="Take Photo">
                <Icon name="camera" className="h-6 w-6" />
            </button>
            <button onClick={handleCloseCamera} className="bg-gray-700 text-white p-3 rounded-full shadow-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600" aria-label="Close Camera">
                <Icon name="close" className="h-5 w-5" />
            </button>
        </div>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">1. Upload Your Photo</h2>
      <div 
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${isDragging ? 'border-pink-500 bg-pink-50' : 'border-gray-300'}`}
        onDragEnter={onDragEnter} onDragLeave={onDragLeave} onDragOver={onDragOver} onDrop={onDrop}
      >
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e.target.files)} />
        {preview ? (
          <div className="relative group">
             <button onClick={handleClear} className="absolute top-2 right-2 z-10 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/70 transition-colors" aria-label="Clear image">
                <Icon name="close" className="h-4 w-4" />
             </button>
             <img src={preview} alt="Preview" className="mx-auto max-h-60 rounded-md" />
             <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                <button onClick={onBrowseClick} className="bg-white text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-lg hover:bg-gray-100 transition-all">
                    Change Image
                </button>
             </div>
          </div>
        ) : isCameraOpen ? (
            renderCameraState()
        ) : (
          renderInitialState()
        )}
      </div>
       <p className="text-xs text-gray-400 mt-3 text-center">For best results, use a clear, front-facing photo with good lighting.</p>
    </div>
  );
};