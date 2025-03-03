export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  nic: string; // National Identity Card
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  occupation?: string;
  workLocation?: string;
  education?: string;
  contact?: string;
}

export interface Child extends Person {
  school?: string;
  grade?: string;
}

export interface OtherMember extends Person {
  relationship?: string;
}

export interface Family {
  id: string;
  homeId: string;
  address: string;
  headOfFamily: Person;
  spouse?: Person;
  children: Child[];
  otherMembers?: OtherMember[];
  income?: string;
  landOwnership?: 'owned' | 'rented' | 'other';
  createdAt: Date;
  updatedAt: Date;
  homeHistory?: HomeHistory[];
  paymentHistory?: PaymentRecord[];
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  isAdmin?: boolean;
}

export interface AidEvent {
  id: string;
  name: string;
  description?: string;
  date: Date;
  type: 'distribution' | 'collection' | string;
  status: 'planned' | 'ongoing' | 'completed';
  items?: {
    name: string;
    quantity?: number;
    unit?: string;
  }[];
  targetAmount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Distribution {
  id: string;
  eventId: string;
  familyId: string;
  status: 'pending' | 'distributed' | 'skipped';
  items?: {
    name: string;
    quantity: number;
    unit?: string;
  }[];
  notes?: string;
  distributedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface MonthlyContribution {
  id: string;
  eventId: string;
  familyId: string;
  amount: number;
  status: 'pending' | 'paid' | 'excused';
  paidAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'general' | 'event' | 'prayer' | 'eid' | 'ramadan' | 'other';
  imageUrl?: string;
  visibleFrom: Date;
  visibleUntil: Date;
  priority: 'high' | 'medium' | 'low';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  linkUrl?: string;
  linkText?: string;
}

export interface HomeHistory {
  address: string;
  landOwnership: 'owned' | 'rented' | 'other';
  fromDate: Date;
  toDate?: Date;
}

export interface PaymentRecord {
  eventId: string;
  eventName: string;
  amount?: number;
  status: 'paid' | 'distributed' | 'skipped' | 'excused';
  date: Date;
  type: 'distribution' | 'collection';
}
