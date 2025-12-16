import React from 'react';

interface StatCardProps {
    title: string;
    value: string;
    // FIX: Changed the type of `icon` to `React.ReactElement<any>`.
    // This resolves an issue where TypeScript couldn't verify that `className` is a valid prop for the cloned element,
    // ensuring that styles can be applied to the icon dynamically.
    icon: React.ReactElement<any>;
    color: string; // color is kept for potential future use but overridden by accent
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
    return (
        <div className="bg-secondary p-6 rounded-xl border border-white/10 flex items-center space-x-6">
            <div className={`flex-shrink-0 w-14 h-14 rounded-lg flex items-center justify-center bg-accent/10 text-accent`}>
                {React.cloneElement(icon, { className: "h-7 w-7" })}
            </div>
            <div>
                <p className="text-sm text-text-secondary">{title}</p>
                <p className="text-3xl font-bold text-text-primary">{value}</p>
            </div>
        </div>
    );
};

export default StatCard;