declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      NODE_ENV: 'development' | 'production';
      DB_URL: string;
      DB_NAME: string;
      WEATHER_COLLECTION_NAME: string;
      JWT_ACCESS_SECRET: string;
      JWT_REFRESH_SECRET: string;
      SMTP_HOST: string;
      SMTP_PORT: number;
      SMTP_USER: string;
      SMTP_PASSWORD: string;
      API_URL: string;
      CLIENT_URL: string;
      VISUAL_CROSSING_KEY: string;
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
    }
  }
}

export {}
