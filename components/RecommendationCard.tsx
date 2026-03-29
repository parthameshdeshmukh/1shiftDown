import React, { useState, useEffect } from 'react';
import type { NewCarRecommendation, UsedCarListing } from '../types';

const Icon: React.FC<{ name: string; className?: string }> = ({ name, className }) => {
    const icons: { [key: string]: React.ReactNode } = {
        calendar: <><path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /></>,
        gauge: <><path d="m12 14 4-4" /><path d="M3.34 19a10 10 0 1 1 17.32 0" /></>,
        mapPin: <><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></>,
        tag: <><path d="M12.586 2.586a2 2 0 0 0-2.828 0L2 10.172V14a2 2 0 0 0 2 2h3.828l7.586-7.586a2 2 0 0 0 0-2.828z" /><path d="M9 13.5 13.5 9" /><circle cx="6" cy="6" r=".5" fill="currentColor" /></>,
        check: <><path d="M20 6 9 17l-5-5" /></>,
    };
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            {icons[name]}
        </svg>
    );
};


const AnimatedMatchScoreBar: React.FC<{ score: number }> = ({ score }) => {
    const [width, setWidth] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => setWidth(score), 100);
        return () => clearTimeout(timer);
    }, [score]);

    return (
        <div className="w-full bg-white/10 rounded-full h-1.5">
            <div className="bg-accent h-1.5 rounded-full transition-all duration-1000 ease-out" style={{ width: `${width}%` }}></div>
        </div>
    );
};


// Interface moved to bottom

import { CAR_IMAGE_FALLBACKS } from '../constants';

const findFallbackImage = (carName: string): string | undefined => {
    const lowerCaseName = carName.toLowerCase();
    // Prioritize exact or near-exact matches
    for (const key in CAR_IMAGE_FALLBACKS) {
        if (lowerCaseName.includes(key)) {
            return CAR_IMAGE_FALLBACKS[key];
        }
    }
    return undefined;
};

const FuelIcon: React.FC<{ fuelType?: string }> = ({ fuelType }) => {
    if (!fuelType) return null;
    const iconMap: { [key: string]: string } = {
        'petrol': '⛽',
        'diesel': '🛢️',
        'electric': '⚡',
        'cng': '💨',
    };
    const icon = iconMap[fuelType.toLowerCase()];
    if (!icon) return null;

    return (
        <div title={fuelType} className="absolute top-4 right-4 bg-primary/60 backdrop-blur-sm text-2xl p-2 rounded-full shadow-lg h-10 w-10 flex items-center justify-center">
            {icon}
        </div>
    );
};

const CarImage: React.FC<{ src?: string; alt: string; type: 'new' | 'used', fuelType?: string }> = ({ src, alt, type, fuelType }) => {
    const [currentSrc, setCurrentSrc] = useState(src);
    const [hasError, setHasError] = useState(!src);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(false);
        if (!src) {
            const fallback = findFallbackImage(alt);
            if (fallback) {
                setCurrentSrc(`https://images.weserv.nl/?url=${encodeURIComponent(fallback)}`);
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
            setCurrentSrc(`https://images.weserv.nl/?url=${encodeURIComponent(fallback)}`);
            setHasError(false);
        } else {
            setHasError(true);
        }
    };

    const handleLoad = () => {
        setIsLoaded(true);
    };

    const labelText = type === 'new' ? 'New Car' : 'Used Car';
    const labelClasses = type === 'new'
        ? 'bg-accent/80 text-primary'
        : 'bg-secondary/80 text-text-primary';

    return (
        <div className="relative w-full h-[200px] bg-secondary rounded-t-xl border border-yellow-600/30 overflow-hidden">
            {hasError ? (
                <div className="w-full h-full bg-gradient-to-br from-secondary via-primary to-secondary flex flex-col items-center justify-center text-center p-4 rounded-t-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-accent/50 opacity-50 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h8a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.885 11h8.23a1 1 0 01.965.744l.858 3.431a1 1 0 01-.965 1.256H7.13a1 1 0 01-.965-1.256l.858-3.431A1 1 0 017.885 11z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 11V9a2 2 0 012-2h10a2 2 0 012 2v2" />
                    </svg>
                    <p className="text-sm font-semibold text-text-secondary mt-2">No Image Available</p>
                </div>
            ) : (
                <>
                    <img
                        src={currentSrc}
                        alt={alt}
                        onError={handleError}
                        onLoad={handleLoad}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className={`w-full h-full object-cover rounded-t-xl transition-all duration-500 ease-in-out group-hover:scale-[1.02] ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                    />
                    {type === 'used' && (
                        <div className="absolute inset-0 bg-black/30 rounded-t-xl"></div>
                    )}
                </>
            )}
            <div className={`absolute top-4 left-4 ${labelClasses} font-bold px-3 py-1 rounded-md text-xs backdrop-blur-sm z-10`}>
                {labelText}
            </div>
            {!hasError && <FuelIcon fuelType={fuelType} />}
        </div>
    );
};


// Moved to top check imports

const FavoriteButton: React.FC<{ isLiked: boolean; toggle: () => void }> = ({ isLiked, toggle }) => (
    <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(); }}
        className={`absolute top-4 right-16 p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${isLiked ? 'bg-red-500 text-white' : 'bg-primary/50 text-white hover:bg-red-500/20'}`}
    >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isLiked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
    </button>
);

const NewCarCard: React.FC<{ recommendation: NewCarRecommendation; isLiked: boolean; onToggle: () => void }> = ({ recommendation, isLiked, onToggle }) => {
    return (
        <div className="bg-secondary border border-white/5 rounded-xl shadow-soft hover:border-accent/40 transition-all duration-300 overflow-hidden flex flex-col group relative p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                <div className="flex-grow">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-2xl md:text-3xl font-serif font-bold text-text-primary">{recommendation.makeModel}</h3>
                            <p className="text-accent font-semibold text-sm md:text-base mt-1">
                                {recommendation.variant} <span className="text-white/30 mx-2">•</span> {recommendation.fuelType} <span className="text-white/30 mx-2">•</span> {recommendation.bodyType}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-primary/80 border border-accent/20 text-accent font-bold px-6 py-2 rounded-lg text-xl md:text-2xl shadow-inner whitespace-nowrap">
                    {recommendation.price}
                </div>
            </div>

            <div className="bg-primary/30 border border-white/5 p-5 rounded-lg mb-6">
                <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-white/5">
                    <Icon name="gauge" className="text-accent" />
                    <span className="text-sm font-medium text-text-primary">Expected Mileage: {recommendation.mileage}</span>
                </div>
                <div>
                    <h4 className="font-semibold text-text-primary text-sm mb-3">Why it's a great fit:</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {recommendation.reasons.map((reason, index) => (
                            <li key={index} className="flex items-start text-sm text-text-secondary">
                                <Icon name="check" className="w-4 h-4 text-accent mr-2 flex-shrink-0 mt-0.5" />
                                <span>{reason}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-auto">
                <div className="flex-grow w-full md:w-2/3">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-semibold text-text-secondary">AI Match Confidence</h4>
                        <span className="font-bold text-accent text-lg">{recommendation.matchScore}%</span>
                    </div>
                    <AnimatedMatchScoreBar score={recommendation.matchScore} />
                </div>
                <div className="w-full md:w-1/3 flex-shrink-0">
                    <a href={recommendation.link} target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-accent hover:bg-yellow-500 text-primary font-bold py-3 px-6 rounded-xl shadow-glow transition-all transform hover:-translate-y-1">
                        View Manufacturer Page
                    </a>
                </div>
            </div>
        </div>
    );
};

const UsedCarCard: React.FC<{ listing: UsedCarListing; isLiked: boolean; onToggle: () => void }> = ({ listing, isLiked, onToggle }) => {
    return (
        <div className="bg-secondary border border-white/5 rounded-xl shadow-soft hover:border-accent/40 transition-all duration-300 overflow-hidden flex flex-col group relative p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                <div className="flex-grow">
                    <div className="flex items-center space-x-3 mb-1">
                        <h3 className="text-2xl md:text-3xl font-serif font-bold text-text-primary">{listing.makeModel}</h3>
                        {listing.platform === '1Shift Down' && (
                            <span className="bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-bold px-2 py-1 rounded">Verified 1Shift Down</span>
                        )}
                    </div>
                    <p className="text-accent font-semibold text-sm md:text-base">{listing.variant}</p>
                </div>
                <div className="bg-primary/80 border border-accent/20 text-accent font-bold px-6 py-2 rounded-lg text-xl md:text-2xl shadow-inner whitespace-nowrap">
                    {listing.price}
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-primary/30 border border-white/5 p-5 rounded-lg mb-6 text-sm">
                <div className="flex items-center space-x-2 text-text-secondary">
                    <Icon name="calendar" className="text-accent" />
                    <span className="font-medium text-text-primary">{listing.year} Model</span>
                </div>
                <div className="flex items-center space-x-2 text-text-secondary">
                    <Icon name="gauge" className="text-accent" />
                    <span className="font-medium text-text-primary">{listing.kmsDriven}</span>
                </div>
                <div className="flex items-center space-x-2 text-text-secondary">
                    <Icon name="tag" className="text-accent" />
                    <span className="font-medium text-text-primary">{listing.fuelType || 'Petrol'}</span>
                </div>
                <div className="flex items-center space-x-2 text-text-secondary">
                    <Icon name="mapPin" className="text-accent" />
                    <span className="font-medium text-text-primary">Source: {listing.platform}</span>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-auto">
                <div className="flex-grow w-full md:w-2/3">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-semibold text-text-secondary">AI Match Confidence</h4>
                        <span className="font-bold text-accent text-lg">{listing.matchScore}%</span>
                    </div>
                    <AnimatedMatchScoreBar score={listing.matchScore} />
                </div>
                <div className="w-full md:w-1/3 flex-shrink-0">
                    <a href={listing.link} target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-accent hover:bg-yellow-500 text-primary font-bold py-3 px-6 rounded-xl shadow-glow transition-all transform hover:-translate-y-1">
                        View Exact Listing
                    </a>
                </div>
            </div>
        </div>
    );
};

interface RecommendationCardProps {
    item: NewCarRecommendation | UsedCarListing;
    type: 'new' | 'used';
    isLiked?: boolean;
    onToggle?: () => void;
}

// ... existing code ...

const RecommendationCard: React.FC<RecommendationCardProps> = ({ item, type, isLiked = false, onToggle = () => { } }) => {
    if (type === 'new') {
        return <NewCarCard recommendation={item as NewCarRecommendation} isLiked={isLiked} onToggle={onToggle} />;
    }
    return <UsedCarCard listing={item as UsedCarListing} isLiked={isLiked} onToggle={onToggle} />;
};

export default RecommendationCard;