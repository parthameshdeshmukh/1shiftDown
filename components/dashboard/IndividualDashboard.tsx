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

            {/* CONSULTANCY SESSIONS SECTION */}
            <section className="pt-8 border-t border-white/5">
                <h2 className="text-2xl font-serif font-semibold text-text-primary mb-6">Consultancy Sessions</h2>
                <div className="bg-secondary/50 border border-white/5 rounded-xl p-10 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-text-secondary mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-lg font-medium text-text-primary mb-2">No active consultancy sessions</p>
                    <p className="text-text-secondary text-sm">Book an expert session to get personalized advice.</p>
                </div>
            </section>

            {/* PDI REPORTS SECTION */}
            <section className="pt-8 border-t border-white/5">
                <h2 className="text-2xl font-serif font-semibold text-text-primary mb-6">PDI Reports</h2>
                <div className="bg-secondary/50 border border-white/5 rounded-xl p-10 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-text-secondary mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-lg font-medium text-text-primary mb-2">No PDI reports available</p>
                    <p className="text-text-secondary text-sm">Your inspection reports will appear here once ready.</p>
                </div>
            </section>
        </DashboardLayout>
    );
};

export default IndividualDashboard;
