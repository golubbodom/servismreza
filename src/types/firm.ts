export type Firm = {
  id: string;
  name: string;
  city: string;
  municipality?: string | null;
  phone: string;
  email?: string | null;
  
  sourceApplicationId?: string | null;

  distanceKm: number;
  services: string[];

  category?: string;
  address?: string;
  lat?: number | null;
  lng?: number | null;
  description?: string;
  workingHours?: string;
  images?: string[];
  googleRating?: number;    
  googleReviews?: number;   
  googleMapsUrl?: string;
};

