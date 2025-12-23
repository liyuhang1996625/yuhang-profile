
export interface ContentBlock {
  type: 'text' | 'image';
  value: string;
  value_zh?: string;
}

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
  role?: string;
  role_zh?: string;
  client?: string;
  stack?: string[];
  // 混合图文内容块取代原有的单一描述和画廊
  contentBlocks?: ContentBlock[];
  // 保留旧字段用于兼容性
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
  resumeUrl: string;
}

export type Language = 'en' | 'zh';
export type Theme = 'light' | 'dark';
