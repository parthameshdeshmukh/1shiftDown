import React, { useState } from 'react';

interface AddListingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (listing: any) => void;
    initialData?: any;
}

const AddListingModal: React.FC<AddListingModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState({
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        price: '',
        kms: '',
        fuel: 'Petrol',
        transmission: 'Manual',
        location: '',
        image: null as File | null
    });
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    React.useEffect(() => {
        if (isOpen) {
            if (initialData) {
                // Parse existing data
                // If brand/model are missing (legacy data), try to extract from title
                let brand = initialData.brand || '';
                let model = initialData.model || '';
                let year = initialData.year || new Date().getFullYear();

                if (!brand && initialData.title) {
                    const parts = initialData.title.split(' ');
                    if (parts.length >= 3) {
                        // e.g. "2022 Mahindra Thar"
                        if (!isNaN(parseInt(parts[0]))) {
                            year = parseInt(parts[0]);
                            brand = parts[1];
                            model = parts.slice(2).join(' ');
                        } else {
                            // e.g. "Mahindra Thar" (no year)
                            brand = parts[0];
                            model = parts.slice(1).join(' ');
                        }
                    }
                }

                // Extract numeric price from formatted string if needed (e.g. ₹12.00 Lakh -> 1200000)
                let price = initialData.rawPrice || initialData.price;
                if (typeof price === 'string' && price.includes('Lakh')) {
                    // Simple parse: remove non-numeric chars except dot
                    const match = price.match(/([\d.]+)/);
                    if (match) {
                        price = parseFloat(match[1]) * 100000;
                    }
                }

                // Extract kms from formatted string
                let kms = initialData.rawKms || initialData.kms;
                if (typeof kms === 'string' && kms.includes('km')) {
                    const match = kms.match(/([\d,]+)/);
                    if (match) {
                        kms = parseInt(match[1].replace(/,/g, ''));
                    }
                }

                setFormData({
                    brand,
                    model,
                    year,
                    price: price,
                    kms: kms,
                    fuel: initialData.fuel || 'Petrol',
                    transmission: initialData.transmission || 'Manual',
                    location: initialData.location || '',
                    image: null
                });
                setPreviewUrl(initialData.image || initialData.generatedImage || null);
            } else {
                // Reset for new entry
                setFormData({
                    brand: '',
                    model: '',
                    year: new Date().getFullYear(),
                    price: '',
                    kms: '',
                    fuel: 'Petrol',
                    transmission: 'Manual',
                    location: '',
                    image: null
                });
                setPreviewUrl(null);
            }
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData(prev => ({ ...prev, image: file }));
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const capitalizeAndFormat = (str: string) => {
        if (!str) return '';
        return str.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formattedBrand = capitalizeAndFormat(formData.brand);
        const formattedModel = capitalizeAndFormat(formData.model);
        const formattedLocation = capitalizeAndFormat(formData.location);

        // Create a listing object
        const newListing = {
            ...formData,
            brand: formattedBrand,
            model: formattedModel,
            location: formattedLocation,
            image: previewUrl || 'https://imgd.aeplcdn.com/664x374/n/cw/ec/141115/creta-exterior-right-front-three-quarter-16.jpeg',
            title: `${formData.year} ${formattedBrand} ${formattedModel}`
        };
        onSubmit(newListing);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-secondary rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/5 shadow-soft">
                <div className="p-6 border-b border-white/5 flex justify-between items-center sticky top-0 bg-secondary z-10">
                    <h2 className="text-2xl font-serif font-bold text-text-primary">{initialData ? 'Edit Listing' : 'Sell Your Car'}</h2>
                    <button onClick={onClose} className="text-text-secondary hover:text-text-primary transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Brand</label>
                            <input type="text" name="brand" value={formData.brand} onChange={handleChange} required className="form-input" placeholder="e.g. Hyundai" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Model</label>
                            <input type="text" name="model" value={formData.model} onChange={handleChange} required className="form-input" placeholder="e.g. Creta" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Year</label>
                            <input type="number" name="year" value={formData.year} onChange={handleChange} required className="form-input" min="2000" max={new Date().getFullYear()} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Expected Price (₹)</label>
                            <input type="number" name="price" value={formData.price} onChange={handleChange} required className="form-input" placeholder="e.g. 850000" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Kms Driven</label>
                            <input type="number" name="kms" value={formData.kms} onChange={handleChange} required className="form-input" placeholder="e.g. 45000" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Location</label>
                            <input type="text" name="location" value={formData.location} onChange={handleChange} required className="form-input" placeholder="e.g. Mumbai" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Fuel Type</label>
                            <select name="fuel" value={formData.fuel} onChange={handleChange} className="form-input">
                                <option value="Petrol">Petrol</option>
                                <option value="Diesel">Diesel</option>
                                <option value="CNG">CNG</option>
                                <option value="Electric">Electric</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Transmission</label>
                            <select name="transmission" value={formData.transmission} onChange={handleChange} className="form-input">
                                <option value="Manual">Manual</option>
                                <option value="Automatic">Automatic</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">Upload Image</label>
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-white/10 border-dashed rounded-xl cursor-pointer bg-primary hover:bg-white/5 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-8 h-8 mb-4 text-text-secondary" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                    </svg>
                                    <p className="text-sm text-text-secondary"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                </div>
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                            </label>
                        </div>
                        {previewUrl && (
                            <div className="mt-4">
                                <img src={previewUrl} alt="Preview" className="h-40 w-full object-cover rounded-xl" />
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end pt-4 border-t border-white/5">
                        <button type="button" onClick={onClose} className="mr-3 px-6 py-2 rounded-xl text-text-secondary hover:bg-white/5 font-medium transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="bg-accent text-primary font-bold py-2 px-6 rounded-xl hover:bg-yellow-500 hover:shadow-glow transition-all disabled:opacity-50">
                            {initialData ? 'Save Changes' : 'Post Listing'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddListingModal;
