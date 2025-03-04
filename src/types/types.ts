import { Timestamp } from "firebase/firestore";

export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  nic: string; // National Identity Card
  dateOfBirth: string;
  gender: "male" | "female" | "other";
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
  landOwnership?: "owned" | "rented" | "other";
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
  type: "distribution" | "collection" | string;
  status: "planned" | "ongoing" | "completed";
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
  updatedAt: Date | { seconds: number; nanoseconds: number } | number;
  status: "pending" | "distributed" | "skipped" | "excused";
  timestamp: Date;
  distributedItems?: {
    itemName: string;
    quantity: number;
    unit?: string;
  }[];
  distributedAt?: Date | Timestamp;
}

export interface MonthlyContribution {
  id: string;
  eventId: string;
  familyId: string;
  amount: number;
  status: "pending" | "paid" | "excused";
  paidAt?: Date | Timestamp;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: "general" | "event" | "prayer" | "eid" | "ramadan" | "other";
  imageUrl?: string;
  visibleFrom: Date;
  visibleUntil: Date;
  priority: "high" | "medium" | "low";
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  linkUrl?: string;
  linkText?: string;
}

export interface HomeHistory {
  address: string;
  landOwnership: "owned" | "rented" | "other";
  fromDate: Date | Timestamp | any;
  toDate?: Date | any;
}

export interface PaymentRecord {
  eventId: string;
  eventName: string;
  amount?: number;
  status: "paid" | "distributed" | "skipped" | "excused";
  date: Date | Timestamp | any;
  type: "distribution" | "collection";
  items?: {
    name: string;
    itemName?: string;
    quantity: number;
    unit?: string;
  }[];
}
