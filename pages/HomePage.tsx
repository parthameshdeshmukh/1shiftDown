import React from 'react';
import CarCard from '../components/CarCard';
import PdiPlanCard from '../components/PdiPlanCard';
import { Page } from '../App';

const featuredCars = [
  { id: 1, image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/40087/thar-exterior-right-front-three-quarter-11.jpeg?is-pending-processing=1&q=80', title: 'Mahindra Thar', price: '₹14.30 Lakh', location: 'Delhi', kms: '22,000 km', fuel: 'Diesel', owner: '1st Owner' },
  { id: 2, image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/130591/fronx-exterior-right-front-three-quarter-109.jpeg?is-pending-processing=1&q=80', title: 'Maruti Suzuki Fronx', price: '₹8.90 Lakh', location: 'Mumbai', kms: '12,500 km', fuel: 'Petrol', owner: '1st Owner' },
  { id: 3, image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/124013/scorpio-n-exterior-right-front-three-quarter-72.jpeg?is-pending-processing=1&q=80', title: 'Mahindra Scorpio N', price: '₹17.50 Lakh', location: 'Pune', kms: '35,000 km', fuel: 'Diesel', owner: '2nd Owner' },
  { id: 4, image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/142515/new-seltos-exterior-right-front-three-quarter-2.jpeg?is-pending-processing=1&q=80', title: 'Kia Seltos', price: '₹12.80 Lakh', location: 'Bangalore', kms: '45,000 km', fuel: 'Petrol', owner: '1st Owner' },
  { id: 5, image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/141115/creta-exterior-right-front-three-quarter-16.jpeg?is-pending-processing=1&q=80', title: 'Hyundai Creta', price: '₹13.10 Lakh', location: 'Chennai', kms: '60,000 km', fuel: 'Diesel', owner: '1st Owner' },
  { id: 6, image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/142739/xuv700-exterior-right-front-three-quarter-2.jpeg?is-pending-processing=1&q=80', title: 'Mahindra XUV700', price: '₹19.90 Lakh', location: 'Hyderabad', kms: '18,000 km', fuel: 'Petrol', owner: '1st Owner' },
];

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, description: string, delay: number }> = ({ icon, title, description, delay }) => (
  <div
    className="bg-secondary p-8 rounded-xl border border-white/5 text-center transition-all duration-500 hover:border-accent/30 hover:shadow-soft hover:-translate-y-2 opacity-0 animate-fade-in-up"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="mx-auto w-16 h-16 mb-6 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
      {icon}
    </div>
    <h3 className="text-2xl font-serif font-bold mb-2 text-text-primary">{title}</h3>
    <p className="text-text-secondary">{description}</p>
  </div>
);


const HomePage: React.FC<{ navigate: (page: Page) => void; }> = ({ navigate }) => {
  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-secondary text-white text-center py-24 md:py-48 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-5 bg-[url('https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=2940&auto=format&fit=crop')] animate-bg-zoom"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent"></div>
        <div className="relative z-10 container mx-auto">
          <h1 className="text-5xl md:text-7xl font-serif font-extrabold tracking-tight mb-4 animate-fade-in-down text-text-primary">Buy Smart. Drive Confident.</h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-text-secondary mb-10 animate-fade-in-up [animation-delay:200ms]">India’s trusted platform for used cars, expert inspections, and smart recommendations.</p>
          <div className="animate-fade-in-up [animation-delay:400ms]">
            <button onClick={() => navigate('consultancy')} className="bg-accent text-primary font-bold py-4 px-10 rounded-xl shadow-glow transform transition-transform duration-300 ease-in-out hover:scale-105 animate-pulse-glow hover:bg-yellow-500">
              Try AI Car Recommender
            </button>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-primary py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-serif font-bold text-center mb-16 text-text-primary">Your Complete Car Buying Partner</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <FeatureCard
              delay={0}
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.375 3.375 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}
              title="AI Consultancy"
              description="Get unbiased, data-driven new and used car recommendations tailored to your exact needs."
            />
            <FeatureCard
              delay={200}
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              title="Verified Listings"
              description="Browse thousands of listings from trusted dealers and individual sellers across India."
            />
            <FeatureCard
              delay={400}
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>}
              title="PDI Services"
              description="Book a professional Pre-Delivery Inspection to ensure your chosen car is in perfect condition."
            />
          </div>
        </div>
      </div>


      {/* Featured Cars */}
      <div className="bg-secondary py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-serif font-bold text-center mb-16 text-text-primary">Featured Used Cars</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCars.map((car, index) => (
              <div key={car.id} className="opacity-0 animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                <CarCard car={car} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PDI Service Preview */}
      <div className="bg-primary py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-serif font-bold text-center mb-4 text-text-primary">Book a Professional Inspection</h2>
          <p className="text-text-secondary text-center max-w-3xl mx-auto mb-16 text-lg">Our certified technicians inspect the car offline. You get a detailed digital report. Peace of mind, guaranteed.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0ms' }}>
              <PdiPlanCard title="Basic" price="60-Point Check" features={["Essential Checks", "Engine & Transmission", "Basic Report"]} />
            </div>
            <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <PdiPlanCard title="Premium" price="90+ Point Check" features={["Everything in Basic", "Full Diagnostics", "Detailed Report"]} isFeatured={true} />
            </div>
            <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <PdiPlanCard title="Elite" price="90+ & Background" features={["Everything in Premium", "Challan/History Check", "Expert Consultation"]} />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default HomePage;