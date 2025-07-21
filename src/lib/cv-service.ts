import { CVData } from '@/types/cv';

interface CacheEntry {
  data: CVData;
  timestamp: number;
}

class CVService {
  private cache: CacheEntry | null = null;
  private readonly CV_URL = 'https://st2projects.com/cv/cv.json';
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

  private ttl: number;

  constructor(ttl: number = 5 * 60 * 1000) {
    this.ttl = ttl;
  }

  private isExpired(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp > this.ttl;
  }

  async getCVData(): Promise<CVData> {
    if (this.cache && !this.isExpired(this.cache)) {
      return this.cache.data;
    }

    try {
      const response = await fetch(this.CV_URL);
      if (!response.ok) {
        throw new Error(`Failed to fetch CV data: ${response.status}`);
      }
      
      const data: CVData = await response.json();
      
      this.cache = {
        data,
        timestamp: Date.now()
      };
      
      return data;
    } catch (error) {
      if (this.cache) {
        console.warn('Using stale cache due to fetch error:', error);
        return this.cache.data;
      }
      throw error;
    }
  }

  setCacheTTL(ttl: number) {
    this.ttl = ttl;
  }

  clearCache() {
    this.cache = null;
  }

  getCacheStatus(): { cached: boolean; age?: number; ttl: number } {
    if (!this.cache) {
      return { cached: false, ttl: this.ttl };
    }
    
    const age = Date.now() - this.cache.timestamp;
    return { 
      cached: true, 
      age, 
      ttl: this.ttl 
    };
  }
}

export const cvService = new CVService();