import React, { useState, useRef } from 'react';
import PdiPlanCard from '../components/PdiPlanCard';
import emailjs from '@emailjs/browser';

const PdiPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formRef.current) return;

    try {
      // TODO: Replace these placeholders with your actual EmailJS IDs
      // Get them from https://dashboard.emailjs.com/
      const serviceId = 'service_v4t994g'; 
      const templateId = 'template_k4zcerq';
      const publicKey = 'eelqj27hNfStnQh_h';

      const formData = new FormData(formRef.current);
      
      // Formatting the form data to fit the generic {{message}} variable in your EmailJS template
      const templateParams = {
        title: 'New PDI Booking Request',
        name: formData.get('name'),
        email: formData.get('email'),
        message: `
Phone: ${formData.get('phone')}
Car Model: ${formData.get('car_model')}
Selected Plan: ${formData.get('plan')}
Location: ${formData.get('location')}
Date: ${formData.get('date')}
        `
      };

      const response = await emailjs.send(
        serviceId,
        templateId,
        templateParams,
        publicKey
      );

      if (response.status === 200) {
        setSubmitted(true);
        formRef.current.reset();
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (error) {
      console.error('EmailJS Error:', error);
      alert("Something went wrong! Please check your EmailJS configuration.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Intro */}
      <div className="text-center max-w-4xl mx-auto mb-20">
        <h1 className="text-5xl md:text-6xl font-serif font-extrabold tracking-tight mb-6">Professional PDI Services</h1>
        <p className="text-lg text-text-secondary">Our hybrid approach combines convenience with expertise. Book your Pre-Delivery Inspection online, our certified inspector conducts a thorough offline check, and you receive a comprehensive digital report right in your dashboard.</p>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-24">
        <PdiPlanCard title="Basic" price="60-Point Check" features={["Essential Mechanical Checks", "Engine & Transmission Vitals", "Basic Digital Report", "Ideal for Newer Cars"]} />
        <PdiPlanCard title="Premium" price="90+ Point Check" features={["Everything in Basic", "Full Diagnostic Scan", "Interior & Exterior Detailing", "In-depth Digital Report"]} isFeatured={true} />
        <PdiPlanCard title="Elite" price="90+ & Background" features={["Everything in Premium", "Service & Challan History", "Accident Record Check", "Post-Inspection Consultation"]} />
      </div>

      {/* Booking Form */}
      <div className="max-w-4xl mx-auto bg-secondary p-10 rounded-2xl shadow-lg border border-white/10">
        <h2 className="text-4xl font-serif font-bold text-center mb-8">Book Your Inspection</h2>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" name="name" placeholder="Your Name" required className="form-input" />
            <input type="tel" name="phone" placeholder="Phone Number" required className="form-input" />
          </div>
          <input type="email" name="email" placeholder="Email Address" required className="form-input" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" name="car_model" placeholder="Car Model (e.g., Maruti Swift)" required className="form-input" />
            <select name="plan" required className="form-input">
              <option value="">Select Plan</option>
              <option value="basic">Basic Plan</option>
              <option value="premium">Premium Plan</option>
              <option value="elite">Elite Plan</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" name="location" placeholder="Inspection Location (City)" required className="form-input" />
            <input type="date" name="date" required className="form-input text-text-secondary" />
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full bg-accent hover:opacity-90 text-primary font-bold py-4 px-4 rounded-lg shadow-lg shadow-accent/20 transform transition-all duration-300 ease-in-out hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
            {isSubmitting ? 'Submitting...' : 'Request PDI Booking'}
          </button>
        </form>
        {submitted && (
          <div className="mt-8 p-4 bg-green-500/10 text-green-300 border border-green-500/20 rounded-lg text-center">
            <p className="font-semibold">Your PDI Request Has Been Received!</p>
            <p className="text-sm">Our team will contact you shortly to confirm the details and schedule your offline inspection.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdiPage;