// Environment configuration
export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  },
};

// Helper function to get API URL
export const getApiUrl = (endpoint: string) => {
  return `${config.api.baseUrl}${endpoint}`;
};