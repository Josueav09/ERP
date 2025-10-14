// src/config.ts
export const API_CONFIG = {
  baseURL: 'http://localhost:3000',
  timeout: 30000,
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
