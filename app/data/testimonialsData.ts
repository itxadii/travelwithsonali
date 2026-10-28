export interface Testimonial {
  id: string;
  name: string;
  location: string;
  /** Photo URL; empty for reviews submitted on the site, which show an initial instead */
  avatar: string;
  trip: string;
  rating: number;
  date: string;
  quote: string;
  featured?: boolean;
}
