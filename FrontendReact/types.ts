export interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

export interface PricingPlan {
  id: number;
  name: string;
  price: string;
  features: string[];
  recommended?: boolean;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  text: string;
  image: string;
  rating?: number;
}
