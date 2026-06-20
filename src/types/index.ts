export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  language?: string;
  confidence?: number;
  intent?: string;
  cached?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AskResponse {
  query: string;
  answer: string;
  session_id: string;
  detected_language: string;
  confidence: number;
  intent: string;
  cached: boolean;
}

export interface AdviseResponse {
  session_id: string;
  answer: string;
  latitude?: number;
  longitude?: number;
  used_image: boolean;
  used_video: boolean;
  model_used: string;
}

export interface WeatherCurrent {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    localtime: string;
  };
  current: {
    temp_c: number;
    temp_f: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    humidity: number;
    wind_kph: number;
    wind_dir: string;
    precip_mm: number;
    uv: number;
    feelslike_c: number;
    air_quality?: {
      co: number;
      no2: number;
      o3: number;
      so2: number;
      pm2_5: number;
      pm10: number;
      'us-epa-index': number;
      'gb-defra-index': number;
    };
  };
}

export interface WeatherForecastDay {
  date: string;
  day: {
    maxtemp_c: number;
    maxtemp_f: number;
    mintemp_c: number;
    mintemp_f: number;
    avgtemp_c: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    avghumidity: number;
    totalprecip_mm: number;
    uv: number;
  };
  hour: Array<{
    time: string;
    temp_c: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    chance_of_rain: number;
    precip_mm: number;
  }>;
}

export interface WeatherForecast {
  location: WeatherCurrent['location'];
  current: WeatherCurrent['current'];
  forecast: {
    forecastday: WeatherForecastDay[];
  };
  alerts?: {
    alert: Array<{
      headline: string;
      msgtype: string;
      severity: string;
      urgency: string;
      areas: string;
      category: string;
      event: string;
      note: string;
      effective: string;
      expires: string;
      desc: string;
      instruction: string;
    }>;
  };
}

export interface WeatherAlert {
  headline: string;
  severity: string;
  urgency: string;
  areas: string;
  event: string;
  effective: string;
  expires: string;
  desc: string;
  instruction: string;
}

export interface UserSettings {
  language: string;
  location: string | null;
  lat: number | null;
  lon: number | null;
  farmSize: string;
  largeText: boolean;
  highContrast: boolean;
  voiceReadAloud: boolean;
  weatherAlerts: boolean;
  farmingTips: boolean;
  marketUpdates: boolean;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  subcategory: string;
  readTime: number;
  language: string;
  saved: boolean;
  image?: string;
}

export type SupportedLanguage = 'en' | 'ha' | 'ig' | 'yo' | 'pcm' | 'sw' | 'am';

export const LANGUAGE_MAP: Record<SupportedLanguage, { name: string; native: string; flag: string }> = {
  en: { name: 'English', native: 'English', flag: '🇬🇧' },
  ha: { name: 'Hausa', native: 'Hausa', flag: '🇳🇬' },
  ig: { name: 'Igbo', native: 'Igbo', flag: '🇳🇬' },
  yo: { name: 'Yoruba', native: 'Yorùbá', flag: '🇳🇬' },
  pcm: { name: 'Nigerian Pidgin', native: 'Pidgin', flag: '🇳🇬' },
  sw: { name: 'Swahili', native: 'Kiswahili', flag: '🇰🇪' },
  am: { name: 'Amharic', native: 'አማርኛ', flag: '🇪🇹' },
};

export const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT',
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi',
  'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo',
  'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
];
