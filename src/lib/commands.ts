import { CVData } from '@/types/cv';
import { cvService } from './cv-service';

export interface CommandOutput {
  content: string;
  type: 'success' | 'error' | 'info';
}

export class CommandHandler {
  private cvData: CVData | null = null;

  constructor() {
    this.loadCVData();
  }

  private async loadCVData() {
    try {
      this.cvData = await cvService.getCVData();
    } catch (error) {
      console.error('Failed to load CV data:', error);
    }
  }

  async executeCommand(input: string): Promise<CommandOutput> {
    const args = input.trim().split(' ');
    const command = args[0].toLowerCase();
    const params = args.slice(1);

    if (!this.cvData) {
      try {
        this.cvData = await cvService.getCVData();
      } catch (error) {
        return {
          content: 'Error: Unable to load CV data. Please check your connection.',
          type: 'error'
        };
      }
    }

    switch (command) {
      case 'help':
        return this.getHelp();
      case 'info':
        return this.getBasicInfo();
      case 'work':
      case 'experience':
        return this.getWorkExperience();
      case 'education':
        return this.getEducation();
      case 'skills':
        return this.getSkills();
      case 'projects':
        return this.getProjects();
      case 'languages':
        return this.getLanguages();
      case 'interests':
        return this.getInterests();
      case 'contact':
        return this.getContactInfo();
      case 'cache':
        return this.getCacheInfo();
      case 'clear':
        return this.clear();
      case 'whoami':
        return this.whoami();
      default:
        return {
          content: `Command not found: ${command}. Type 'help' for available commands.`,
          type: 'error'
        };
    }
  }

  private getHelp(): CommandOutput {
    const helpText = `┌──────────────────────── AVAILABLE COMMANDS ────────────────────────────┐
│                                                                         │
│  💼  info         Display basic personal information                     │
│  🏢  work         Show work experience and career history               │
│  🎓  education    Display educational background                        │
│  🛠   skills       List technical skills and proficiencies              │
│  🚀  projects     Show project portfolio and achievements               │
│  🌐  languages    List language proficiencies                          │
│  🎯  interests    Display personal interests and hobbies               │
│  📧  contact      Show contact information and social links            │
│  💾  cache        Display cache status and data freshness              │
│  🧹  clear        Clear the terminal screen                            │
│  👤  whoami       Display current user information                     │
│  ❓  help         Show this help message                               │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

Usage: Type any command and press Enter to explore the CV!
Tip: Commands are case-insensitive and tab completion is supported.`;
    
    return {
      content: helpText,
      type: 'info'
    };
  }

  private getBasicInfo(): CommandOutput {
    if (!this.cvData) return { content: 'CV data not available', type: 'error' };
    
    const { basics } = this.cvData;
    const info = `┌─────────────────────── PERSONAL INFORMATION ───────────────────────────┐
│                                                                         │
│  👤  Name:        ${basics.name.padEnd(52)} │
│  💼  Title:       ${basics.label.padEnd(52)} │
│  📍  Location:    ${(basics.location.city + ', ' + basics.location.region + ', ' + basics.location.countryCode).padEnd(52)} │
│  📧  Email:       ${basics.email.padEnd(52)} │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

📋 PROFESSIONAL SUMMARY
${basics.summary}`;

    return { content: info, type: 'success' };
  }

  private getWorkExperience(): CommandOutput {
    if (!this.cvData) return { content: 'CV data not available', type: 'error' };
    
    let output = `┌───────────────────────── WORK EXPERIENCE ──────────────────────────────┐
│                                                                         │`;
    
    this.cvData.work.forEach((job, index) => {
      const endDate = job.endDate || 'Present';
      output += `\n│  🏢  ${job.position.padEnd(58)} │`;
      output += `\n│      ${job.company.padEnd(58)} │`;
      output += `\n│      📅 ${(job.startDate + ' - ' + endDate).padEnd(54)} │`;
      output += `\n│                                                                         │`;
      
      if (job.highlights && job.highlights.length > 0) {
        output += `\n│      Key Achievements:                                                  │`;
        job.highlights.forEach(highlight => {
          // Split long highlights into multiple lines if needed
          const maxLength = 58;
          if (highlight.length <= maxLength) {
            output += `\n│      • ${highlight.padEnd(maxLength - 2)} │`;
          } else {
            const words = highlight.split(' ');
            let line = '';
            words.forEach(word => {
              if ((line + ' ' + word).length <= maxLength - 2) {
                line += (line ? ' ' : '') + word;
              } else {
                if (line) {
                  output += `\n│      • ${line.padEnd(maxLength - 2)} │`;
                }
                line = word;
              }
            });
            if (line) {
              output += `\n│      • ${line.padEnd(maxLength - 2)} │`;
            }
          }
        });
        output += `\n│                                                                         │`;
      }
    });

    output += `\n└─────────────────────────────────────────────────────────────────────────┘`;

    return { content: output, type: 'success' };
  }

  private getEducation(): CommandOutput {
    if (!this.cvData) return { content: 'CV data not available', type: 'error' };
    
    let output = 'Education:\n\n';
    
    this.cvData.education.forEach(edu => {
      output += `${edu.studyType} in ${edu.area}\n`;
      output += `${edu.institution}\n`;
      output += `${edu.startDate} - ${edu.endDate}\n`;
      
      if (edu.courses && edu.courses.length > 0) {
        output += '\nCourses:\n';
        edu.courses.forEach(course => {
          output += `• ${course}\n`;
        });
      }
      output += '\n';
    });

    return { content: output.trim(), type: 'success' };
  }

  private getSkills(): CommandOutput {
    if (!this.cvData) return { content: 'CV data not available', type: 'error' };
    
    let output = 'Technical Skills:\n\n';
    
    this.cvData.skills.forEach(skillGroup => {
      output += `${skillGroup.name} (${skillGroup.level}):\n`;
      output += `${skillGroup.keywords.join(', ')}\n\n`;
    });

    return { content: output.trim(), type: 'success' };
  }

  private getProjects(): CommandOutput {
    if (!this.cvData) return { content: 'CV data not available', type: 'error' };
    
    let output = 'Projects:\n\n';
    
    this.cvData.projects.forEach(project => {
      output += `${project.name}\n`;
      output += `${project.description}\n`;
      
      if (project.url) {
        output += `URL: ${project.url}\n`;
      }
      
      if (project.highlights && project.highlights.length > 0) {
        output += '\nHighlights:\n';
        project.highlights.forEach(highlight => {
          output += `• ${highlight}\n`;
        });
      }
      
      if (project.keywords && project.keywords.length > 0) {
        output += `\nTechnologies: ${project.keywords.join(', ')}\n`;
      }
      
      output += '\n';
    });

    return { content: output.trim(), type: 'success' };
  }

  private getLanguages(): CommandOutput {
    if (!this.cvData) return { content: 'CV data not available', type: 'error' };
    
    let output = 'Languages:\n\n';
    
    this.cvData.languages.forEach(lang => {
      output += `${lang.language}: ${lang.fluency}\n`;
    });

    return { content: output.trim(), type: 'success' };
  }

  private getInterests(): CommandOutput {
    if (!this.cvData) return { content: 'CV data not available', type: 'error' };
    
    let output = 'Personal Interests:\n\n';
    
    this.cvData.interests.forEach(interest => {
      output += `${interest.name}\n`;
      if (interest.keywords && interest.keywords.length > 0) {
        output += `${interest.keywords.join(', ')}\n`;
      }
      output += '\n';
    });

    return { content: output.trim(), type: 'success' };
  }

  private getContactInfo(): CommandOutput {
    if (!this.cvData) return { content: 'CV data not available', type: 'error' };
    
    const { basics } = this.cvData;
    let output = 'Contact Information:\n\n';
    
    output += `Email: ${basics.email}\n`;
    output += `Location: ${basics.location.city}, ${basics.location.region}\n\n`;
    
    if (basics.profiles && basics.profiles.length > 0) {
      output += 'Social Profiles:\n';
      basics.profiles.forEach(profile => {
        output += `${profile.network}: ${profile.url}\n`;
      });
    }

    return { content: output.trim(), type: 'success' };
  }

  private getCacheInfo(): CommandOutput {
    const cacheStatus = cvService.getCacheStatus();
    
    let output = 'Cache Status:\n\n';
    
    if (cacheStatus.cached) {
      const ageMinutes = Math.floor(cacheStatus.age! / 60000);
      const ttlMinutes = Math.floor(cacheStatus.ttl / 60000);
      output += `Status: Cached\n`;
      output += `Age: ${ageMinutes} minutes\n`;
      output += `TTL: ${ttlMinutes} minutes\n`;
      output += `Expires in: ${ttlMinutes - ageMinutes} minutes`;
    } else {
      output += `Status: No cache\n`;
      output += `TTL: ${Math.floor(cacheStatus.ttl / 60000)} minutes`;
    }

    return { content: output, type: 'info' };
  }

  private clear(): CommandOutput {
    return { content: 'CLEAR_TERMINAL', type: 'info' };
  }

  private whoami(): CommandOutput {
    if (!this.cvData) return { content: 'CV data not available', type: 'error' };
    
    return { 
      content: `${this.cvData.basics.name} (${this.cvData.basics.label})`, 
      type: 'success' 
    };
  }
}

export const commandHandler = new CommandHandler();