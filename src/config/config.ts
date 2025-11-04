export const API_CONFIG = {
  baseURL: 'https://growvia-app-gateway.ashygrass-1b0d0ce7.eastus.azurecontainerapps.io',
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
