import React, { useState, useEffect } from 'react';
import CarCard from '../components/CarCard';
import ListingsFilter from '../components/ListingsFilter';
import { UsedCarFormData } from '../types';
import { generateListingCarImage } from '../services/geminiService';
import AddListingModal from '../components/AddListingModal';

interface ListingsPageProps {
    listings: any[];
    onAddListing: (listing: any) => void;
}

const currentYear = new Date().getFullYear();

const ListingsPage: React.FC<ListingsPageProps> = ({ listings, onAddListing }) => {
    const [filters, setFilters] = useState<Partial<UsedCarFormData>>({
        price: [0, 6000000],
        year: [2010, currentYear],
        kmsDriven: 200000,
    });
    const [isAddListingOpen, setIsAddListingOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredListings = listings.filter(car =>
        car.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-12">
                <ListingsFilter filters={filters} setFilters={setFilters} />

                {/* Main Content */}
                <main>
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                        <h1 className="text-3xl font-serif font-bold">Used Car Listings</h1>

                        {/* Search Bar */}
                        <div className="relative w-full md:w-auto flex-grow max-w-md mx-4">
                            <input
                                type="text"
                                placeholder="Search cars (e.g. Swift, Thar)..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-secondary border border-white/5 rounded-xl py-3 pl-5 pr-12 focus:outline-none focus:ring-1 focus:ring-accent/50 text-text-primary placeholder-text-secondary/50 shadow-soft transition-all"
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-secondary absolute right-4 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        <div className="flex gap-4 shrink-0">
                            <button
                                onClick={() => setIsAddListingOpen(true)}
                                className="bg-accent text-primary px-6 py-2.5 rounded-xl font-bold hover:bg-yellow-500 hover:shadow-glow transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                Sell Your Car
                            </button>
                            <select className="bg-secondary border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent/50 cursor-pointer hover:border-accent/30 transition-colors shadow-soft">
                                <option>Sort by: Newest</option>
                                <option>Sort by: Lowest Price</option>
                                <option>Sort by: Highest Price</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                        {filteredListings.map((car, index) => (
                            <div key={car.id} className="opacity-0 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                                <CarCard car={{
                                    ...car,
                                    image: typeof car.generatedImage === 'string' ? car.generatedImage : (car.image || ''),
                                    isGenerating: car.isGenerating,
                                    isUsed: true,
                                }} />
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="mt-12 flex justify-center">
                        <nav className="flex items-center space-x-2">
                            <button className="px-4 py-2 rounded-lg bg-secondary hover:bg-white/5 transition-colors">&laquo;</button>
                            <button className="px-4 py-2 rounded-lg bg-accent text-primary font-bold">1</button>
                            <button className="px-4 py-2 rounded-lg bg-secondary hover:bg-white/5 transition-colors">2</button>
                            <button className="px-4 py-2 rounded-lg bg-secondary hover:bg-white/5 transition-colors">3</button>
                            <button className="px-4 py-2 rounded-lg bg-secondary hover:bg-white/5 transition-colors">&raquo;</button>
                        </nav>
                    </div>
                </main>
            </div>
            <AddListingModal
                isOpen={isAddListingOpen}
                onClose={() => setIsAddListingOpen(false)}
                onSubmit={onAddListing}
            />
        </div>
    );
};

export default ListingsPage;