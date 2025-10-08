export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  position?: string;
  temperature: LeadTemperature;
  source: LeadSource;
  status: LeadStatus;
  assignedTo?: string;
  notes?: string;
  tags?: string[];
  score?: number;
  createdAt: string;
  updatedAt: string;
  convertedAt?: string;
}

export type LeadTemperature = 'hot' | 'warm' | 'cold';

export type LeadSource = 
  | 'evento' 
  | 'referido' 
  | 'redes_sociales' 
  | 'linkedin' 
  | 'web' 
  | 'email' 
  | 'llamada'
  | 'otro';

export type LeadStatus = 
  | 'nuevo' 
  | 'contactado' 
  | 'calificando' 
  | 'calificado' 
  | 'convertido' 
  | 'descartado';

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  type: CampaignType;
  status: CampaignStatus;
  budget?: number;
  startDate: string;
  endDate?: string;
  targetAudience?: string;
  leadsGenerated: number;
  conversions: number;
  conversionRate: number;
  createdAt: string;
}

export type CampaignType = 
  | 'email' 
  | 'social_media' 
  | 'event' 
  | 'webinar' 
  | 'content' 
  | 'ppc';

export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed' | 'archived';

export interface CreateLeadDTO {
  name: string;
  email: string;
  phone: string;
  company?: string;
  position?: string;
  temperature: LeadTemperature;
  source: LeadSource;
  notes?: string;
  tags?: string[];
}

export interface UpdateLeadDTO {
  name?: string;
  phone?: string;
  temperature?: LeadTemperature;
  status?: LeadStatus;
  notes?: string;
  assignedTo?: string;
}

export interface LeadFilter {
  search?: string;
  temperature?: LeadTemperature;
  source?: LeadSource;
  status?: LeadStatus;
  assignedTo?: string;
  dateFrom?: string;
  dateTo?: string;
}