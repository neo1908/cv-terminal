export interface CVData {
  basics: {
    name: string;
    label: string;
    email: string;
    summary: string;
    location: {
      city: string;
      countryCode: string;
      region: string;
    };
    profiles: Array<{
      network: string;
      username: string;
      url: string;
    }>;
  };
  work: Array<{
    name: string; // This is the company name in the JSON
    position: string;
    startDate: string;
    endDate?: string;
    summary?: string;
    highlights?: string[];
    location?: string;
    description?: string;
    url?: string;
  }>;
  education: Array<{
    institution: string;
    area: string;
    studyType: string;
    startDate: string;
    endDate: string;
    url?: string;
    courses?: string[];
  }>;
  skills: Array<{
    name: string;
    level: string;
    keywords: string[];
  }>;
  languages: Array<{
    language: string;
    fluency: string;
  }>;
  interests: Array<{
    name: string;
    summary?: string;
    keywords: string[];
  }>;
  projects: Array<{
    name: string;
    description: string;
    highlights?: string[];
    keywords?: string[];
    startDate?: string;
    url?: string;
    urls?: string[];
    roles?: string[];
    type?: string;
  }>;
  meta: {
    version: string;
    theme: string;
  };
}