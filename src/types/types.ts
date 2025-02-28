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
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  isAdmin?: boolean;
}
