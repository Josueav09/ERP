export interface Opportunity {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  company: string;
  contactPerson: string;
  value: number;
  currency: string;
  stage: OpportunityStage;
  probability: number;
  expectedCloseDate: string;
  actualCloseDate?: string;
  source?: string;
  description?: string;
  nextAction?: string;
  assignedTo: string;
  products?: OpportunityProduct[];
  interactions?: Interaction[];
  status: 'open' | 'won' | 'lost' | 'on_hold';
  lostReason?: string;
  createdAt: string;
  updatedAt: string;
}

export type OpportunityStage = 
  | 'prospecting' 
  | 'qualification' 
  | 'proposal' 
  | 'negotiation' 
  | 'closing';

export interface OpportunityProduct {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  total: number;
}

export interface Interaction {
  id: string;
  type: InteractionType;
  date: string;
  subject: string;
  notes: string;
  duration?: number;
  outcome?: string;
  nextStep?: string;
  createdBy: string;
}

export type InteractionType = 
  | 'call' 
  | 'email' 
  | 'meeting' 
  | 'demo' 
  | 'proposal' 
  | 'negotiation' 
  | 'other';

export interface Quote {
  id: string;
  opportunityId: string;
  clientName: string;
  quoteNumber: string;
  version: number;
  status: QuoteStatus;
  validUntil: string;
  items: QuoteItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  terms?: string;
  notes?: string;
  pdfUrl?: string;
  createdAt: string;
  sentAt?: string;
  acceptedAt?: string;
}

export type QuoteStatus = 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired';

export interface QuoteItem {
  productId: string;
  productName: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

export interface CreateOpportunityDTO {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  company: string;
  contactPerson: string;
  value: number;
  stage: OpportunityStage;
  probability: number;
  expectedCloseDate: string;
  description?: string;
  source?: string;
}

export interface UpdateOpportunityDTO {
  stage?: OpportunityStage;
  probability?: number;
  value?: number;
  expectedCloseDate?: string;
  nextAction?: string;
  status?: 'open' | 'won' | 'lost' | 'on_hold';
  lostReason?: string;
}

export interface OpportunityFilter {
  search?: string;
  stage?: OpportunityStage;
  status?: string;
  assignedTo?: string;
  minValue?: number;
  maxValue?: number;
  dateFrom?: string;
  dateTo?: string;
}