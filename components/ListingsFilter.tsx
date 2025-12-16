import React, { useState } from 'react';
import { UsedCarFormData } from '../types';

// Reusable Components
const FilterSection: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen = true }) => {
    return (
        <details className="bg-secondary rounded-xl text-text-primary mb-4 shadow-soft group border border-white/5" open={defaultOpen}>
            <summary className="w-full text-left font-serif font-bold p-5 flex justify-between items-center text-lg text-text-primary cursor-pointer list-none hover:text-accent transition-colors">
                <span>{title}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 text-text-secondary transition-transform duration-300 transform group-open:rotate-180`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                </svg>
            </summary>
            <div className="px-5 pb-5 pt-0">
                {children}
            </div>
        </details>
    );
};

const Checkbox: React.FC<{ label: string; icon?: string }> = ({ label, icon }) => (
    <label className="flex items-center justify-between text-text-secondary hover:text-text-primary transition-colors cursor-pointer text-sm py-2 group">
        <div className="flex items-center space-x-3">
            <input type="checkbox" className="h-5 w-5 rounded border-white/20 bg-primary checked:bg-accent checked:border-accent focus:ring-accent/50 focus:ring-offset-primary transition-all" />
            <div className="flex items-center space-x-2 group-hover:text-text-primary transition-colors">
                {icon && <span className="text-lg opacity-70 group-hover:opacity-100 transition-opacity">{icon}</span>}
                <span className="font-medium">{label}</span>
            </div>
        </div>
    </label>
);

const Radio: React.FC<{ label: string; name: string; checked?: boolean; }> = ({ label, name, checked }) => (
    <label className="flex items-center justify-between text-text-secondary hover:text-text-primary transition-colors cursor-pointer text-sm py-2 group">
        <div className="flex items-center space-x-3">
            <input type="radio" name={name} defaultChecked={checked} className="h-5 w-5 border-white/20 bg-primary text-accent focus:ring-accent/50 focus:ring-offset-primary" />
            <span className="font-medium group-hover:text-text-primary transition-colors">{label}</span>
        </div>
    </label>
);

const BodyTypeIcon = ({ type }: { type: string }) => {
    const icons: { [key: string]: string } = {
        'SUV': "https://imgd.aeplcdn.com/0x0/cw/body/svg/suv_1626338830202.svg?v=1",
        'Sedan': "https://imgd.aeplcdn.com/0x0/cw/body/svg/sedan_1626338827438.svg?v=1",
        'Hatchback': "https://imgd.aeplcdn.com/0x0/cw/body/svg/hatchback_1626338820977.svg?v=1",
        'MUV': "https://imgd.aeplcdn.com/0x0/cw/body/svg/muv_1626338825222.svg?v=1",
        'Minivan': "https://imgd.aeplcdn.com/0x0/cw/body/svg/minivan_1626338824242.svg?v=1",
        'Coupe': "https://imgd.aeplcdn.com/0x0/cw/body/svg/coupe_1626338817650.svg?v=1",
    };
    if (!icons[type]) return null;
    return <div className="w-12 h-8 flex items-center justify-center rounded bg-white/5 p-1"><img src={icons[type]} alt={type} className="h-full opacity-70 contrast-0 grayscale invert" /></div>
}


const BodyTypeCheckbox: React.FC<{ label: string; }> = ({ label }) => (
    <label className="flex items-center justify-between text-text-secondary hover:text-text-primary transition-colors cursor-pointer text-sm py-2 group">
        <div className="flex items-center space-x-3">
            <input type="checkbox" className="h-5 w-5 rounded border-white/20 bg-primary checked:bg-accent checked:border-accent focus:ring-accent/50 focus:ring-offset-primary" />
            <BodyTypeIcon type={label} />
            <span className="font-medium group-hover:text-text-primary transition-colors">{label}</span>
        </div>
    </label>
);

const ShowMoreButton: React.FC<{ onClick: () => void; isShowingMore: boolean; itemType: string }> = ({ onClick, isShowingMore, itemType }) => (
    <button onClick={onClick} className="text-accent font-semibold text-xs uppercase tracking-wider mt-4 hover:text-white transition-colors flex items-center gap-1">
        {isShowingMore ? `Show Less` : `Show More ${itemType}`}
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 transition-transform ${isShowingMore ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
    </button>
);

interface ListingsFilterProps {
    filters: Partial<UsedCarFormData>;
    setFilters: React.Dispatch<React.SetStateAction<Partial<UsedCarFormData>>>;
}

const DualRangeSlider: React.FC<{
    min: number;
    max: number;
    values: [number, number];
    setValues: (newValues: [number, number]) => void;
    unit: string;
    step: number;
}> = ({ min, max, values, setValues, unit, step }) => {
    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newMin = Math.min(Number(e.target.value), values[1] - step);
        setValues([newMin, values[1]]);
    };

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newMax = Math.max(Number(e.target.value), values[0] + step);
        setValues([values[0], newMax]);
    };

    const minPos = ((values[0] - min) / (max - min)) * 100;
    const maxPos = ((values[1] - min) / (max - min)) * 100;

    return (
        <div className="space-y-4 pt-2">
            <div className="flex justify-between items-center text-text-primary font-bold font-mono text-sm bg-primary/50 p-2 rounded-lg border border-white/5">
                <span>{unit}{values[0].toLocaleString('en-IN')}</span>
                <span className="text-text-secondary">-</span>
                <span>{unit}{values[1].toLocaleString('en-IN')}</span>
            </div>
            <div className="relative h-2 w-full flex items-center my-4">
                <div className="relative w-full h-1 bg-white/10 rounded-full">
                    <div className="absolute top-0 h-1 bg-accent rounded-full shadow-glow" style={{ left: `${minPos}%`, right: `${100 - maxPos}%` }} />
                    <input type="range" min={min} max={max} step={step} value={values[0]} onChange={handleMinChange} className="absolute w-full h-1 appearance-none bg-transparent pointer-events-auto cursor-pointer" style={{ zIndex: 3 }} />
                    <input type="range" min={min} max={max} step={step} value={values[1]} onChange={handleMaxChange} className="absolute w-full h-1 appearance-none bg-transparent pointer-events-auto cursor-pointer" style={{ zIndex: 4 }} />
                </div>
            </div>
        </div>
    )
};


const ListingsFilter: React.FC<ListingsFilterProps> = ({ filters, setFilters }) => {
    const [showMore, setShowMore] = useState({ brands: false, body: false, seats: false, rto: false });

    const toggleShowMore = (key: keyof typeof showMore) => {
        setShowMore(prev => ({ ...prev, [key]: !prev[key] }));
    }

    // Clear styles
    const clearFilters = () => {
        // Reset logic would go here - for now just alert or simple setState reset if default known
        setFilters({ price: [0, 6000000], year: [2002, 2025], kmsDriven: 200000 });
    }


    const popularBrands = ["Maruti", "Hyundai", "Honda", "Toyota", "Tata", "Mahindra"];
    const luxuryBrands = ["Mercedes-Benz", "BMW", "Audi", "Land Rover"];

    return (
        <aside className="lg:sticky top-24 h-fit lg:max-h-[calc(100vh-6rem)] overflow-y-auto pr-2 custom-scrollbar pb-10">

            <div className="flex justify-between items-center mb-6 px-1">
                <h2 className="text-xl font-serif font-bold text-text-primary">Filters</h2>
                <button onClick={clearFilters} className="text-xs font-semibold text-accent hover:text-white uppercase tracking-wider transition-colors">
                    Clear All
                </button>
            </div>

            {/* Selected filters placeholder - can be made dynamic based on state */}
            {/* <div className="mb-6 flex flex-wrap gap-2">
                 <span className="bg-accent/10 border border-accent/20 text-accent text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    SUV <button className="hover:text-white">×</button>
                 </span>
            </div> */}

            <FilterSection title="Budget">
                <DualRangeSlider min={0} max={6000000} values={filters.price as [number, number]} setValues={(v) => setFilters(f => ({ ...f, price: v }))} unit="₹" step={50000} />
            </FilterSection>

            <FilterSection title="Quick Price Range">
                <div className="space-y-1">
                    <Checkbox label="Under ₹2 Lakh" />
                    <Checkbox label="₹2 - ₹3 Lakh" />
                    <Checkbox label="₹3 - ₹5 Lakh" />
                    <Checkbox label="₹5 - ₹8 Lakh" />
                    <Checkbox label="Above ₹10 Lakh" />
                </div>
            </FilterSection>

            <FilterSection title="Brand + Model">
                <input type="search" placeholder="Search Brand..." className="block w-full bg-primary text-text-primary border border-white/10 rounded-lg py-3 px-4 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent text-sm transition-colors mb-4 placeholder:text-text-secondary/50" />
                <div className="space-y-1">
                    <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-2 mt-1">Popular</p>
                    {popularBrands.map(b => <Checkbox key={b} label={b} />)}

                    <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-2 mt-4">Luxury</p>
                    {luxuryBrands.slice(0, showMore.brands ? luxuryBrands.length : 2).map(b => <Checkbox key={b} label={b} />)}
                </div>
                <ShowMoreButton onClick={() => toggleShowMore('brands')} isShowingMore={showMore.brands} itemType="Brands" />
            </FilterSection>

            <FilterSection title="Model Year">
                <DualRangeSlider min={2002} max={2025} values={filters.year as [number, number]} setValues={(v) => setFilters(f => ({ ...f, year: v }))} unit="" step={1} />
            </FilterSection>

            <FilterSection title="Kilometer Driven">
                <DualRangeSlider min={0} max={200000} values={[0, filters.kmsDriven || 200000]} setValues={(v) => setFilters(f => ({ ...f, kmsDriven: v[1] }))} unit="" step={5000} />
            </FilterSection>

            <FilterSection title="Fuel Type">
                <div className="space-y-1">
                    <Checkbox label="Petrol" icon="⛽" />
                    <Checkbox label="Diesel" icon="🛢️" />
                    <Checkbox label="CNG" icon="💨" />
                    <Checkbox label="Electric" icon="⚡" />
                    <Checkbox label="LPG" icon="🔥" />
                </div>
            </FilterSection>

            <FilterSection title="Body Type">
                <div className="space-y-1">
                    <BodyTypeCheckbox label="SUV" />
                    <BodyTypeCheckbox label="Sedan" />
                    <BodyTypeCheckbox label="Hatchback" />
                    <BodyTypeCheckbox label="MUV" />
                    <BodyTypeCheckbox label="Minivan" />
                    <BodyTypeCheckbox label="Coupe" />
                </div>
                <ShowMoreButton onClick={() => { }} isShowingMore={false} itemType="Body Type" />
            </FilterSection>

            <FilterSection title="Transmission">
                <div className="space-y-1">
                    <Checkbox label="Manual" icon="⚙️" />
                    <Checkbox label="Automatic" icon="🚗" />
                </div>
            </FilterSection>

            <FilterSection title="Ownership">
                <div className="space-y-1">
                    <Checkbox label="First owner" />
                    <Checkbox label="Second owner" />
                    <Checkbox label="Third owner" />
                </div>
            </FilterSection>

            <FilterSection title="Seller Type" defaultOpen={false}>
                <div className="space-y-1">
                    <Radio name="category" label="Individual" checked />
                    <Radio name="category" label="Dealer" />
                </div>
            </FilterSection>

        </aside>
    )
}
export default ListingsFilter;