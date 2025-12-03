
export interface Project {
  id: string;
  title: string;
  title_zh: string;
  category: string;
  category_zh: string;
  description: string;
  description_zh: string;
  imageUrl: string;
  year: string;
  link?: string;
  // New fields for detail view
  role?: string;
  role_zh?: string;
  client?: string;
  stack?: string[];
  fullDescription?: string;
  fullDescription_zh?: string;
  gallery?: string[];
}

export interface NavItem {
  id: string;
  label: string;
  label_zh: string;
  href: string;
}

export interface ContactInfo {
  tagline: string;
  tagline_zh: string;
  email: string;
  resumeUrl: string; // Changed from social links to resume
}

export type Language = 'en' | 'zh';
export type Theme = 'light' | 'dark';