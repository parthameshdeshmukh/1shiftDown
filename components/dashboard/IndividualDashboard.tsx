import React from 'react';
import DashboardLayout from './DashboardLayout';
import RecommendationCard from '../RecommendationCard';
import { useFavorites } from '../../hooks/useFavorites';

interface IndividualDashboardProps {
    listings?: any[];
    onAddListingClick: () => void;
    onDeleteListing?: (id: number) => void;
    onEditListing?: (id: number) => void;
}

const IndividualDashboard: React.FC<IndividualDashboardProps> = ({
    listings = [],
    onAddListingClick,
    onDeleteListing = () => { },
    onEditListing = () => { }
}) => {
    const { favorites, loading, toggleFavorite } = useFavorites();

    return (
        <DashboardLayout
            title="Welcome, Alex"
            subtitle="Manage your saved cars and listings in one place."
            role="Individual"
        >
            {/* ... SECTION 1 ... */}
            {/* SECTION 1: BUYER ACTIVITY */}
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-2xl font-serif font-semibold text-text-primary">Saved Cars</h2>
                    <span className="bg-secondary px-2 py-0.5 rounded text-xs text-text-secondary border border-white/10">Buyer</span>
                </div>

                {loading ? (
                    <div className="animate-pulse space-y-4">
                        <div className="h-48 bg-secondary rounded-lg"></div>
                    </div>
                ) : favorites.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favorites.map(fav => (
                            <RecommendationCard
                                key={fav.carId}
                                item={fav.data}
                                type={fav.isNew ? 'new' : 'used'}
                                isLiked={true}
                                onToggle={() => toggleFavorite(fav.data, fav.isNew)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-secondary/50 border border-white/5 rounded-xl p-10 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-text-secondary mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <p className="text-lg font-medium text-text-primary mb-2">No saved cars yet</p>
                        <p className="text-text-secondary text-sm">Start exploring listings to save your favorites!</p>
                    </div>
                )}
            </section>

            {/* SECTION 2: SELLER ACTIVITY */}
            <section className="pt-8 border-t border-white/5">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-serif font-semibold text-text-primary">Your Listings</h2>
                        <span className="bg-secondary px-2 py-0.5 rounded text-xs text-text-secondary border border-white/10">Seller</span>
                    </div>
                    <button
                        onClick={onAddListingClick}
                        className="bg-accent hover:bg-accent/90 text-primary font-bold py-2 px-6 rounded-lg shadow-lg shadow-accent/20 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add Listing
                    </button>
                </div>

                <div className="bg-secondary rounded-xl overflow-hidden border border-white/10">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white/5 border-b border-white/10 text-text-secondary uppercase tracking-wider text-xs">
                            <tr>
                                <th className="p-4 font-semibold">Car Details</th>
                                <th className="p-4 font-semibold">Price</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {listings.length > 0 ? (
                                listings.map((listing, index) => (
                                    <tr key={listing.id || index} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-text-primary text-base">{listing.title}</div>
                                            <div className="text-xs text-text-secondary mt-1">{listing.kms} • {listing.owner}</div>
                                        </td>
                                        <td className="p-4 font-medium text-text-primary">{listing.price}</td>
                                        <td className="p-4">
                                            <span className="bg-green-500/10 text-green-400 px-2.5 py-1 rounded-full text-xs font-bold border border-green-500/20">
                                                Live
                                            </span>
                                        </td>
                                        <td className="p-4 text-right space-x-3">
                                            <button
                                                onClick={() => onEditListing(listing.id)}
                                                className="text-text-secondary hover:text-accent font-medium text-xs transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => onDeleteListing(listing.id)}
                                                className="text-text-secondary hover:text-red-400 font-medium text-xs transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="p-12 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-text-secondary mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                            </svg>
                                            <p className="text-text-primary font-medium">You haven't listed any cars</p>
                                            <p className="text-text-secondary text-sm mt-1">Sell your car to thousands of buyers today.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* PDI REQUESTS SECTION */}
            <section className="pt-8 border-t border-white/5">
                <h2 className="text-2xl font-serif font-semibold text-text-primary mb-6">PDI Requests</h2>
                <div className="bg-secondary/50 border border-white/5 rounded-xl p-10 text-center">
                    <p className="text-text-secondary">No PDI requests available at the moment.</p>
                </div>
            </section>
        </DashboardLayout>
    );
};

export default IndividualDashboard;
