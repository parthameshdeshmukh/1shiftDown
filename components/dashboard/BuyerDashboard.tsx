import React from 'react';
import RecommendationCard from '../RecommendationCard';
import { useFavorites } from '../../hooks/useFavorites';

const BuyerDashboard: React.FC = () => {
    const { favorites, loading, toggleFavorite } = useFavorites();

    return (
        <div className="space-y-12">
            <h1 className="text-4xl font-serif font-bold">Welcome, Buyer!</h1>

            {/* Saved Cars */}
            <div>
                <h2 className="text-3xl font-serif font-semibold mb-6">Your Saved Cars</h2>
                {loading ? (
                    <div className="text-center py-16">Loading...</div>
                ) : favorites.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                    <div className="text-center py-16 bg-secondary rounded-lg border border-white/10">
                        <p className="text-text-secondary">You haven't saved any cars yet.</p>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Search History */}
                <div>
                    <h2 className="text-3xl font-serif font-semibold mb-6">Search History</h2>
                    <div className="bg-secondary p-6 rounded-lg space-y-4 border border-white/10">
                        <p className="text-text-secondary p-4 border border-white/10 rounded-md">Search for: "SUV under 15 Lakh in Mumbai"</p>
                        <p className="text-text-secondary p-4 border border-white/10 rounded-md">Search for: "Used Honda City Automatic"</p>
                    </div>
                </div>

                {/* Consultancy History */}
                <div>
                    <h2 className="text-3xl font-serif font-semibold mb-6">Consultancy History</h2>
                    <div className="bg-secondary p-6 rounded-lg space-y-4 border border-white/10">
                        <div className="p-4 border border-white/10 rounded-md">
                            <p className="font-semibold text-text-primary">New Car Recommendation</p>
                            <p className="text-text-secondary text-sm">Budget: 25 Lakh, High Yearly Running</p>
                            <button
                                onClick={() => alert("Consultancy history retrieval is coming soon!")}
                                className="text-accent text-sm mt-2 font-semibold hover:underline"
                            >
                                View Results
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuyerDashboard;