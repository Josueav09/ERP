// src/config.ts
export const API_CONFIG = {
  baseURL: 'http://localhost:3001',
  timeout: 30000,
};

export const MICROSERVICES = {
  product: 'http://localhost:8001/api/product',
  marketing: 'http://localhost:8002/api/marketing',
  sales: 'http://localhost:8003/api/sales',
  reporting: 'http://localhost:8004/api/reporting',
  personal: 'http://localhost:8005/api/personal',
  learning: 'http://localhost:8006/api/learning',
  users: 'http://localhost:8007/api/users',
};

export const SECURITY = {
  sessionTimeout: 600000,
  maxLoginAttempts: 7,
  maxIPAttempts: 5,
};

export const FEATURE_FLAGS = {
  enable2FA: true,
  enableCaptcha: true,
  enableAnalytics: true,
};
