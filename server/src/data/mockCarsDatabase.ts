export interface MockNewCar {
    makeModel: string;
    variant: string;
    price: string;
    rawPrice: number;
    mileage: string;
    reasons: string[];
    link: string;
    topFeatures: string[];
    fuelType: string;
    bodyType: string;
    transmission: string;
    brand: string;
    image: string;
}

export interface MockUsedCar {
    makeModel: string;
    variant: string;
    price: string;
    rawPrice: number;
    platform: string;
    year: number;
    kmsDriven: string;
    rawKms: number;
    link: string;
    fuelType: string;
    transmission: string;
    brand: string;
    ownerCount: string;
    location: string;
    image: string;
}

export const newCarsDb: MockNewCar[] = [
    {
        makeModel: "Tata Nexon", variant: "Creative Plus S", price: "₹13.50 Lakh", rawPrice: 1350000, mileage: "17.01 kmpl",
        reasons: ["Excellent safety rating and robust build quality.", "Great balance of performance and fuel efficiency."],
        link: "https://cars.tatamotors.com/suv/nexon", topFeatures: ["Sunroof", "10.25-inch Infotainment", "Ventilated Seats"],
        fuelType: "Petrol", bodyType: "SUV", transmission: "Manual", brand: "Tata",
        image: "https://s7ap1.scene7.com/is/image/tatamotors/GrasslandBeige-0-2?$PO-750-500-S$&fit=crop&fmt=avif-alpha"
    },
    {
        makeModel: "Maruti Suzuki Brezza", variant: "ZXi+", price: "₹12.80 Lakh", rawPrice: 1280000, mileage: "19.8 kmpl",
        reasons: ["Highly reliable with low maintenance costs.", "Proven track record in the Indian market."],
        link: "https://www.marutisuzuki.com/brezza", topFeatures: ["HUD", "360 View Camera", "Smart Hybrid"],
        fuelType: "Petrol", bodyType: "SUV", transmission: "Automatic", brand: "Maruti Suzuki",
        image: "https://stimg.cardekho.com/images/carexteriorimages/630x420/Maruti/Brezza/10388/1774618174088/front-left-side-47.jpg?tr=w-664"
    },
    {
        makeModel: "Hyundai Creta", variant: "SX (O)", price: "₹17.50 Lakh", rawPrice: 1750000, mileage: "18.5 kmpl",
        reasons: ["Extremely feature-rich with a premium cabin.", "Refined diesel engine perfect for long highway runs."],
        link: "https://www.hyundai.com/in/en/find-a-car/creta", topFeatures: ["Panoramic Sunroof", "Bose Audio", "ADAS Level 2"],
        fuelType: "Diesel", bodyType: "SUV", transmission: "Automatic", brand: "Hyundai",
        image: "https://stimg.cardekho.com/images/carexteriorimages/630x420/Hyundai/Creta-N-Line/11593/1768815786514/front-left-side-47.jpg?tr=w-664"
    },
    {
        makeModel: "Honda City", variant: "ZX e:HEV", price: "₹19.20 Lakh", rawPrice: 1920000, mileage: "27.13 kmpl",
        reasons: ["Phenomenal fuel efficiency with hybrid technology.", "Incredible rear seat comfort and classic sedan stance."],
        link: "https://www.hondacarindia.com/honda-city-e-hev", topFeatures: ["Hybrid Powertrain", "Honda Sensing ADAS", "LaneWatch Camera"],
        fuelType: "Hybrid", bodyType: "Sedan", transmission: "Automatic", brand: "Honda",
        image: "https://stimg.cardekho.com/images/carexteriorimages/630x420/Honda/City/12093/1755764990493/front-left-side-47.jpg?tr=w-664"
    },
    {
        makeModel: "Mahindra Thar", variant: "LX 4-Str Hard Top", price: "₹16.50 Lakh", rawPrice: 1650000, mileage: "15.2 kmpl",
        reasons: ["Unbeatable off-road capability and road presence.", "Iconic design that turns heads everywhere."],
        link: "https://auto.mahindra.com/suv/thar", topFeatures: ["4x4 Drivetrain", "Convertible Top", "Washable Interior"],
        fuelType: "Diesel", bodyType: "SUV", transmission: "Manual", brand: "Mahindra",
        image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800"
    },
    {
        makeModel: "Tata Tiago EV", variant: "XZ Plus Tech LUX", price: "₹11.50 Lakh", rawPrice: 1150000, mileage: "315 km/charge",
        reasons: ["The most accessible electric car from a trusted brand.", "Perfect for daily city commutes with zero tailpipe emissions."],
        link: "https://ev.tatamotors.com/tiago/ev", topFeatures: ["DC Fast Charging", "ZConnect App", "Multi-Mode Regen"],
        fuelType: "Electric", bodyType: "Hatchback", transmission: "Automatic", brand: "Tata",
        image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=800"
    },
    {
        makeModel: "Volkswagen Virtus", variant: "GT Plus 1.5 TSI", price: "₹18.80 Lakh", rawPrice: 1880000, mileage: "18.67 kmpl",
        reasons: ["Enthusiast's choice with a powerful 1.5L turbocharged engine.", "German build quality and exceptional driving dynamics."],
        link: "https://www.volkswagen.co.in/en/models/virtus.html", topFeatures: ["1.5L TSI Engine", "Active Cylinder Technology", "Ventilated Seats"],
        fuelType: "Petrol", bodyType: "Sedan", transmission: "Automatic", brand: "Volkswagen",
        image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800"
    }
];

export const usedCarsDb: MockUsedCar[] = [
    {
        makeModel: "2022 Kia Seltos GTX Plus", variant: "1.4 Turbo", price: "₹15.80 Lakh", rawPrice: 1580000,
        platform: "Spinny", year: 2022, kmsDriven: "22,000 km", rawKms: 22000, link: "https://www.spinny.com",
        fuelType: "Petrol", transmission: "Automatic", brand: "Kia", ownerCount: "First Owner", location: "MH02",
        image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800"
    },
    {
        makeModel: "2021 Hyundai Creta SX(O)", variant: "1.5 Diesel", price: "₹14.90 Lakh", rawPrice: 1490000,
        platform: "Cars24", year: 2021, kmsDriven: "35,000 km", rawKms: 35000, link: "https://www.cars24.com",
        fuelType: "Diesel", transmission: "Automatic", brand: "Hyundai", ownerCount: "First Owner", location: "DL01",
        image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800"
    },
    {
        makeModel: "2020 Tata Nexon XZ+", variant: "1.2 Turbo", price: "₹8.50 Lakh", rawPrice: 850000,
        platform: "OLX Autos", year: 2020, kmsDriven: "42,000 km", rawKms: 42000, link: "https://www.olx.in/cars",
        fuelType: "Petrol", transmission: "Manual", brand: "Tata", ownerCount: "Second Owner", location: "KA03",
        image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=800"
    },
    {
        makeModel: "2019 Honda City VX", variant: "1.5 i-VTEC", price: "₹9.20 Lakh", rawPrice: 920000,
        platform: "Spinny", year: 2019, kmsDriven: "55,000 km", rawKms: 55000, link: "https://www.spinny.com",
        fuelType: "Petrol", transmission: "Manual", brand: "Honda", ownerCount: "First Owner", location: "MH02",
        image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800"
    },
    {
        makeModel: "2021 MG Hector Plus", variant: "Sharp 2.0 Turbo", price: "₹16.00 Lakh", rawPrice: 1600000,
        platform: "Cars24", year: 2021, kmsDriven: "28,500 km", rawKms: 28500, link: "https://www.cars24.com",
        fuelType: "Petrol", transmission: "Automatic", brand: "MG", ownerCount: "First Owner", location: "DL01",
        image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800"
    }
];
