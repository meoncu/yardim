export type Status = 'active' | 'passive' | 'archived';

export interface Admin {
  uid: string;
  email: string;
  role: 'superadmin' | 'editor';
  createdAt: number;
  isActive: boolean;
}

export interface Association {
  id: string;
  name: string;
  logoUrl: string;
  address: string;
  phone: string;
  website?: string;
  createdAt: number;
  updatedAt: number;
}

export interface ContactInfo {
  fullName: string;
  email: string;
  whatsappPhone: string;
}

export interface Announcement {
  id: string;
  associationId: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  images: string[];
  videos: string[];
  contactInfo?: ContactInfo;
  status: Status;
  featured: boolean;
  randomWeight: number;
  createdAt: number;
  updatedAt: number;
}
