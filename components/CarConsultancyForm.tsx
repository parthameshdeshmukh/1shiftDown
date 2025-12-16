import React, { useState, useCallback } from 'react';
import type { UsedCarFormData, NewCarFormData } from '../types';
import { BRANDS, FUEL_TYPES, TRANSMISSION_TYPES, OWNERSHIP_OPTIONS, FEATURES, BODY_TYPES, COLORS } from '../constants';

interface FilterPanelProps {
  onSubmit: () => void;
  isLoading: boolean;
  searchType: 'used' | 'new';
  newData: NewCarFormData;
  setNewData: React.Dispatch<React.SetStateAction<NewCarFormData>>;
  usedData: UsedCarFormData;
  setUsedData: React.Dispatch<React.SetStateAction<UsedCarFormData>>;
}

const FilterSection: React.FC<{ title: string; children: React.ReactNode; isCollapsible?: boolean }> = ({ title, children, isCollapsible }) => {
  if (isCollapsible) {
    return (
       <details className="bg-secondary/50 border border-white/10 rounded-lg text-text-primary group">
        <summary className="text-sm font-semibold px-4 py-3 cursor-pointer list-none flex justify-between items-center group-open:border-b group-open:border-white/10">
          {title}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform duration-300 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </summary>
        <div className="p-4">{children}</div>
      </details>
    )
  }
  return (
    <div className="bg-secondary/50 border border-white/10 rounded-lg text-text-primary">
      <h3 className="text-sm font-semibold px-4 py-3 border-b border-white/10">{title}</h3>
      <div className="p-4">{children}</div>
    </div>
  )
};

const Checkbox: React.FC<{ label: string; checked: boolean; onChange: (checked: boolean) => void; name: string }> = ({ label, checked, onChange, name }) => (
  <label className="flex items-center space-x-3 text-sm text-text-secondary cursor-pointer hover:text-text-primary transition-colors">
    <input
      type="checkbox"
      name={name}
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="h-4 w-4 rounded-sm border-white/20 bg-primary text-accent focus:ring-accent/50 focus:ring-offset-0"
    />
    <span>{label}</span>
  </label>
);

const IconButton: React.FC<{ label: string; icon: React.ReactNode; selected: boolean; onClick: () => void; }> = ({ label, icon, selected, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className={`w-full flex flex-col items-center justify-center p-2 border rounded-lg text-center transition-all duration-300 group ${
            selected ? 'bg-accent/10 border-accent text-accent' : 'bg-secondary border-white/10 hover:border-white/20'
        }`}
    >
        <div className="h-8 mb-1 flex items-center justify-center">{icon}</div>
        <span className="text-xs font-semibold">{label}</span>
    </button>
);

const FilterPanel: React.FC<FilterPanelProps> = ({ onSubmit, isLoading, searchType, newData, setNewData, usedData, setUsedData }) => {
  const currentYear = new Date().getFullYear();

  const handleMultiSelectChange = useCallback((field: keyof UsedCarFormData | keyof NewCarFormData, value: string) => {
    const setter = searchType === 'used' ? setUsedData : setNewData;
    setter(prev => {
      const currentValues = prev[field as keyof typeof prev] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [field]: newValues };
    });
  }, [searchType, setNewData, setUsedData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };
  
  const commonFormData = searchType === 'used' ? usedData : newData;
  const setCommonFormData = searchType === 'used' ? setUsedData : setNewData;

  const BodyTypeIcon: React.FC<{ type: string }> = ({ type }) => {
    const iconMap: { [key: string]: string } = {
        'SUV': "https://pure.co.in/wp-content/uploads/2021/11/Tata-Harrier-Front.png",
        'Sedan': "https://www.team-bhp.com/sites/default/files/styles/check_out_similar_cars/public/2023-Hyundai-Verna-front.png",
        'Hatchback': "https://www.rushlane.com/wp-content/uploads/2022/03/maruti-baleno-review-1-1200x675.jpg",
        'MUV': "https://imgd.aeplcdn.com/1280x720/n/cw/ec/112949/carens-exterior-right-front-three-quarter-2.jpeg?is-pending-processing=1&q=80",
        'Convertible': "https://imgd-ct.aeplcdn.com/1056x660/n/cw/ec/145323/amg-sl-55-roadster-exterior-right-front-three-quarter.jpeg?is-pending-processing=1&q=80",
        'Coupe': "https://imgd.aeplcdn.com/1280x720/n/cw/ec/139931/e-class-coupe-exterior-right-front-three-quarter.jpeg?is-pending-processing=1&q=80",
    };
    const iconSrc = iconMap[type];
    if (!iconSrc) {
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-text-secondary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-8.25V15" /></svg>;
    }
    return <img src={iconSrc} alt={type} className="h-8 w-auto opacity-80 group-hover:opacity-100 transition-opacity object-contain" />;
};

  return (
    <div className="bg-secondary p-8 rounded-xl border border-white/10 h-full flex flex-col">
      <h2 className="text-3xl font-serif font-bold text-text-primary mb-6">
        {searchType === 'used' ? 'Find Your Next Used Car' : 'Discover Your New Car'}
      </h2>
      <div className="flex-grow overflow-y-auto pr-3 -mr-3 space-y-6">
        
        <FilterSection title={searchType === 'used' ? 'Price Range' : 'Max Budget'}>
          {searchType === 'used' ? (
            <div className="space-y-4 text-text-secondary">
              <div>
                <label className="text-sm">Min: <span className="font-bold text-text-primary">₹{usedData.price[0].toLocaleString('en-IN')}</span></label>
                <input type="range" min="100000" max="10000000" step="50000" value={usedData.price[0]} onChange={e => setUsedData(p => ({...p, price: [+e.target.value, Math.max(+e.target.value, p.price[1])]}))} className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent"/>
              </div>
              <div>
                <label className="text-sm">Max: <span className="font-bold text-text-primary">₹{usedData.price[1].toLocaleString('en-IN')}</span></label>
                <input type="range" min="100000" max="10000000" step="50000" value={usedData.price[1]} onChange={e => setUsedData(p => ({...p, price: [Math.min(p.price[0], +e.target.value), +e.target.value]}))} className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent"/>
              </div>
            </div>
          ) : (
             <>
              <label htmlFor="budget" className="block text-sm font-medium text-text-secondary mb-2">Up to: <span className="font-bold text-text-primary">₹{newData.budget.toLocaleString('en-IN')}</span></label>
              <input id="budget" type="range" min="300000" max="10000000" step="100000" value={newData.budget} onChange={e => setNewData(p => ({ ...p, budget: +e.target.value }))} className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent" />
            </>
          )}
        </FilterSection>

        <FilterSection title="Brand & Model">
           <div className="space-y-4">
              <input type="text" placeholder="Search Model (e.g. Swift)" value={commonFormData.model} onChange={e => setCommonFormData((p: any) => ({...p, model: e.target.value}))} className="block w-full bg-primary text-text-primary border border-white/10 rounded-lg py-2 px-3 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent text-sm transition-colors" />
              <div className="space-y-3 max-h-40 overflow-y-auto">
                {BRANDS.map(brand => <Checkbox key={brand} label={brand} name="brands" checked={commonFormData.brands.includes(brand)} onChange={() => handleMultiSelectChange('brands', brand)} />)}
              </div>
           </div>
        </FilterSection>

        {searchType === 'new' && (
            <FilterSection title="Body Type">
              <div className="grid grid-cols-3 gap-3">
                {BODY_TYPES.slice(0, 6).map(type => (
                  <IconButton key={type} label={type} icon={<BodyTypeIcon type={type} />} selected={newData.bodyTypes.includes(type)} onClick={() => handleMultiSelectChange('bodyTypes', type)} />
                ))}
              </div>
            </FilterSection>
        )}

        {searchType === 'used' && (
          <>
            <FilterSection title="Model Year">
                <div className="space-y-4 text-text-secondary">
                    <div>
                        <label className="text-sm">From: <span className="font-bold text-text-primary">{usedData.year[0]}</span></label>
                        <input type="range" min={currentYear - 20} max={currentYear} value={usedData.year[0]} onChange={e => setUsedData(p => ({...p, year: [+e.target.value, Math.max(+e.target.value, p.year[1])]}))} className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent"/>
                    </div>
                    <div>
                        <label className="text-sm">To: <span className="font-bold text-text-primary">{usedData.year[1]}</span></label>
                        <input type="range" min={currentYear - 20} max={currentYear} value={usedData.year[1]} onChange={e => setUsedData(p => ({...p, year: [Math.min(p.year[0], +e.target.value), +e.target.value]}))} className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent"/>
                    </div>
                </div>
            </FilterSection>

            <FilterSection title="Kilometers Driven">
              <label htmlFor="kmsDriven" className="block text-sm font-medium text-text-secondary mb-2">Up to: <span className="font-bold text-text-primary">{usedData.kmsDriven.toLocaleString('en-IN')} km</span></label>
              <input id="kmsDriven" type="range" min="5000" max="200000" step="5000" value={usedData.kmsDriven} onChange={e => setUsedData(p => ({ ...p, kmsDriven: +e.target.value }))} className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent" />
            </FilterSection>
          </>
        )}

        {searchType === 'new' && (
          <FilterSection title="Yearly Running">
            <label htmlFor="yearlyRunning" className="flex items-center text-sm font-medium text-text-secondary mb-2 group">
                Distance: <span className="font-bold text-text-primary ml-1">{newData.yearlyRunning.toLocaleString('en-IN')} km/year</span>
                <span className="ml-2 text-slate-500 cursor-help relative">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 w-48 p-2 bg-primary text-text-primary text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        ~10k km: City driving. ~20k km: Highway commute. 30k+ km: High usage, consider Diesel/EV.
                    </span>
                </span>
            </label>
            <input id="yearlyRunning" type="range" min="5000" max="50000" step="1000" value={newData.yearlyRunning} onChange={e => setNewData(p => ({ ...p, yearlyRunning: +e.target.value }))} className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent" />
          </FilterSection>
        )}
        
        <FilterSection title="Fuel & Transmission">
            <div className="grid grid-cols-4 gap-3">
                <IconButton label="Petrol" icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5l.415-.207a.75.75 0 011.085.67V10.5m0 0h6m-6 0a.75.75 0 001.085.67l.415-.207M8.25 10.5V7.5m0 3v4.5m0-4.5h6m-6 0a.75.75 0 01-1.085-.67l-.415.207M12 7.5v4.5m0-4.5h6m-6 0V15" /></svg>} selected={commonFormData.fuelTypes.includes('Petrol')} onClick={() => handleMultiSelectChange('fuelTypes', 'Petrol')} />
                <IconButton label="Diesel" icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} selected={commonFormData.fuelTypes.includes('Diesel')} onClick={() => handleMultiSelectChange('fuelTypes', 'Diesel')} />
                <IconButton label="Electric" icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5" /></svg>} selected={commonFormData.fuelTypes.includes('Electric')} onClick={() => handleMultiSelectChange('fuelTypes', 'Electric')} />
                <IconButton label="CNG" icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>} selected={commonFormData.fuelTypes.includes('CNG')} onClick={() => handleMultiSelectChange('fuelTypes', 'CNG')} />
                 <IconButton label="Manual" icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 6.75h4.5m-4.5 0v10.5m0 0h4.5m-4.5 0H5.625m10.125 0h.375m-3.75 0V6.75" /></svg>} selected={commonFormData.transmission.includes('Manual')} onClick={() => handleMultiSelectChange('transmission', 'Manual')} />
                <IconButton label="Automatic" icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75V14.25m0 0a2.25 2.25 0 01-2.25 2.25h-1.5a2.25 2.25 0 01-2.25-2.25V9.75M12 14.25v-4.5h3.375a2.25 2.25 0 012.25 2.25v1.5a2.25 2.25 0 01-2.25 2.25H12z" /></svg>} selected={commonFormData.transmission.includes('Automatic')} onClick={() => handleMultiSelectChange('transmission', 'Automatic')} />
            </div>
        </FilterSection>

        {searchType === 'new' && (
           <>
            <FilterSection title="Color">
                <div className="flex flex-wrap gap-4">
                    {COLORS.map(color => (
                        <button
                            key={color.name}
                            type="button"
                            title={color.name}
                            onClick={() => handleMultiSelectChange('colors', color.name)}
                            className={`w-8 h-8 rounded-full border-2 transition-transform duration-200 ${newData.colors.includes(color.name) ? 'border-accent scale-110' : 'border-white/20 hover:scale-110'}`}
                            style={{ backgroundColor: color.hex }}
                        />
                    ))}
                </div>
            </FilterSection>

            <FilterSection title="Features" isCollapsible>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 max-h-40 overflow-y-auto">
                  {FEATURES.map(feat => <Checkbox key={feat} label={feat} name="features" checked={newData.features.includes(feat)} onChange={() => handleMultiSelectChange('features', feat)} />)}
                </div>
            </FilterSection>
          </>
        )}

        {searchType === 'used' && (
           <>
            <FilterSection title="Ownership">
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                {OWNERSHIP_OPTIONS.map(opt => <Checkbox key={opt} label={opt} name="ownerCount" checked={usedData.ownerCount.includes(opt)} onChange={() => handleMultiSelectChange('ownerCount', opt)} />)}
              </div>
            </FilterSection>

            <FilterSection title="Location">
                <div className="space-y-4">
                    <input type="text" placeholder="City (e.g. Mumbai)" value={usedData.location} onChange={e => setUsedData(p => ({...p, location: e.target.value}))} className="block w-full bg-primary text-text-primary border border-white/10 rounded-lg py-2 px-3 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent text-sm transition-colors" />
                    <input type="text" placeholder="Registration State (e.g. MH)" value={usedData.registrationState} onChange={e => setUsedData(p => ({...p, registrationState: e.target.value}))} className="block w-full bg-primary text-text-primary border border-white/10 rounded-lg py-2 px-3 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent text-sm transition-colors" />
                </div>
            </FilterSection>
            
            <FilterSection title="Features">
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 max-h-40 overflow-y-auto">
                  {FEATURES.map(feat => <Checkbox key={feat} label={feat} name="features" checked={usedData.features.includes(feat)} onChange={() => handleMultiSelectChange('features', feat)} />)}
                </div>
            </FilterSection>
          </>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-white/10">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-accent hover:opacity-90 text-primary font-bold py-3 px-4 rounded-lg shadow-lg shadow-accent/20 transform transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? 'Searching...' : 'Find My Car'}
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;
