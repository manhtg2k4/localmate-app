export interface GuideProfile {
  _id: string;
  userId: any;
  bio?: string;
  languages: string[];
  hourlyRate: number;
  dailyRate: number;
  ratingAvg: number;
  totalReviews: number;
  totalTours: number;
  areas: string[];
  yearsExperience: number;
  isApproved: boolean;
  galleryImages?: string[];
}

export interface Location {
  _id: string;
  name: string;
  description?: string;
  category: string;
  address?: string;
  city: string;
  district?: string;
  coordinates: { type: string; coordinates: number[] };
  ratingAvg: number;
  priceRange: string;
  images: string[];
  tags: string[];
}
