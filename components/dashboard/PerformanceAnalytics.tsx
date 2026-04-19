import React from 'react';

interface PerformanceAnalyticsProps {
    listings: any[];
}

const PerformanceAnalytics: React.FC<PerformanceAnalyticsProps> = ({ listings }) => {
    // Process data for analytics
    const fuelCounts = listings.reduce((acc: any, car) => {
        const fuel = car.fuel || 'Other';
        acc[fuel] = (acc[fuel] || 0) + 1;
        return acc;
    }, {});

    const totalCars = listings.length;
    
    // Mock data for weekly trends (since we don't have historical data)
    const weeklyData = [
        { day: 'Mon', views: 120, leads: 8 },
        { day: 'Tue', views: 150, leads: 12 },
        { day: 'Wed', views: 80, leads: 5 },
        { day: 'Thu', views: 210, leads: 18 },
        { day: 'Fri', views: 190, leads: 15 },
        { day: 'Sat', views: 320, leads: 25 },
        { day: 'Sun', views: 280, leads: 20 },
    ];

    const maxViews = Math.max(...weeklyData.map(d => d.views));

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Views & Leads Chart */}
                <div className="bg-secondary p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>
                    </div>
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                        Weekly Traffic Trend
                    </h3>
                    <div className="h-48 flex items-end gap-2 md:gap-4 px-2">
                        {weeklyData.map((d, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group/bar">
                                <div className="w-full relative flex items-end justify-center">
                                    {/* Views Bar */}
                                    <div 
                                        className="w-full bg-accent/20 rounded-t-md transition-all duration-500 group-hover/bar:bg-accent/40"
                                        style={{ height: `${(d.views / maxViews) * 100}%` }}
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-accent text-primary text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity">
                                            {d.views}
                                        </div>
                                    </div>
                                    {/* Leads Bar (Inner) */}
                                    <div 
                                        className="w-1/2 bg-accent rounded-t-sm absolute bottom-0 transition-all duration-700 delay-100"
                                        style={{ height: `${(d.leads / (maxViews / 10)) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="text-[10px] text-text-secondary uppercase font-bold tracking-tighter">{d.day}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 flex justify-between items-center border-t border-white/5 pt-4">
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-accent/30"></span>
                                <span className="text-[10px] text-text-secondary uppercase font-bold">Views</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-accent"></span>
                                <span className="text-[10px] text-text-secondary uppercase font-bold">Leads</span>
                            </div>
                        </div>
                        <span className="text-xs text-accent font-medium">+12.5% vs last week</span>
                    </div>
                </div>

                {/* Fuel Type Distribution (Pie Chart Style) */}
                <div className="bg-secondary p-6 rounded-2xl border border-white/5">
                    <h3 className="text-lg font-semibold mb-6">Inventory Mix</h3>
                    <div className="flex items-center gap-8">
                        <div className="relative w-32 h-32">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                {Object.entries(fuelCounts).map(([fuel, count], index, arr) => {
                                    const percentage = (count as number / totalCars) * 100;
                                    let offset = 0;
                                    for(let i=0; i<index; i++) {
                                        offset += (arr[i][1] as number / totalCars) * 100;
                                    }
                                    const colors = ['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6'];
                                    return (
                                        <circle
                                            key={fuel}
                                            cx="18"
                                            cy="18"
                                            r="16"
                                            fill="none"
                                            className="transition-all duration-1000"
                                            stroke={colors[index % colors.length]}
                                            strokeWidth="3"
                                            strokeDasharray={`${percentage} 100`}
                                            strokeDashoffset={-offset}
                                        />
                                    );
                                })}
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl font-bold">{totalCars}</span>
                                <span className="text-[10px] text-text-secondary uppercase font-bold">Total</span>
                            </div>
                        </div>
                        <div className="flex-1 space-y-3">
                            {Object.entries(fuelCounts).map(([fuel, count], index) => {
                                const percentage = ((count as number / totalCars) * 100).toFixed(0);
                                const colors = ['bg-yellow-500', 'bg-blue-500', 'bg-emerald-500', 'bg-purple-500'];
                                return (
                                    <div key={fuel} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <span className={`w-2 h-2 rounded-full ${colors[index % colors.length]}`}></span>
                                            <span className="text-sm text-text-secondary font-medium group-hover:text-text-primary transition-colors">{fuel}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold">{count as number}</span>
                                            <span className="text-[10px] text-text-secondary w-8 text-right font-mono">{percentage}%</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="mt-6 border-t border-white/5 pt-4">
                        <p className="text-[11px] text-text-secondary italic">Optimize your inventory by balancing fuel types based on recent market demand.</p>
                    </div>
                </div>
            </div>

            {/* Price Analysis Section */}
            <div className="bg-secondary/50 p-6 rounded-2xl border border-white/5">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-semibold">Listing Pricing Health</h3>
                        <p className="text-xs text-text-secondary">Competitive analysis of your current listings' prices.</p>
                    </div>
                    <button className="text-xs font-bold text-accent uppercase tracking-widest hover:underline decoration-2 underline-offset-4">Full Report →</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-center">
                        <p className="text-[10px] text-text-secondary uppercase font-black mb-1">Under Market</p>
                        <p className="text-2xl font-bold text-emerald-400">4 Cars</p>
                        <p className="text-[10px] text-emerald-400/60 mt-1 font-medium">Fast Turnover Expected</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-center shadow-lg shadow-accent/5 ring-1 ring-accent/20">
                        <p className="text-[10px] text-text-secondary uppercase font-black mb-1">Fair Market</p>
                        <p className="text-2xl font-bold text-accent">7 Cars</p>
                        <p className="text-[10px] text-accent/60 mt-1 font-medium">Regular Sales Rhythm</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-center">
                        <p className="text-[10px] text-text-secondary uppercase font-black mb-1">Over Market</p>
                        <p className="text-2xl font-bold text-red-400">1 Car</p>
                        <p className="text-[10px] text-red-400/60 mt-1 font-medium">Review Pricing Strategy</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PerformanceAnalytics;
