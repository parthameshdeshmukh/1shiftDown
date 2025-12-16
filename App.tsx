import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';

// Import page components
import HomePage from './pages/HomePage';
import ListingsPage from './pages/ListingsPage';
import PdiPage from './pages/PdiPage';
import ConsultancyPage from './pages/ConsultancyPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import ProConsultancyBookingPage from './pages/ProConsultancyBookingPage';

export type Page = 'home' | 'listings' | 'pdi' | 'consultancy' | 'dashboard' | 'login' | 'pro-consultancy-booking';

import { carsData } from './data/cars';
import { generateListingCarImage } from './services/geminiService';

// ... existing imports

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Lifted Listings State
  const [listings, setListings] = useState(
    carsData.map(car => ({
      ...car,
      generatedImage: null as string | null,
      isGenerating: true,
    }))
  );
  const [imagesInitialized, setImagesInitialized] = useState(false);

  useEffect(() => {
    if (imagesInitialized) return;
    setImagesInitialized(true);

    listings.forEach(async (car) => {
      if (car.generatedImage === null && car.isGenerating) {
        try {
          const imageUrl = await generateListingCarImage(car.title, car.fuel);
          setListings(prev => prev.map(c => c.id === car.id ? { ...c, generatedImage: imageUrl, isGenerating: false } : c));
        } catch (error) {
          // console.error(`Failed to generate image for ${car.title}:`, error); // Suppress log spam
          setListings(prev => prev.map(c => c.id === car.id ? { ...c, isGenerating: false } : c));
        }
      }
    });
  }, [imagesInitialized]); // Removed listings dep to prevent loop

  const handleAddListing = (newListing: any) => {
    // Ensure price is treated as a number for formatting
    const rawPrice = Number(newListing.price);
    const formattedPrice = !isNaN(rawPrice)
      ? `₹${(rawPrice / 100000).toFixed(2)} Lakh`
      : newListing.price;

    const listingWithId = {
      id: Date.now(), // Use timestamp for unique ID to avoid collisions
      ...newListing,
      price: formattedPrice,
      rawPrice: rawPrice, // Store raw for editing
      kms: `${newListing.kms} km`,
      rawKms: newListing.kms, // Store raw for editing
      owner: '1st Owner',
      generatedImage: newListing.image,
      isGenerating: false,
    };
    setListings([listingWithId, ...listings]);
    alert("Listing added successfully!");
  };

  const handleUpdateListing = (updatedListing: any) => {
    setListings(prev => prev.map(listing => {
      if (listing.id === updatedListing.id) {
        // Re-format price if changed
        const rawPrice = Number(updatedListing.price);
        const formattedPrice = !isNaN(rawPrice)
          ? `₹${(rawPrice / 100000).toFixed(2)} Lakh`
          : updatedListing.price;

        return {
          ...listing,
          ...updatedListing,
          price: formattedPrice,
          rawPrice: rawPrice,
          kms: `${updatedListing.kms} km`,
          rawKms: updatedListing.kms
        };
      }
      return listing;
    }));
    alert("Listing updated successfully!");
  };

  const navigate = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // Scroll to top on page change
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate('dashboard');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage navigate={navigate} />;
      case 'listings':
        return <ListingsPage listings={listings} onAddListing={handleAddListing} />;
      case 'pdi':
        return <PdiPage />;
      case 'consultancy':
        return <ConsultancyPage navigate={navigate} />;
      case 'dashboard':
        return <DashboardPage listings={listings} onAddListing={handleAddListing} />;
      case 'login':
        return <LoginPage navigate={navigate} onLogin={handleLogin} />;
      case 'pro-consultancy-booking':
        return <ProConsultancyBookingPage navigate={navigate} />;
      default:
        return <HomePage navigate={navigate} />;
    }
  };

  return (
    <div className="bg-primary min-h-screen font-sans text-text-primary flex flex-col">
      <Header currentPage={currentPage} navigate={navigate} isScrolled={isScrolled} isLoggedIn={isLoggedIn} />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};

export default App;