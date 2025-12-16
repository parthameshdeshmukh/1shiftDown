// For New Car Search
export interface NewCarFormData {
  budget: number;
  brands: string[];
  model: string;
  fuelTypes: string[];
  transmission: string[];
  yearlyRunning: number;
  bodyTypes: string[];
  colors: string[];
  features: string[];
}

export interface NewCarRecommendation {
  makeModel: string;
  variant: string;
  price: string;
  mileage: string;
  reasons: string[];
  link: string;
  image: string;
  topFeatures: string[];
  matchScore: number;
  fuelType: string;
  bodyType: string;
}

// For Used Car Search
export interface UsedCarFormData {
  price: [number, number];
  brands: string[];
  model: string;
  year: [number, number];
  fuelTypes: string[];
  transmission: string[];
  kmsDriven: number;
  ownerCount: string[];
  location: string;
  registrationState: string;
  features: string[];
}

export interface UsedCarListing {
  makeModel: string;
  variant: string;
  price: string;
  platform: string;
  year: number;
  kmsDriven: string;
  matchScore: number; // A percentage from 0 to 100
  link: string;
  image: string;
  fuelType: string;
}

export interface Favorite {
  id: number;
  userId: string;
  carId: string;
  isNew: boolean;
  data: NewCarRecommendation | UsedCarListing;
  createdAt: string;
}