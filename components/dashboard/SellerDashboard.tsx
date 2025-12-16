import React from 'react';

interface SellerDashboardProps {
    onAddListingClick: () => void;
    listings: any[];
}

const SellerDashboard: React.FC<SellerDashboardProps> = ({ onAddListingClick, listings = [] }) => {
    return (
        <div className="space-y-12">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-serif font-bold">Welcome, Seller!</h1>
                <button
                    onClick={onAddListingClick}
                    className="bg-accent hover:opacity-90 text-primary font-bold py-2 px-5 rounded-lg shadow-lg shadow-accent/10 transition-opacity"
                >
                    + Add New Listing
                </button>
            </div>

            {/* Listings Overview */}
            <div>
                <h2 className="text-3xl font-serif font-semibold mb-6">Your Listings</h2>
                <div className="bg-secondary rounded-lg overflow-x-auto border border-white/10">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-white/10">
                            <tr>
                                <th className="p-4 font-semibold">Car</th>
                                <th className="p-4 font-semibold">Price</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listings.length > 0 ? (
                                listings.map((listing, index) => (
                                    <tr key={listing.id || index} className="border-b border-white/10">
                                        <td className="p-4 font-medium text-text-primary">{listing.title}</td>
                                        <td className="p-4 text-text-secondary">{listing.price}</td>
                                        <td className="p-4"><span className="bg-green-500/10 text-green-300 px-2 py-1 rounded-full text-xs font-medium">Live</span></td>
                                        <td className="p-4 space-x-4">
                                            <button className="text-accent hover:underline text-xs font-semibold">Edit</button>
                                            <button className="text-red-400 hover:underline text-xs font-semibold">Delete</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="p-4 text-center text-text-secondary">No listings yet. Add one to see it here!</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* PDI Bookings */}
            <div>
                <h2 className="text-3xl font-serif font-semibold mb-6">PDI Bookings</h2>
                <div className="bg-secondary p-6 rounded-lg border border-white/10">
                    <div className="border border-white/10 p-4 rounded-md">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-text-primary">PDI for 2019 Swift</p>
                                <p className="text-sm text-text-secondary">Buyer Requested: Premium Plan</p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-yellow-300">Pending Inspection</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerDashboard;