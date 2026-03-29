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
  const [carContext, setCarContext] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOpenChat = (event: CustomEvent) => {
        setIsOpen(true);
        if (event.detail?.carTitle) {
            setCarContext(event.detail);
            setMessages([{ role: 'dealer', text: `Hi there! I am the verified seller of the ${event.detail.carTitle}. Are you interested in taking a look or making an offer?` }]);
        } else {
             setMessages([{ role: 'dealer', text: `Hi there! Let me know which car you are interested in.` }]);
        }
        
        if (event.detail?.message) {
            setInput(event.detail.message);
        }
    };
    
    window.addEventListener('openDealerChat', handleOpenChat as EventListener);
    return () => window.removeEventListener('openDealerChat', handleOpenChat as EventListener);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, isTyping]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const dealerResponses = [
         "Thanks for reaching out! The car is currently available. When would you like to schedule a viewing or test drive?",
         "Yes, the price is slightly negotiable if we can finalize the deal quickly. What's your offer?",
         "It's been well-maintained and regularly serviced. I have all the proper documentation ready.",
         "Perfect, let's connect! I'll share my contact number so we can easily plan the next steps.",
         "The car is in excellent condition. Have you already seen the images and PDI report?"
      ];
      
      const randomResponse = dealerResponses[Math.floor(Math.random() * dealerResponses.length)];
      
      setMessages(prev => [...prev, { role: 'dealer', text: randomResponse }]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000); // Random delay 1.5s - 2.5s for human realism
  };

  return (
    <>
      <div className={`fixed bottom-24 right-4 z-[998] w-[calc(100vw-2rem)] max-w-sm transition-all duration-500 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16 pointer-events-none'}`}>
        <div className="bg-secondary border border-white/10 rounded-2xl shadow-2xl flex flex-col h-[60vh] max-h-[600px] overflow-hidden">
          
          {/* Header */}
          <header className="flex items-center justify-between p-4 bg-primary/80 backdrop-blur-sm border-b border-white/5">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-accent text-primary flex items-center justify-center font-bold text-lg relative">
                S
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-primary rounded-full"></span>
              </div>
              <div>
                 <h3 className="text-md font-bold text-text-primary">Verified Seller</h3>
                 <p className="text-xs text-text-secondary flex items-center">
                    <span className="text-green-500 mr-1">●</span> Online Now
                 </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-text-secondary hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </header>
          
          {/* Messages Area */}
          <div className="flex-1 p-5 overflow-y-auto custom-scrollbar space-y-4 bg-secondary">
             <div className="text-center text-xs text-text-secondary mb-4 border-b border-white/5 pb-4">
                 Chat securely encrypted. Protect your personal information.
             </div>
             
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-5 py-3 shadow-soft ${msg.role === 'user' ? 'bg-[#2A4735] text-text-primary rounded-br-none' : 'bg-primary text-text-secondary rounded-bl-none border border-white/5'}`}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}
            
             {isTyping && (
              <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl px-5 py-4 bg-primary text-text-secondary rounded-bl-none border border-white/5">
                      <div className="flex items-center space-x-2 opacity-60">
                        <div className="w-1.5 h-1.5 bg-text-secondary rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-1.5 h-1.5 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                  </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="p-4 bg-primary/50 border-t border-white/5">
            <div className="flex items-center bg-secondary border border-white/10 rounded-full px-2 shadow-inner focus-within:border-accent/50 transition-colors">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-transparent px-4 py-3 text-sm text-text-primary focus:outline-none placeholder-text-secondary/50"
                disabled={isTyping}
              />
              <button 
                type="submit" 
                disabled={isTyping || !input.trim()} 
                className="p-2 mr-1 rounded-full bg-accent text-primary transition-all disabled:opacity-50 disabled:bg-white/10 disabled:text-text-secondary"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default DealerChatModal;
