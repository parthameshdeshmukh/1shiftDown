import React, { useState, useCallback } from 'react';
import { editImage } from '../services/geminiService';
import ImageIcon from '../components/icons/ImageIcon';

const fileToGenerativePart = (file: File): Promise<{ mimeType: string; data: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = (reader.result as string).split(',')[1];
      resolve({
        mimeType: file.type,
        data: base64Data,
      });
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

const ImageEditorPage: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<{ file: File; url: string } | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOriginalImage({ file, url: URL.createObjectURL(file) });
      setEditedImage(null);
      setError(null);
    }
  };
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const file = e.dataTransfer.files?.[0];
      if (file) {
         setOriginalImage({ file, url: URL.createObjectURL(file) });
         setEditedImage(null);
         setError(null);
      }
  }, []);
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
  };

  const handleGenerate = async () => {
    if (!originalImage || !prompt.trim()) {
      setError('Please upload an image and enter a prompt.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setEditedImage(null);

    try {
      const { data, mimeType } = await fileToGenerativePart(originalImage.file);
      const resultBase64 = await editImage(prompt, data, mimeType);
      setEditedImage(`data:${mimeType};base64,${resultBase64}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 animate-fade-in-up">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-5xl md:text-6xl font-serif font-extrabold tracking-tight mb-4">AI Image Editor</h1>
        <p className="text-lg text-text-secondary">Bring your ideas to life. Upload an image and describe your desired changes, from simple filter effects to complex object manipulation.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
        {/* Input and Controls */}
        <div className="bg-secondary p-8 rounded-2xl shadow-lg border border-white/10 space-y-6">
          <div>
            <label className="text-2xl font-serif font-bold text-text-primary mb-4 block">1. Upload Image</label>
            <div 
                className="relative border-2 border-dashed border-white/20 rounded-xl p-8 text-center cursor-pointer hover:border-accent transition-colors bg-primary"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
            >
              <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <div className="flex flex-col items-center justify-center text-text-secondary">
                <ImageIcon className="h-12 w-12 mb-4 text-white/30" />
                <p className="font-semibold">Drag & drop an image here</p>
                <p className="text-sm">or click to select a file</p>
              </div>
            </div>
          </div>
          
          {originalImage && (
            <div className="animate-fade-in-up">
              <h3 className="text-xl font-serif font-bold text-text-primary mb-2">Original Image</h3>
              <img src={originalImage.url} alt="Original" className="w-full h-auto max-h-80 object-contain rounded-lg bg-primary" />
            </div>
          )}

          <div>
            <label htmlFor="prompt" className="text-2xl font-serif font-bold text-text-primary mb-4 block">2. Describe Your Edit</label>
            <textarea
              id="prompt"
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Add a retro filter, change the car color to blue, remove the person in the background..."
              className="form-input"
              disabled={!originalImage}
            />
          </div>
          
          <button
            onClick={handleGenerate}
            disabled={isLoading || !originalImage || !prompt.trim()}
            className="w-full bg-accent hover:opacity-90 text-primary font-bold py-4 px-4 rounded-lg shadow-lg shadow-accent/20 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? 'Generating...' : 'Generate Image'}
          </button>
        </div>

        {/* Output */}
        <div className="bg-secondary p-8 rounded-2xl shadow-lg border border-white/10 flex flex-col items-center justify-center min-h-[500px]">
          {isLoading && (
            <div className="text-center">
              <svg className="animate-spin h-10 w-10 text-accent mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <p className="mt-4 text-2xl font-serif font-bold text-text-primary">Our AI is working its magic...</p>
              <p className="mt-1 text-text-secondary">This may take a moment.</p>
            </div>
          )}
          {!isLoading && error && (
            <div className="text-center bg-red-900/50 border border-red-700 text-red-300 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Generation Failed</h3>
              <p className="text-sm">{error}</p>
            </div>
          )}
          {!isLoading && !error && editedImage && (
             <div className="animate-fade-in-up w-full">
              <h3 className="text-2xl font-serif font-bold text-text-primary mb-4 text-center">Result</h3>
              <img src={editedImage} alt="Edited" className="w-full h-auto rounded-lg bg-primary" />
            </div>
          )}
           {!isLoading && !error && !editedImage && (
             <div className="text-center text-text-secondary">
              <ImageIcon className="h-20 w-20 text-white/10 mx-auto mb-4" />
              <p className="text-2xl font-serif font-bold text-text-primary">Your edited image will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageEditorPage;
