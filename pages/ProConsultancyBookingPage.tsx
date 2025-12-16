import React, { useState } from 'react';
import type { Page } from '../App';

interface ProConsultancyBookingPageProps {
  navigate: (page: Page) => void;
}

const ProConsultancyBookingPage: React.FC<ProConsultancyBookingPageProps> = ({ navigate }) => {
  const [result, setResult] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setResult("Sending...");

    const formData = new FormData(form);
    // 👇 Your Web3Forms Access Key
    formData.append("access_key", "a1a759f5-b0ff-427f-b4f1-1c056af28748");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        setResult("Form submitted successfully!");
        form.reset();
        setSubmitted(true);
      } else {
        setResult("Error submitting form.");
      }
    } catch (error) {
      console.error(error);
      setResult("Something went wrong!");
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center p-4 bg-primary animate-fade-in-up">
      <div className="w-full max-w-2xl bg-secondary p-8 md:p-12 rounded-2xl shadow-2xl shadow-accent/10 border-2 border-accent/50 transition-all duration-500">
        {submitted ? (
          <div className="text-center animate-fade-in-up">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-accent mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-3xl font-serif font-bold text-text-primary mb-4">Thank You!</h2>
            <p className="text-text-secondary max-w-md mx-auto">
              Our car consultant will contact you shortly with personalized recommendations.
            </p>
            <button
              onClick={() => navigate('home')}
              className="mt-8 bg-accent/20 hover:bg-accent/30 text-accent font-bold py-3 px-8 rounded-lg transition-colors duration-300"
            >
              Back to Home
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-center text-text-primary mb-10">
              Book Your Personalized Car Consultancy Session
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-text-secondary mb-2">Full Name</label>
                  <input type="text" name="name" id="fullName" placeholder="John Doe" required className="form-input" />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-text-secondary mb-2">Phone Number</label>
                  <input type="tel" name="phone" id="phone" placeholder="9876543210" required className="form-input" />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">Email Address</label>
                <input type="email" name="email" id="email" placeholder="john.doe@example.com" required className="form-input" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="carPreference" className="block text-sm font-medium text-text-secondary mb-2">Car Preference</label>
                  <select name="carPreference" id="carPreference" required className="form-input mb-6">
                    <option value="">Select a type</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="EV">EV</option>
                    <option value="Luxury">Luxury</option>
                    <option value="Sports">Sports</option>
                  </select>

                  <label htmlFor="carType" className="block text-sm font-medium text-text-secondary mb-2">Car Type</label>
                  <select name="carType" id="carType" required className="form-input">
                    <option value="">Select a type</option>
                    <option value="Used">Used Car</option>
                    <option value="New">New Car</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-text-secondary mb-2">Budget Range</label>
                  <select name="budget" id="budget" required className="form-input">
                    <option value="">Select a range</option>
                    <option value="<5L">Below ₹5L</option>
                    <option value="5-10L">₹5 – ₹10L</option>
                    <option value="10-20L">₹10 – ₹20L</option>
                    <option value=">20L">₹20L+</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="purpose" className="block text-sm font-medium text-text-secondary mb-2">Purpose of Car</label>
                <textarea name="purpose" id="purpose" rows={3} required placeholder="e.g., Daily office commute, family weekend trips..." className="form-input"></textarea>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-text-secondary mb-2">Additional Notes (Optional)</label>
                <textarea name="notes" id="notes" rows={2} placeholder="Any specific feature or model in mind?" className="form-input"></textarea>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-accent text-primary font-bold py-4 px-8 rounded-lg shadow-lg shadow-accent/20 transition-all duration-300 ease-in-out hover:opacity-90 hover:shadow-xl hover:shadow-accent/30 transform hover:scale-[1.02]"
                >
                  Confirm Booking ₹999
                </button>
              </div>
              <p className="text-center text-sm mt-4 text-text-secondary">{result}</p>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ProConsultancyBookingPage;