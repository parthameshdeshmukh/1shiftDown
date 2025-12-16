import React from 'react';

interface PdiPlanCardProps {
  title: string;
  price: string;
  features: string[];
  isFeatured?: boolean;
}

const PdiPlanCard: React.FC<PdiPlanCardProps> = ({ title, price, features, isFeatured }) => {
  return (
    <div className={`relative border rounded-xl p-8 flex flex-col text-center transition-all duration-500 transform hover:-translate-y-2 ${
        isFeatured
        ? 'bg-secondary border-accent/50 shadow-2xl shadow-accent/10'
        : 'bg-secondary border-white/10 hover:border-white/20'
    }`}>
      {isFeatured && (
        <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-accent text-primary font-bold text-xs px-4 py-1 rounded-full uppercase tracking-wider">
            Most Popular
        </div>
      )}
      <h3 className="text-2xl font-serif font-bold text-text-primary">{title}</h3>
      <p className={`my-6 text-4xl font-bold font-serif ${isFeatured ? 'text-accent' : 'text-text-primary'}`}>{price}</p>
      <ul className="space-y-4 text-text-secondary flex-grow mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-left">
            <svg className="h-5 w-5 mr-3 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <button className={`w-full font-bold py-3 px-4 rounded-lg shadow-lg transition-colors duration-300 mt-auto ${
          isFeatured
          ? 'bg-accent hover:opacity-90 text-primary shadow-accent/20'
          : 'bg-white/10 hover:bg-white/20 text-text-primary'
      }`}>
        Book Now
      </button>
    </div>
  );
};

export default PdiPlanCard;