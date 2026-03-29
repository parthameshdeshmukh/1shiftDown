import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginPageProps {
    onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const navigate = useNavigate();
    const [formType, setFormType] = useState<'login' | 'register'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
        <button
            onClick={onClick}
            className={`w-1/2 pb-4 font-bold text-center transition-colors duration-300 border-b-2 ${active
                ? 'text-accent border-accent'
                : 'text-text-secondary border-transparent hover:border-text-secondary'
                }`}
        >
            {children}
        </button>
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const adminEmail = (import.meta as any).env.VITE_ADMIN_EMAIL || 'admin@1shift.com';
        const adminPassword = (import.meta as any).env.VITE_ADMIN_PASSWORD || 'admin123';

        if (formType === 'login') {
            if (email === adminEmail && password === adminPassword) {
                onLogin();
                navigate('/dashboard');
            } else {
                setError('Invalid email or password. Please try again.');
            }
        } else {
            // Allow registration to automatically log the user in for the demo
            onLogin();
            navigate('/dashboard');
        }
    }

    return (
        <div className="container mx-auto px-4 py-16 flex justify-center items-center">
            <div className="w-full max-w-md bg-secondary p-8 md:p-12 rounded-2xl shadow-soft border border-white/5">
                <div className="flex mb-8">
                    <TabButton active={formType === 'login'} onClick={() => setFormType('login')}>Login</TabButton>
                    <TabButton active={formType === 'register'} onClick={() => setFormType('register')}>Register</TabButton>
                </div>

                {formType === 'login' ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="text-center mb-6">
                            <h2 className="text-3xl font-serif font-bold text-text-primary mb-2">Welcome Back</h2>
                            <p className="text-xs text-text-secondary bg-primary/30 py-2 px-4 rounded-lg inline-block border border-white/5">
                                Demo Login: <strong className="text-accent">admin@1shift.com</strong> / <strong className="text-accent">admin123</strong>
                            </p>
                        </div>
                        {error && <div className="bg-red-900/50 border border-red-700 text-red-300 p-3 rounded-lg text-sm text-center">{error}</div>}
                        <div>
                            <label className="text-sm font-medium text-text-secondary mb-2 block">Email Address</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="form-input" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-text-secondary mb-2 block">Password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="form-input" />
                        </div>
                        <button type="submit" className="w-full bg-accent hover:bg-yellow-500 text-primary font-bold py-3 px-4 rounded-xl shadow-glow transition-all">
                            Login
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <h2 className="text-3xl font-serif font-bold text-center text-text-primary mb-6">Create Account</h2>
                        <div>
                            <label className="text-sm font-medium text-text-secondary mb-2 block">Full Name</label>
                            <input type="text" required className="form-input" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-text-secondary mb-2 block">Email Address</label>
                            <input type="email" required className="form-input" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-text-secondary mb-2 block">Password</label>
                            <input type="password" required className="form-input" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-text-secondary mb-2 block">I am a...</label>
                            <div className="flex gap-4">
                                <label className="flex-1 flex items-center p-4 border border-white/5 rounded-xl cursor-pointer bg-primary has-[:checked]:border-accent has-[:checked]:bg-accent/10 transition-all">
                                    <input type="radio" name="role" value="individual" defaultChecked className="h-4 w-4 mr-3 text-accent focus:ring-accent/50 bg-primary border-white/30" />
                                    <span className="text-text-primary">Individual (Buyer/Seller)</span>
                                </label>
                                <label className="flex-1 flex items-center p-4 border border-white/5 rounded-xl cursor-pointer bg-primary has-[:checked]:border-accent has-[:checked]:bg-accent/10 transition-all">
                                    <input type="radio" name="role" value="dealer" className="h-4 w-4 mr-3 text-accent focus:ring-accent/50 bg-primary border-white/30" />
                                    <span className="text-text-primary">Dealer</span>
                                </label>
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-accent hover:bg-yellow-500 text-primary font-bold py-3 px-4 rounded-xl shadow-glow transition-all">
                            Register
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default LoginPage;