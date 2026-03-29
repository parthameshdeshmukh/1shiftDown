import React from 'react';

interface CarDetailsModalProps {
    isOpen: boolean;
    car: any | null;
    onClose: () => void;
}

const CarDetailsModal: React.FC<CarDetailsModalProps> = ({ isOpen, car, onClose }) => {
    if (!isOpen || !car) return null;

    const handleChatRequest = () => {
        const message = `Hello! I am highly interested in the ${car.title} listed at ${car.price} located in ${car.location}. Is it still available?`;
        window.dispatchEvent(new CustomEvent('openDealerChat', { detail: { message, carTitle: car.title } }));
        onClose(); // Close modal to focus on chat
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in-up">
            <div className="bg-secondary w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden border border-white/10 flex flex-col md:flex-row relative">
                
                {/* Close Button */}
                <button onClick={onClose} className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-red-500 text-white rounded-full p-2 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Left Side: Massive Image */}
                <div className="w-full md:w-1/2 h-64 md:h-auto bg-primary relative">
                    <img 
                        src={typeof car.generatedImage === 'string' ? car.generatedImage : (car.image || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800')} 
                        alt={car.title}
                        className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                        <span className="bg-accent text-primary px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">Verified 1Shift Down Listing</span>
                    </div>
                </div>

                {/* Right Side: Deep Analytics & CTA */}
                <div className="w-full md:w-1/2 p-8 flex flex-col bg-secondary">
                    <div className="mb-6">
                        <h2 className="text-3xl font-serif font-bold text-text-primary mb-2">{car.title}</h2>
                        <p className="text-3xl text-accent font-bold mb-4">{car.price}</p>
                        
                        <div className="flex items-center space-x-2 text-text-secondary border-b border-white/5 pb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="font-medium text-lg">{car.location}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-8 text-text-primary">
                        <div className="bg-primary/50 rounded-xl p-4 border border-white/5">
                            <span className="text-xs text-text-secondary uppercase tracking-wider block mb-1">Odometer</span>
                            <span className="font-bold text-lg">{car.kms || 'N/A'}</span>
                        </div>
                        <div className="bg-primary/50 rounded-xl p-4 border border-white/5">
                            <span className="text-xs text-text-secondary uppercase tracking-wider block mb-1">Fuel Type</span>
                            <span className="font-bold text-lg">{car.fuel || 'Petrol'}</span>
                        </div>
                        <div className="bg-primary/50 rounded-xl p-4 border border-white/5">
                            <span className="text-xs text-text-secondary uppercase tracking-wider block mb-1">Ownership</span>
                            <span className="font-bold text-lg">{car.owner || '1st Owner'}</span>
                        </div>
                        <div className="bg-primary/50 rounded-xl p-4 border border-white/5">
                            <span className="text-xs text-text-secondary uppercase tracking-wider block mb-1">Transmission</span>
                            <span className="font-bold text-lg">Automatic</span>
                        </div>
                    </div>

                    <div className="mt-auto flex flex-col space-y-3">
                        <button 
                            onClick={handleChatRequest}
                            className="w-full bg-accent hover:bg-yellow-500 text-primary font-bold py-4 px-6 rounded-xl shadow-glow transition-all flex items-center justify-center space-x-3"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <span className="text-xl">Contact Seller Directly</span>
                        </button>
                        
                        <button 
                            onClick={onClose}
                            className="w-full bg-primary hover:bg-white/5 text-text-secondary font-bold py-4 px-6 rounded-xl border border-white/10 transition-all"
                        >
                            Back to Library
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarDetailsModal;
