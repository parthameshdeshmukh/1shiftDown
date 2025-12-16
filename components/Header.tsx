import React from 'react';
import type { Page } from '../App';

interface NavLinkProps {
  onClick: () => void;
  children: React.ReactNode;
  isActive?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ onClick, children, isActive }) => (
  <button
    onClick={onClick}
    className={`relative px-4 py-2 text-sm font-medium transition-colors duration-500 ${isActive
      ? 'text-text-primary'
      : 'text-text-secondary hover:text-text-primary'
      }`}
  >
    {children}
    {isActive && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-accent"></span>}
  </button>
);

const Logo: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <a href="#" onClick={(e) => { e.preventDefault(); onClick(); }} className="flex items-center text-3xl font-sans tracking-tight">
    <span className="font-extrabold text-accent">1</span>
    <span className="font-extrabold text-text-primary">Shift</span>
    <span className="font-normal text-text-primary ml-2">Down</span>
  </a>
);


interface HeaderProps {
  currentPage: Page;
  navigate: (page: Page) => void;
  isScrolled: boolean;
  isLoggedIn: boolean;
}

const Header: React.FC<HeaderProps> = ({ currentPage, navigate, isScrolled, isLoggedIn }) => {
  return (
    <header className={`bg-primary/70 backdrop-blur-lg border-b border-white/5 sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-primary/90 shadow-2xl shadow-black/20' : ''}`}>
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-300 ${isScrolled ? 'h-16' : 'h-20'}`}>
          <div className="flex items-center">
            <Logo onClick={() => navigate('home')} />
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <NavLink onClick={() => navigate('home')} isActive={currentPage === 'home'}>Home</NavLink>
            <NavLink onClick={() => navigate('listings')} isActive={currentPage === 'listings'}>Listings</NavLink>
            <NavLink onClick={() => navigate('pdi')} isActive={currentPage === 'pdi'}>PDI Services</NavLink>
            <NavLink onClick={() => navigate('consultancy')} isActive={currentPage === 'consultancy'}>Consultancy</NavLink>
            <NavLink onClick={() => navigate('dashboard')} isActive={currentPage === 'dashboard'}>Dashboard</NavLink>

            {isLoggedIn ? (
              <div className="ml-6 flex items-center space-x-3 cursor-pointer group" onClick={() => navigate('dashboard')}>
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent to-yellow-600 p-[2px] shadow-glow">
                  <div className="w-full h-full rounded-full bg-primary flex items-center justify-center overflow-hidden">
                    <img src="https://ui-avatars.com/api/?name=User&background=random&color=fff" alt="User" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            ) : (
              <button onClick={() => navigate('login')} className="ml-6 border border-accent text-accent font-semibold py-2.5 px-6 rounded-lg transition-all duration-300 hover:bg-accent hover:text-black hover:shadow-glow flex items-center space-x-2 text-sm uppercase tracking-wide">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;