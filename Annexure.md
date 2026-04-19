# ANNEXURE

## Source Code

This annexure contains the essential source code for the **1Shift Down** application, demonstrating the core frontend architecture, AI integration, and key user interface components.

### 1. Main Application Routing & State Management (`App.tsx`)
*This file serves as the entry point for the React application, handling the central state for vehicle listings and defining the routing for all pages.*

```typescript
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

  const handleAddListing = (newListing: any) => {
    const rawPrice = Number(newListing.price);
    const formattedPrice = !isNaN(rawPrice)
      ? `₹${(rawPrice / 100000).toFixed(2)} Lakh`
      : newListing.price;

    const listingWithId = {
      id: Date.now(), 
      ...newListing,
      price: formattedPrice,
      rawPrice: rawPrice, 
      kms: `${newListing.kms} km`,
      rawKms: newListing.kms, 
      owner: '1st Owner',
      generatedImage: newListing.image,
      isGenerating: false,
    };
    setListings([listingWithId, ...listings]);
    alert("Listing added successfully!");
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
            <Route path="/dashboard" element={isLoggedIn ? <DashboardPage listings={listings} onAddListing={handleAddListing} onDeleteListing={() => {}} onUpdateListing={() => {}} /> : <Navigate to="/login" replace />} />
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
```

### 2. Backend Server AI Logic (`server/src/controllers/geminiController.ts`)
*This Express controller handles requests for AI car recommendations, generating custom prompts based on user input, and communicating with the Google Gemini API.*

```typescript
import { Request, Response } from 'express';
import { GoogleGenAI, Type, Chat, Modality } from "@google/genai";

const getAI = () => {
    const key = process.env.API_KEY;
    if (!key) {
        console.warn("API_KEY environment variable not set in server");
    }
    return new GoogleGenAI({ apiKey: key || '' });
};

const generateNewCarPrompt = (formData: any): string => {
    return `
    You are an expert car consultant for the Indian new car market.
    Based on the following filters, suggest the top 3 best new car models in India.
    Be highly contextual. For high yearly running (>15,000 km), strongly consider diesel/hybrids/EVs.

    User Filters:
    - Budget: Up to ₹${formData.budget.toLocaleString('en-IN')}
    - Brands: ${formData.brands.length > 0 ? formData.brands.join(', ') : 'Any'}
    - Yearly Running: ${formData.yearlyRunning.toLocaleString('en-IN')} km

    For each car, provide: make/model, on-road price, mileage, reasons, top features, match score, fuel/body type, and an image link.
    Output a JSON array of objects.
  `;
};

export const getNewCarRecommendations = async (req: Request, res: Response) => {
    try {
        const formData = req.body;
        const prompt = generateNewCarPrompt(formData);

        const ai = getAI();
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            makeModel: { type: Type.STRING },
                            variant: { type: Type.STRING },
                            price: { type: Type.STRING },
                            mileage: { type: Type.STRING },
                            reasons: { type: Type.ARRAY, items: { type: Type.STRING } },
                            matchScore: { type: Type.NUMBER },
                            image: { type: Type.STRING },
                        },
                        required: ['makeModel', 'variant', 'price', 'mileage', 'reasons', 'matchScore', 'image'],
                    },
                },
            },
        });

        let jsonStr = response.text ? response.text.trim() : "[]";
        if (jsonStr.startsWith('\`\`\`json')) jsonStr = jsonStr.slice(7);
        if (jsonStr.startsWith('\`\`\`')) jsonStr = jsonStr.slice(3);
        if (jsonStr.endsWith('\`\`\`')) jsonStr = jsonStr.slice(0, -3);
        res.json(JSON.parse(jsonStr.trim()));
    } catch (error) {
        console.error("Error fetching recommendations:", error);
        res.status(500).json({ error: "Failed to generate new car recommendations." });
    }
};
```

### 3. Integrated Real-time Dealer Chat (`components/DealerChatModal.tsx`)
*This component manages the interactive UI where a user can directly securely communicate with a verified vehicle seller.*

```tsx
import React, { useState, useEffect, useRef } from 'react';

interface Message {
  role: 'user' | 'dealer';
  text: string;
}

const DealerChatModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOpenChat = (event: CustomEvent) => {
        setIsOpen(true);
        if (event.detail?.carTitle) {
            setMessages([{ role: 'dealer', text: \`Hi! I am the verified seller of the \${event.detail.carTitle}. Are you interested?\` }]);
        }
    };
    
    window.addEventListener('openDealerChat', handleOpenChat as EventListener);
    return () => window.removeEventListener('openDealerChat', handleOpenChat as EventListener);
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    setMessages(prev => [...prev, { role: 'user', text: input }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const dealerResponses = [
         "Thanks for reaching out! When would you like to schedule a viewing?",
         "The car is in excellent condition. Have you seen the PDI report?"
      ];
      const randomResponse = dealerResponses[Math.floor(Math.random() * dealerResponses.length)];
      
      setMessages(prev => [...prev, { role: 'dealer', text: randomResponse }]);
      setIsTyping(false);
    }, 1500); 
  };

  return (
    <div className={\`fixed bottom-24 right-4 z-[998] max-w-sm \${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}\`}>
        <div className="bg-secondary flex flex-col h-[60vh] max-h-[600px] overflow-hidden rounded-2xl shadow-2xl">
          <header className="p-4 bg-primary/80 border-b border-white/5 flex justify-between">
            <h3 className="text-md font-bold text-text-primary">Verified Seller</h3>
            <button onClick={() => setIsOpen(false)}>Close</button>
          </header>
          
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={\`flex \${msg.role === 'user' ? 'justify-end' : 'justify-start'}\`}>
                <div className={\`max-w-[85%] rounded-2xl p-3 \${msg.role === 'user' ? 'bg-[#2A4735]' : 'bg-primary'}\`}>
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="p-4 bg-primary/50 border-t border-white/5">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="w-full bg-transparent p-2 text-sm text-text-primary"
              disabled={isTyping}
            />
          </form>
        </div>
    </div>
  );
};

export default DealerChatModal;
```
