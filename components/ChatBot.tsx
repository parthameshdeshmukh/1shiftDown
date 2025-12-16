import React, { useState, useEffect, useRef } from 'react';
import { startChat } from '../services/geminiService';
import type { Chat } from '@google/genai';
import MessageSquareIcon from './icons/MessageSquareIcon';

interface Message {
  role: 'user' | 'model';
  text: string;
  sources?: { uri: string; title: string; }[];
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newChat = startChat();
    setChat(newChat);
    setMessages([{ role: 'model', text: 'Hello! How can I help you find the perfect car today?' }]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !chat || isLoading) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const stream = await chat.sendMessageStream({ message: input });
      let text = '';
      let currentSources: any[] = [];
      
      setMessages(prev => [...prev, { role: 'model', text: '...' }]);

      for await (const chunk of stream) {
        text += chunk.text;
        if (chunk.candidates?.[0]?.groundingMetadata?.groundingChunks) {
          currentSources = chunk.candidates[0].groundingMetadata.groundingChunks
            .map((c: any) => c.web)
            .filter(Boolean);
        }
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { role: 'model', text, sources: currentSources };
          return newMessages;
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={`fixed bottom-4 right-4 z-[999] transition-all duration-300 ${isOpen ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'}`}>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-accent text-primary h-16 w-16 rounded-full shadow-lg shadow-accent/20 flex items-center justify-center animate-pulse-glow"
          aria-label="Open chat"
        >
          <MessageSquareIcon className="h-8 w-8" />
        </button>
      </div>

      <div className={`fixed bottom-4 right-4 z-[999] w-[calc(100vw-2rem)] max-w-lg transition-all duration-500 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16 pointer-events-none'}`}>
        <div className="bg-secondary border-2 border-accent/30 rounded-2xl shadow-2xl shadow-black/50 flex flex-col h-[70vh] max-h-[700px]">
          <header className="flex items-center justify-between p-4 border-b border-white/10">
            <h3 className="text-xl font-serif font-bold">1Shift AI Assistant</h3>
            <button onClick={() => setIsOpen(false)} className="text-text-secondary hover:text-text-primary">&times;</button>
          </header>
          
          <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${msg.role === 'user' ? 'bg-accent text-primary rounded-br-none' : 'bg-primary text-text-primary rounded-bl-none'}`}>
                  <p className="text-sm" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }} />
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-primary/50">
                      <h4 className="text-xs font-bold mb-1">Sources:</h4>
                      <ul className="space-y-1">
                        {msg.sources.map((source, i) => (
                          <li key={i}>
                            <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-xs text-text-secondary hover:underline truncate block">
                              {i + 1}. {source.title || source.uri}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
             {isLoading && messages[messages.length - 1].role !== 'model' && (
              <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-primary text-text-primary rounded-bl-none">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-accent rounded-full animate-pulse [animation-delay:0.2s]"></div>
                        <div className="w-2 h-2 bg-accent rounded-full animate-pulse [animation-delay:0.4s]"></div>
                      </div>
                  </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10">
            <div className="flex items-center bg-primary rounded-lg">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything about cars..."
                className="flex-1 bg-transparent px-4 py-3 text-sm focus:outline-none"
                disabled={isLoading}
              />
              <button type="submit" disabled={isLoading} className="text-accent p-3 disabled:opacity-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChatBot;
