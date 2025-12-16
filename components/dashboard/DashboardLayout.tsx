import React from 'react';

interface DashboardLayoutProps {
    title: string;
    subtitle?: string;
    role?: string;
    children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ title, subtitle, role, children }) => {
    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-text-primary mb-2">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-text-secondary text-lg">{subtitle}</p>
                    )}
                </div>
                {role && (
                    <div className="bg-accent/10 border border-accent/20 px-4 py-2 rounded-full">
                        <span className="text-accent font-bold uppercase tracking-wider text-sm">
                            {role} Account
                        </span>
                    </div>
                )}
            </header>

            <main className="space-y-12">
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;
