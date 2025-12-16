import React, { useState } from 'react';
import StatCard from './StatCard';
import DashboardLayout from './DashboardLayout';

interface DealerDashboardProps {
    onAddListingClick: () => void;
    listings: any[];
    onDeleteListing?: (id: number) => void;
    onEditListing?: (id: number) => void;
}

const DealerDashboard: React.FC<DealerDashboardProps> = ({
    onAddListingClick,
    listings = [],
    onDeleteListing = () => { },
    onEditListing = () => { }
}) => {
    const [activeTab, setActiveTab] = useState<'individual' | 'bulk'>('individual');

    return (
        <DashboardLayout
            title="Welcome, AutoMax Dealers!"
            subtitle="Manage your dealership inventory and performance."
            role="Dealer"
        >
            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Cars Listed" value={listings.length.toString()} icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>} color="blue" />
                <StatCard title="Cars Sold (This Month)" value="12" icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} color="green" />
                <StatCard title="Pending Reviews" value="3" icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} color="yellow" />
                <StatCard title="Total Views" value="25.4k" icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542 7z" /></svg>} color="purple" />
            </div>

            {/* Listings Management */}
            <section>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h2 className="text-3xl font-serif font-semibold">Listings Management</h2>
                    <div className="flex bg-secondary rounded-lg p-1 border border-white/10">
                        <button
                            onClick={() => setActiveTab('individual')}
                            className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${activeTab === 'individual' ? 'bg-accent text-primary shadow-lg' : 'text-text-secondary hover:text-text-primary'}`}
                        >
                            Individual Listing
                        </button>
                        <button
                            onClick={() => setActiveTab('bulk')}
                            className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${activeTab === 'bulk' ? 'bg-accent text-primary shadow-lg' : 'text-text-secondary hover:text-text-primary'}`}
                        >
                            Bulk & Mass Listing
                        </button>
                    </div>
                </div>

                <div className="bg-secondary rounded-xl border border-white/10 p-1">
                    {activeTab === 'individual' ? (
                        <>
                            <div className="p-4 flex justify-end">
                                <button
                                    onClick={onAddListingClick}
                                    className="bg-accent hover:opacity-90 text-primary font-bold py-2 px-5 rounded-lg shadow-lg shadow-accent/10 text-sm transition-opacity flex items-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                    </svg>
                                    Add New Listing
                                </button>
                            </div>
                            <div className="overflow-x-auto">
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
                                                    <td className="p-4 font-medium text-text-primary">{listing.title}</td>
                                                    <td className="p-4 text-text-secondary">{listing.price}</td>
                                                    <td className="p-4"><span className="bg-green-500/10 text-green-300 px-2.5 py-1 rounded-full text-xs font-bold border border-green-500/20">Live</span></td>
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
                                                <td colSpan={4} className="p-16 text-center text-text-secondary">
                                                    <p className="text-lg font-medium text-text-primary mb-2">No active listings found</p>
                                                    <p className="text-sm">Add your first listing to start selling.</p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        <div className="p-16 text-center">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-text-primary mb-2">Bulk Listing Upload</h3>
                            <p className="text-text-secondary mb-8 max-w-md mx-auto">Upload a CSV or Excel file to add multiple vehicle listings at once. Ideal for large inventories.</p>
                            <button className="bg-white/10 hover:bg-white/20 text-text-primary font-bold py-3 px-8 rounded-lg transition-colors border border-white/10 flex items-center gap-2 mx-auto">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                                Upload CSV File
                            </button>
                        </div>
                    )}
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Subscription & Payments */}
                <div className="lg:col-span-1">
                    <h2 className="text-2xl font-serif font-semibold mb-6">Subscription</h2>
                    <div className="bg-secondary p-8 rounded-xl border border-white/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <p className="font-bold text-2xl text-accent mb-1">Pro Dealer Plan</p>
                        <p className="text-sm text-text-secondary mb-6">Next renewal: <span className="text-text-primary font-medium">31 Dec, 2024</span></p>

                        <div className="space-y-3 mb-8">
                            <div className="flex items-center gap-2 text-sm text-text-secondary"><svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Unlimited Listings</div>
                            <div className="flex items-center gap-2 text-sm text-text-secondary"><svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Priority Support</div>
                            <div className="flex items-center gap-2 text-sm text-text-secondary"><svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Advanced Analytics</div>
                        </div>

                        <button className="w-full bg-white/5 hover:bg-white/10 text-text-primary font-bold py-3 px-4 rounded-lg text-sm transition-colors border border-white/10">
                            Manage Subscription
                        </button>
                    </div>
                </div>

                {/* Analytics */}
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-serif font-semibold mb-6">Performance Analytics</h2>
                    <div className="bg-secondary p-8 rounded-xl text-center border border-white/10 h-64 flex flex-col items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-text-secondary opacity-50 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v14a2 2 0 01-2 2h-6a2 2 0 01-2-2" />
                        </svg>
                        <p className="text-text-primary font-medium">Analytics Dashboard</p>
                        <p className="text-text-secondary text-sm mt-1">Detailed views and lead generation charts will appear here.</p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default DealerDashboard;