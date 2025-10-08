import { UserRole } from './auth';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  position: string;
  company: string;
  department?: string;
  ruc?: string;
  address?: string;
  linkedIn?: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'blocked';
  contractType?: string;
  contractStartDate?: string;
  contractEndDate?: string;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: UserRole;
  position: string;
  company: string;
  department?: string;
  linkedIn?: string;
  contractStartDate?: string;
}

export interface UpdateUserDTO {
  name?: string;
  phone?: string;
  position?: string;
  department?: string;
  linkedIn?: string;
  avatar?: string;
}

export interface UserListItem {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive' | 'blocked';
  lastLogin?: string;
}