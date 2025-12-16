import React, { useState, useEffect } from 'react';

interface Car {
    image: string;
    title: string;
    price: string;
    location: string;
    kms?: string;
    fuel?: string;
    owner?: string;
    isGenerating?: boolean;
    isUsed?: boolean;
}

interface CarCardProps {
    car: Car;
}

import { CAR_IMAGE_FALLBACKS } from '../constants';

const findFallbackImage = (carName: string): string | undefined => {
    const lowerCaseName = carName.toLowerCase();
    for (const key in CAR_IMAGE_FALLBACKS) {
        if (lowerCaseName.includes(key)) {
            return CAR_IMAGE_FALLBACKS[key];
        }
    }
    return undefined;
};

const CardImage: React.FC<{ src?: string; alt: string; fuelType?: string; isGenerating?: boolean; isUsed?: boolean; }> = ({ src, alt, fuelType, isGenerating, isUsed }) => {
    const [currentSrc, setCurrentSrc] = useState(src);
    const [hasError, setHasError] = useState(!src);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(false);
        if (!src) {
            const fallback = findFallbackImage(alt);
            if (fallback) {
                setCurrentSrc(fallback);
                setHasError(false);
            } else {
                setHasError(true);
            }
        } else {
            setHasError(false);
            setCurrentSrc(src);
        }
    }, [src, alt]);

    const handleError = () => {
        const fallback = findFallbackImage(alt);
        if (fallback && fallback !== currentSrc) {
            setCurrentSrc(fallback);
            setHasError(false);
        } else {
            setHasError(true);
        }
    };

    const handleLoad = () => {
        setIsLoaded(true);
    };

    const fuelIcon = fuelType ? {
        'petrol': '⛽',
        'diesel': '🛢️',
        'electric': '⚡',
        'cng': '💨',
    }[fuelType.toLowerCase()] : null;


    return (
        <div className="relative w-full h-[220px] bg-secondary border-b border-yellow-600/30">
            {isGenerating ? (
                <div className="absolute inset-0 flex items-center justify-center bg-secondary">
                    <div className="text-center">
                        <svg className="animate-spin h-8 w-8 text-accent mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="mt-2 text-xs text-text-secondary">Generating Image...</p>
                    </div>
                </div>
            ) : hasError ? (
                <div className="w-full h-full bg-gradient-to-br from-secondary via-primary to-secondary flex flex-col items-center justify-center text-center p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-accent/50 opacity-50 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h8a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.885 11h8.23a1 1 0 01.965.744l.858 3.431a1 1 0 01-.965 1.256H7.13a1 1 0 01-.965-1.256l.858-3.431A1 1 0 017.885 11z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 11V9a2 2 0 012-2h10a2 2 0 012 2v2" />
                    </svg>
                    <p className="text-sm font-semibold text-text-secondary mt-2">Image Not Available</p>
                </div>
            ) : (
                <>
                    {!isLoaded && !isGenerating && (
                        <div className="absolute inset-0 flex items-center justify-center bg-secondary">
                            <svg className="animate-spin h-8 w-8 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    )}
                    <img
                        src={currentSrc}
                        alt={alt}
                        onError={handleError}
                        onLoad={handleLoad}
                        referrerPolicy="no-referrer"
                        className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                    />
                </>
            )}

            {!isGenerating && !hasError && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
            )}

            {isUsed && (
                <div className="absolute top-4 left-4 bg-secondary/80 text-text-primary font-bold px-3 py-1 rounded-md text-xs backdrop-blur-sm z-10">
                    Used
                </div>
            )}

            {!isGenerating && !hasError && fuelIcon && (
                <div title={fuelType} className="absolute bottom-4 left-4 bg-primary/60 backdrop-blur-sm text-2xl p-2 rounded-full shadow-lg h-10 w-10 flex items-center justify-center">
                    {fuelIcon}
                </div>
            )}
        </div>
    );
};


const CarCard: React.FC<CarCardProps> = ({ car }) => {
    return (
        <div className="bg-secondary rounded-xl overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-soft border border-white/5 hover:border-gold-muted/50">
            <div className="relative">
                <CardImage src={car.image} alt={car.title} fuelType={car.fuel} isGenerating={car.isGenerating} isUsed={car.isUsed} />
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-accent text-lg font-bold px-4 py-1.5 rounded-lg border border-accent/20">
                    {car.price}
                </div>
            </div>
            <div className="p-6">
                <h3 className="text-2xl font-serif font-bold text-text-primary truncate mb-2">{car.title}</h3>
                <p className="text-sm text-text-secondary mb-4 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {car.location}
                </p>

                {car.kms && (
                    <div className="grid grid-cols-3 gap-2 mb-6">
                        <div className="bg-primary/50 rounded-lg p-2 text-center border border-white/5">
                            <span className="block text-text-primary font-semibold text-sm">{car.kms}</span>
                            <span className="text-[10px] text-text-secondary uppercase tracking-wider">Driven</span>
                        </div>
                        <div className="bg-primary/50 rounded-lg p-2 text-center border border-white/5">
                            <span className="block text-text-primary font-semibold text-sm">{car.fuel}</span>
                            <span className="text-[10px] text-text-secondary uppercase tracking-wider">Fuel</span>
                        </div>
                        <div className="bg-primary/50 rounded-lg p-2 text-center border border-white/5">
                            <span className="block text-text-primary font-semibold text-sm">{car.owner}</span>
                            <span className="text-[10px] text-text-secondary uppercase tracking-wider">Owner</span>
                        </div>
                    </div>
                )}

                <div className="flex gap-3">
                    <button
                        onClick={() => alert("Chat functionality coming soon!")}
                        className="flex-1 py-3 text-center text-sm font-semibold text-text-primary border border-white/20 rounded-lg hover:border-accent hover:text-accent transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Chat
                    </button>
                    <div
                        onClick={() => alert("Detailed view implementation is in progress! Try the AI Consultant for full recommendations.")}
                        className="flex-1 py-3 text-center text-sm font-bold text-primary bg-accent rounded-lg hover:bg-yellow-500 hover:shadow-glow transition-all duration-300 cursor-pointer flex items-center justify-center"
                    >
                        View Details
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarCard;