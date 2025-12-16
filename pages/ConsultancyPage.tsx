import React, { useState } from 'react';
import FilterPanel from '../components/CarConsultancyForm';
import RecommendationCard from '../components/RecommendationCard';
import Loader from '../components/Loader';
import { NewCarFormData, NewCarRecommendation, UsedCarFormData, UsedCarListing } from '../types';
import { getNewCarRecommendations, getUsedCarListings, generateCarImage, inferCarTypeFromTitle } from '../services/geminiService';
import type { Page } from '../App';

const currentYear = new Date().getFullYear();

// --- START: NEW COMPONENT AND DATA FOR RECENT LISTINGS ---
const Icon: React.FC<{ name: string; className?: string }> = ({ name, className }) => {
    const icons: { [key: string]: React.ReactNode } = {
        gauge: <><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></>,
        mapPin: <><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></>,
        flame: <><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></>,
        droplets: <><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.7-3.29C8.2 8.01 7 6.97 7 5.5c0-1.42 1.1-2.5 2.5-2.5S12 4.08 12 5.5c0 1.47-1.2 2.51-2.3 3.46-1.13 1.03-1.7 2.13-1.7 3.29 0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 7.5A10.03 10.03 0 0 1 17 12.25c0 2.22 1.8 4.05 4 4.05s4-1.83 4-4.05c0-4.22-3.38-7.75-7.44-7.75-1.56 0-3.04.5-4.27 1.36z"/></>,
        settings: <><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l-.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0 2l.15.08a2 2 0 0 0 .73-2.73l.22.38a2 2 0 0 0-2.73.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></>,
    };
    return (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>{icons[name]}</svg>);
};

const recentUsedCars = [
  { id: 1, title: '2021 Hyundai Creta SX (O) 1.5', price: '₹12.50 Lakh', kms: '35,000 km', platform: 'Cars24', fuel: 'Petrol', transmission: 'Manual', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/141115/creta-exterior-right-front-three-quarter-16.jpeg?is-pending-processing=1&q=80' },
  { id: 2, title: '2022 Kia Seltos GTX Plus 1.4', price: '₹16.80 Lakh', kms: '28,000 km', platform: 'Spinny', fuel: 'Petrol', transmission: 'Automatic', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/142515/new-seltos-exterior-right-front-three-quarter-2.jpeg?is-pending-processing=1&q=80' },
  { id: 3, title: '2020 Tata Harrier XT Diesel', price: '₹14.90 Lakh', kms: '40,000 km', platform: 'OLX Autos', fuel: 'Diesel', transmission: 'Manual', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/102663/harrier-exterior-right-front-three-quarter-2.jpeg?is-pending-processing=1&q=80' },
  { id: 4, title: '2023 Honda City ZX CVT', price: '₹14.50 Lakh', kms: '10,000 km', platform: 'Spinny', fuel: 'Petrol', transmission: 'Automatic', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/134287/city-exterior-right-front-three-quarter-2.jpeg?is-pending-processing=1&q=80' },
];

const fuelIconMap: { [key: string]: string } = { 'Petrol': 'flame', 'Diesel': 'droplets' };
const transmissionIconMap: { [key: string]: string } = { 'Manual': 'settings', 'Automatic': 'settings' }; // using same icon for simplicity

const RecentCarCard: React.FC<{ car: typeof recentUsedCars[0] }> = ({ car }) => (
  <div className="bg-secondary border border-white/10 rounded-xl shadow-lg hover:border-accent/50 transition-all duration-500 overflow-hidden group hover:-translate-y-2">
    <div className="relative">
      <img src={car.image} alt={car.title} className="w-full h-[180px] object-cover" />
      <div className="absolute top-4 right-4 bg-primary/50 backdrop-blur-sm text-accent font-bold px-4 py-2 rounded-lg text-lg">
        {car.price}
      </div>
    </div>
    <div className="p-6">
      <h3 className="text-xl font-serif font-bold text-text-primary mb-4 truncate">{car.title}</h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center space-x-2"><Icon name="gauge" className="text-accent" /> <span className="text-text-primary">{car.kms}</span></div>
        <div className="flex items-center space-x-2"><Icon name="mapPin" className="text-accent" /> <span className="text-text-primary">{car.platform}</span></div>
        <div className="flex items-center space-x-2"><Icon name={fuelIconMap[car.fuel]} className="text-accent" /> <span className="text-text-primary">{car.fuel}</span></div>
        <div className="flex items-center space-x-2"><Icon name={transmissionIconMap[car.transmission]} className="text-accent" /> <span className="text-text-primary">{car.transmission}</span></div>
      </div>
    </div>
  </div>
);
// --- END: NEW COMPONENT AND DATA ---

const initialUsedData: UsedCarFormData = {
  price: [300000, 2500000],
  brands: [],
  model: '',
  year: [currentYear - 5, currentYear],
  fuelTypes: [],
  transmission: [],
  kmsDriven: 100000,
  ownerCount: [],
  location: '',
  registrationState: '',
  features: [],
};

const initialNewData: NewCarFormData = {
  budget: 2500000,
  brands: [],
  model: '',
  fuelTypes: [],
  transmission: [],
  yearlyRunning: 15000,
  bodyTypes: [],
  colors: [],
  features: [],
};

interface ConsultancyPageProps {
  navigate: (page: Page) => void;
}

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-6 py-4 text-xl font-serif font-bold transition-colors duration-300 focus:outline-none relative ${
      active
        ? 'text-text-primary'
        : 'text-text-secondary hover:text-text-primary'
    }`}
  >
    {children}
    {active && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"></span>}
  </button>
);

const FilterChip: React.FC<{ onRemove: () => void; children: React.ReactNode }> = ({ onRemove, children }) => (
  <div className="flex items-center bg-accent/10 text-accent-foreground rounded-md pl-3 pr-2 py-1 text-sm font-medium">
    <span className="text-text-primary">{children}</span>
    <button onClick={onRemove} className="ml-2 text-accent-foreground hover:text-white focus:outline-none rounded-full hover:bg-black/20 p-0.5">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
);

const ProConsultancyCard = ({ navigate }: { navigate: (page: Page) => void }) => (
    <div className="bg-gradient-to-br from-secondary to-primary/80 p-8 rounded-xl border-2 border-accent/50 shadow-2xl shadow-accent/10 my-10 text-center">
        <h2 className="text-3xl font-serif font-bold text-accent mb-4">Need a Personal Touch?</h2>
        <p className="text-text-secondary max-w-2xl mx-auto mb-6">Upgrade to our Personalized Consultancy service. Get a dedicated car expert to guide you through the entire process via calls and messages.</p>
        <div className="flex justify-center flex-wrap gap-4 text-text-primary mb-8">
            <span className="bg-white/10 px-3 py-1 rounded-full text-sm">✓ Direct Call with Expert</span>
            <span className="bg-white/10 px-3 py-1 rounded-full text-sm">✓ Curated Shortlist of Cars</span>
            <span className="bg-white/10 px-3 py-1 rounded-full text-sm">✓ Negotiation Assistance</span>
        </div>
        <button 
            onClick={() => navigate('pro-consultancy-booking')}
            className="bg-accent text-primary font-bold py-3 px-8 rounded-lg shadow-lg shadow-accent/20 transform transition-transform duration-300 ease-in-out hover:scale-105"
        >
            Book a Session for ₹999
        </button>
    </div>
);


const ConsultancyPage: React.FC<ConsultancyPageProps> = ({ navigate }) => {
  const [searchType, setSearchType] = useState<'used' | 'new'>('used');
  const [results, setResults] = useState<(NewCarRecommendation | UsedCarListing)[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  
  const [usedData, setUsedData] = useState<UsedCarFormData>(initialUsedData);
  const [newData, setNewData] = useState<NewCarFormData>(initialNewData);
  
  const handleFormSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setResults([]);

    try {
      let resultWithoutImages: (Omit<NewCarRecommendation, 'image'> | Omit<UsedCarListing, 'image'>)[];
      if (searchType === 'used') {
        resultWithoutImages = await getUsedCarListings(usedData);
      } else {
        resultWithoutImages = await getNewCarRecommendations(newData);
      }

      if (resultWithoutImages.length === 0) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      const resultsWithImages = await Promise.all(
        resultWithoutImages.map(async (car) => {
          try {
            let carType: string;
            let carYear: number | undefined;

            if (searchType === 'new') {
                carType = (car as NewCarRecommendation).bodyType || 'car';
            } else { // 'used'
                carType = inferCarTypeFromTitle(car.makeModel);
                carYear = (car as UsedCarListing).year;
            }

            const generatedImage = await generateCarImage(car.makeModel, car.variant, carType, carYear);
            return { ...car, image: generatedImage };
          } catch (e) {
            console.error(`Failed to generate image for ${car.makeModel}`, e);
            return { ...car, image: '' }; // Fallback to empty string for the card to handle
          }
        })
      );

      setResults(resultsWithImages as (NewCarRecommendation | UsedCarListing)[]);
    } catch (e) {
      setError('Sorry, something went wrong with the recommendation. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (type: 'used' | 'new') => {
    setSearchType(type);
    setResults([]);
    setHasSearched(false);
    setError(null);
  }

  const ActiveFiltersBar = () => {
    const data = searchType === 'new' ? newData : usedData;
    const setter = searchType === 'new' ? setNewData : setUsedData;
    const filters = Object.entries(data)
      .flatMap(([key, value]) => {
        if (Array.isArray(value) && value.length > 0) {
          return value.map(v => ({ key, value: v, label: `${v}` }));
        }
        if (typeof value === 'string' && value) {
          return [{ key, value, label: `${value}` }];
        }
        return [];
      });

    if (filters.length === 0) return null;

    const handleRemove = (key: string, value: any) => {
        setter(prev => {
            const currentValues = (prev as any)[key];
            if (Array.isArray(currentValues)) {
                return { ...prev, [key]: currentValues.filter(v => v !== value) };
            }
            if (typeof currentValues === 'string') {
                 return { ...prev, [key]: '' };
            }
            return prev;
        });
    }

    return (
        <div className="mb-6 bg-secondary p-4 rounded-lg border border-white/10">
            <h3 className="text-sm font-semibold text-text-secondary mb-3">Active Filters:</h3>
            <div className="flex flex-wrap gap-2">
                {filters.map((filter, i) => (
                    <FilterChip key={`${filter.key}-${i}`} onRemove={() => handleRemove(filter.key, filter.value)}>
                        {filter.label}
                    </FilterChip>
                ))}
            </div>
        </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-screen-2xl">
      <div className="border-b border-white/10 flex space-x-6">
        <TabButton active={searchType === 'used'} onClick={() => handleTabChange('used')}>
          AI Used Car Finder
        </TabButton>
        <TabButton active={searchType === 'new'} onClick={() => handleTabChange('new')}>
          AI New Car Recommender
        </TabButton>
      </div>
      
      <ProConsultancyCard navigate={navigate} />

      <div className="my-20">
        <h2 className="text-4xl font-serif font-bold text-center mb-4 text-text-primary">Recently Listed Cars</h2>
        <p className="text-text-secondary text-center max-w-3xl mx-auto mb-12 text-lg">Fresh arrivals from trusted platforms, updated daily.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {recentUsedCars.map((car, index) => (
                <div key={car.id} className="opacity-0 animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                    <RecentCarCard car={car} />
                </div>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-12 mt-8">
        <aside className="lg:sticky top-28 h-full lg:max-h-[calc(100vh-12rem)]">
          <FilterPanel 
            onSubmit={handleFormSubmit} 
            isLoading={isLoading} 
            searchType={searchType}
            newData={newData}
            setNewData={setNewData}
            usedData={usedData}
            setUsedData={setUsedData}
          />
        </aside>
        
        <div className="relative">
          {!hasSearched ? (
             <div className="flex items-center justify-center h-full bg-secondary/50 p-8 rounded-xl border border-white/10 border-dashed">
              <div className="text-center text-text-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-20 w-20 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                <p className="mt-6 text-2xl font-serif font-bold text-text-primary">Your results will appear here.</p>
                <p className="mt-2">Use the filters to begin your bespoke search.</p>
              </div>
            </div>
          ) : (
            <>
              {isLoading && <Loader />}
              {!isLoading && hasSearched && <ActiveFiltersBar />}
              {error && <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg">{error}</div>}
              {!isLoading && !error && (
                 <div className="space-y-8">
                  {results.length > 0 ? (
                    results.map((item, index) => (
                      <RecommendationCard key={index} item={item} type={searchType} />
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-full bg-secondary/50 p-8 rounded-xl border border-white/10">
                      <div className="text-center text-text-secondary">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        <p className="mt-4 text-xl font-serif font-bold text-text-primary">No cars match your filters.</p>
                        <p>Try removing some filters or broadening your search criteria.</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsultancyPage;