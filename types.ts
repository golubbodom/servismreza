
export type Category = {
  id: string;
  name: string;
  icon: string;
  description: string;
  query: string;
};
export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}
