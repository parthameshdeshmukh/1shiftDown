import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import DealerChatModal from './components/DealerChatModal';

// Import page components
import HomePage from './pages/HomePage';
import ListingsPage from './pages/ListingsPage';
import PdiPage from './pages/PdiPage';
import ConsultancyPage from './pages/ConsultancyPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import ProConsultancyBookingPage from './pages/ProConsultancyBookingPage';

import { carsData } from './data/cars';
import { generateListingCarImage } from './services/geminiService';

// ... existing imports

const App: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Lifted Listings State
  const [listings, setListings] = useState(
    carsData.map(car => ({
      ...car,
      generatedImage: car.image,
      isGenerating: false,
    }))
  );
  // Ensure listings have fallbacks natively without spamming the backend
  const [imagesInitialized, setImagesInitialized] = useState(true);

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

  const handleDeleteListing = (id: number) => {
    setListings(prev => prev.filter(listing => listing.id !== id));
    alert("Listing deleted successfully!");
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="bg-primary min-h-screen font-sans text-text-primary flex flex-col">
        <Header isScrolled={isScrolled} isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage listings={listings} />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="/listings" element={<ListingsPage listings={listings} onAddListing={handleAddListing} />} />
            <Route path="/pdi" element={<PdiPage />} />
            <Route path="/consultancy" element={<ConsultancyPage listings={listings} />} />
            <Route path="/dashboard" element={isLoggedIn ? <DashboardPage listings={listings} onAddListing={handleAddListing} onDeleteListing={handleDeleteListing} onUpdateListing={handleUpdateListing} /> : <Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/pro-consultancy-booking" element={<ProConsultancyBookingPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
        <ChatBot />
        <DealerChatModal />
      </div>
    </Router>
  );
};

export default App;