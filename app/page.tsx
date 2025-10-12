"use client";

import React, { useState, useMemo, useRef, useEffect } from 'react';

// --- 1. TYPE DEFINITIONS & THEME UTILITY ---

type Theme = 'light' | 'dark';

// Updated themes for a more dynamic, anime.js friendly aesthetic (vibrant colors, subtle glow/shadows)
const getThemeClasses = (theme: Theme) => {
  if (theme === 'dark') {
    return {
      // Dynamic Dark Mode: Deep base with NEON TEAL accent
      appBg: 'bg-black', // PURE BLACK
      cardBg: 'bg-gray-900', // Darker card surface for contrast against black
      primaryText: 'text-white',
      secondaryText: 'text-gray-400',
      // High-Contrast Neon Teal for dynamic accents
      accentColor: 'text-teal-400',
      accentBg: 'bg-teal-600',
      accentBgActive: 'bg-teal-600/30',
      accentBorder: 'border-teal-500',
      
      // FIX: Dedicated hover classes for dynamic application
      hoverTextColor: 'hover:text-teal-300', 
      hoverBgSecondary: 'hover:bg-gray-800',
      
      // Glowing shadow hover effect
      cardShadowHover: 'hover:shadow-lg hover:shadow-teal-500/50',
      divider: 'border-gray-700',
    } as const;
  } else {
    return {
      // Dynamic Light Mode: Clean base with VIBRANT BLUE accent
      appBg: 'bg-white', // Clean white background
      cardBg: 'bg-gray-50', // Very light card surface
      primaryText: 'text-gray-900',
      secondaryText: 'text-gray-600',
      // Vibrant Indigo/Blue for dynamic accents
      accentColor: 'text-indigo-600',
      accentBg: 'bg-indigo-600',
      accentBgActive: 'bg-indigo-600/30',
      accentBorder: 'border-indigo-500',

      // FIX: Dedicated hover classes for dynamic application
      hoverTextColor: 'hover:text-indigo-700',
      hoverBgSecondary: 'hover:bg-gray-100',
      
      // Soft shadow hover effect
      cardShadowHover: 'hover:shadow-xl hover:shadow-indigo-300/50',
      divider: 'border-gray-200',
    } as const;
  }
};


// --- 2. DATA STRUCTURE (Typed) ---

// UPDATED: Added github to Contact
interface Contact { phone: string; email: string; location: string; github: string; }
interface Profile { name: string; title: string; objective: string; contact: Contact; }
interface EducationItem { qualification: string; institution: string; year: string; }
interface ExperienceItem { title: string; company: string; duration: string; details: string; icon: string; }
interface ProjectItem { name: string; tech: string; description: string; icon: string; }
interface Skills { languages: string[]; frameworks: string[]; tools: string[]; core: string[]; }
interface UserData { profile: Profile; skills: Skills; projects: ProjectItem[]; education: EducationItem[]; experience: ExperienceItem[]; interests: string[]; }
type PageId = 'home' | 'skills' | 'projects' | 'edu_exp' | 'interests';

const userData: UserData = {
  profile: {
    name: "Keval Doshi",
    title: "Aspiring Software Developer & System Designer",
    objective: "To leverage a strong foundation in computer science and problem-solving to design, build, and optimize innovative software solutions. I aim to contribute to forward-thinking organizations where I can apply my technical expertise, creativity, and passion for continuous learning to solve real-world challenges, while also developing into a well-rounded professional in the fields of software development, systems design, and emerging technologies.",
    contact: {
      phone: "(788) 755-4305", // Formatted phone number
      email: "kevaldoshi34223@gmail.com",
      location: "Pune, India",
      github: "https://github.com/kdoshi13", // ADDED GITHUB LINK
    },
  },
  skills: {
    languages: ["Java", "MySQL", "Javascript", "HTML/CSS", "Python"],
    frameworks: ["Spring (Basics)", "JSP", "Node.JS", "Flask", "Tkinter"], // Added Flask/Tkinter from projects
    tools: ["Git/ Github", "MS Office", "Bash", "Figma", "Godot Engine"], // Added Godot Engine from projects
    core: ["DBMS", "Cybersecurity Concepts", "Networking"],
  },
  projects: [
    { name: "Adventure of Kaya", tech: "Godot Engine, GDscript", description: "A Top Down RPG Game developed using the Godot Engine, demonstrating proficiency in game development concepts, state management, and scripting languages.", icon: "Gamepad2", },
    { name: "HealthCare Management System", tech: "Python, Flask, Web App", description: "A Flask-based web application providing patients and doctors with insight regarding appointments, required medicine, tests, and results, focusing on full-stack development and secure data management.", icon: "HeartPulse", },
    { name: "Sales Management System", tech: "Python Tkinter", description: "A Python Tkinter based desktop application providing small business owners with insights into sales, stock, billing, and customer accounts, showcasing desktop application development and business logic.", icon: "ShoppingBag", },
  ],
  education: [
    { qualification: "Master of Computer Application (MCA)", institution: "Modern College of Engineering, Savitribai Phule University", year: "2026 (Status: 7.0 SGPA)", },
    { qualification: "BBA (Computer Application)", institution: "MMCC, Savitribai Phule University", year: "2023 (8.89 CGPA)", },
  ],
  experience: [
    { title: "Technical Support (Part-Time)", company: "Media Urbana", duration: "Ongoing", details: "Providing technical support for commercial projects, gaining hands-on experience in production environments, troubleshooting hardware, and ensuring system stability.", icon: "Wrench", },
    { title: "Legal Assistant (Full-Time)", company: "Attaching Firm", duration: "6 months", details: "Gained hands-on experience in a professional work environment, developing strong organizational, communication, and procedural skills essential for cross-functional collaboration.", icon: "Briefcase", },
  ],
  interests: [
    "Passionate Gamer (Metroidvania/Soulslike analysis and design)",
    "Active learning and project building in Computer Science",
    "Collaborative spirit in team coding projects and peer learning sessions",
    "Traveling, Coding, Music, and Reading Books",
  ],
};

// --- 3. ICON & GENERIC COMPONENTS ---

// UPDATED: Added 'Github' icon name
type IconName = 'Home' | 'Code' | 'Layers' | 'GraduationCap' | 'Heart' | 'User' | 'Gamepad2' | 'HeartPulse' | 'ShoppingBag' | 'Wrench' | 'Briefcase' | 'Mail' | 'Phone' | 'MapPin' | 'Menu' | 'X' | 'CheckCircle' | 'Sun' | 'Moon' | 'Github';

interface IconProps { name: IconName; className?: string; }

// Simple Icon component using Lucide-like SVG paths
const Icon: React.FC<IconProps> = ({ name, className = 'w-5 h-5' }) => {
  const icons: Record<IconName, React.ReactNode> = {
    Home: (<><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>),
    Code: (<><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></>),
    Layers: (<><path d="m12 19-9-7 9-7 9 7-9 7z"/><path d="M21 12v7M3 12v7"/><path d="M12 21v-2"/></>),
    GraduationCap: (<><path d="M21.41 12.78V22h-6.28l-8.49-8.49L3 17.5V7.5L12 3l9 4.5z"/><path d="M16 16v6"/><path d="M18 16h-4"/><path d="M21 7.5l-9 4.5L3 7.5"/></>),
    Heart: (<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2C10.5 3.5 9 3 7.5 3A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>),
    User: (<><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>),
    Gamepad2: (<><path d="M6 14h2"/><path d="M14 14h2"/><path d="M10 10v2"/><path d="M10 12v2"/><rect width="20" height="12" x="2" y="6" rx="6"/><circle cx="16" cy="12" r="1"/><circle cx="8" cy="12" r="1"/><path d="M16 14v-2"/><path d="M8 10v2"/></>),
    HeartPulse: (<><path d="M22 6c0-2.2-1.8-4-4-4H6C3.8 2 2 3.8 2 6v12c0 2.2 1.8 4 4 4h12c2.2 0 4-1.8 4-4V6z"/><path d="M9 12h-1c-0.6 0-1 0.4-1 1s0.4 1 1 1h1"/><path d="M15 12h-1c-0.6 0-1 0.4-1 1s0.4 1 1 1h1"/><path d="M12 12v2"/></>),
    ShoppingBag: (<><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" x2="21" y1="6" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></>),
    Wrench: (<><path d="M14.7 10.7 17.5 8a2.41 2.41 0 0 0-3.41-3.41l-2.85 2.85"/><path d="M6.3 18.7 8 16"/><path d="m14.7 10.7 2.85 2.85"/><path d="M16 16 14.7 14.7"/><path d="M21.2 15.3 19.4 17l-1.4-1.4 1.8-1.8a2.41 2.41 0 0 1 3.4 3.4z"/></>),
    Briefcase: (<><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/></>),
    Mail: (<><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></>),
    Phone: (<path d="M22 16.92v3.06a2 2 0 0 1-2.2 1.96 18.9 18.9 0 0 1-8.52-2.34 18.9 18.9 0 0 1-8.52-8.52 2 2 0 0 1 1.96-2.2h3.06a2 2 0 0 1 2 .85L9.5 7.5a1 1 0 0 0 .34 1.14l1.83 1.83a1 1 0 0 0 1.14.34l2.84-1.12a2 2 0 0 1 .85 2z"/>),
    MapPin: (<><path d="M12 21.7c-3.7-3.7-6.3-7.5-6.3-10.7C5.7 6 8.5 3 12 3s6.3 3 6.3 8c0 3.2-2.6 7-6.3 10.7z"/><circle cx="12" cy="11.5" r="3"/></>),
    Menu: (<path d="M3 6h18M3 12h18M3 18h18"/>),
    X: (<><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>),
    CheckCircle: (<><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4 12 14.01l-3-3"/></>),
    Sun: (<><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></>),
    Moon: (<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>),
    // NEW: GitHub Icon
    Github: (<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.75c3.25 0 6.8-.75 6.8-7.5a5.5 5.5 0 0 0-1.5-3.75 5.5 5.5 0 0 0 .1-3.75s-1.5-.5-5.3 1.5a18.4 18.4 0 0 0-6.6 0c-3.8-2-5.3-1.5-5.3-1.5a5.5 5.5 0 0 0 .1 3.75A5.5 5.5 0 0 0 4 11.5c0 6.75 3.55 7.5 6.8 7.5A4.8 4.8 0 0 0 10 18v4"/>),
  };

  const svg = icons[name] || icons.User;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {svg}
    </svg>
  );
};

// Global anime type for TypeScript safety, assuming it's loaded via script tag
declare global { interface Window { anime?: any; }}

// --- Card Component ---
interface CardProps {
  children: React.ReactNode;
  className?: string;
  themeClasses: ReturnType<typeof getThemeClasses>;
  // Optional flag to control animation on pages other than Home
  noAnimation?: boolean; 
}

const Card: React.FC<CardProps> = ({ children, className = '', themeClasses, noAnimation = false }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. If noAnimation is true, we skip the effect.
    if (noAnimation) {
        if (cardRef.current) {
            // Ensure static content is always visible
            cardRef.current.style.opacity = '1';
            cardRef.current.style.transform = 'none';
        }
        return;
    }

    if (cardRef.current) {
      const animeLib = (typeof window !== 'undefined' && (window as any).anime) ? (window as any).anime : undefined;

      if (animeLib) {
        // 2. SUCCESS: anime.js is available. Run the smooth entrance animation.
        animeLib({
          targets: cardRef.current,
          opacity: [0, 1],
          translateY: [20, 0], // Starts 20px below its final position
          scale: [0.98, 1],
          duration: 800,
          easing: 'easeOutQuad',
          delay: 0, 
        });
      } else {
        // 3. FALLBACK: anime.js is missing. Ensure visibility immediately.
        requestAnimationFrame(() => {
          if (cardRef.current) {
            cardRef.current.style.opacity = '1';
            cardRef.current.style.transform = 'none'; // Clear any potential transform effect
          }
        });
      }
    }
  }, [noAnimation]);

  // Initial opacity class: if noAnimation is false, start at opacity-0 and let JS/anime fix it.
  const initialOpacityClass = noAnimation ? 'opacity-100' : 'opacity-0';

  return (
    // Uses theme-specific background, shadow, and hover effect
    <div 
      ref={cardRef}
      className={`
        ${themeClasses.cardBg} p-6 rounded-2xl transition-all duration-500 shadow-xl 
        ${themeClasses.cardShadowHover} 
        ${className}
        ${initialOpacityClass}
      `}
    >
      {children}
    </div>
  );
};

interface SectionTitleProps {
  iconName: IconName;
  title: string;
  themeClasses: ReturnType<typeof getThemeClasses>;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ iconName, title, themeClasses }) => (
  // Uses theme-specific text color and a sharper, thicker accent border
  <h2 className={`text-4xl font-extrabold ${themeClasses.primaryText} mb-6 border-b-4 ${themeClasses.accentBorder} pb-3 flex items-center`}>
    <Icon name={iconName} className={`w-8 h-8 mr-4 ${themeClasses.accentColor} flex-shrink-0`} />
    {title}
  </h2>
);

// --- 4. PAGE COMPONENTS (Refactored to use Theme Classes) ---

const HomePage: React.FC<{ profile: Profile, themeClasses: ReturnType<typeof getThemeClasses> }> = ({ profile, themeClasses }) => (
  <div className="space-y-12 pt-10">
    {/* Header Card now links to GitHub and has a slight shadow for interactive feel */}
    <Card themeClasses={themeClasses} noAnimation={true} className={`${themeClasses.appBg} border ${themeClasses.accentBorder}/30 p-8 text-center cursor-pointer hover:shadow-2xl hover:scale-[1.005] transition-all duration-300`}>
      <a href={profile.contact.github} target="_blank" rel="noopener noreferrer" className="block p-4 -m-4">
        <h1 className={`text-6xl sm:text-7xl font-black tracking-tight ${themeClasses.primaryText} mb-3 leading-tight`}>
          {profile.name}
        </h1>
        <p className={`text-2xl font-light ${themeClasses.accentColor}`}>{profile.title}</p>
      </a>
    </Card>

    <Card themeClasses={themeClasses}>
      <SectionTitle iconName="User" title="Professional Summary" themeClasses={themeClasses} />
      <p className={`${themeClasses.secondaryText} leading-relaxed italic border-l-4 ${themeClasses.accentBorder} pl-4 py-1 text-lg`}>
        "{profile.objective}"
      </p>
    </Card>

    <Card themeClasses={themeClasses}>
      <SectionTitle iconName="Mail" title="Contact Details" themeClasses={themeClasses} />
      {/* Grid layout changed to 2x2 responsive layout */}
      <div className={`grid sm:grid-cols-2 lg:grid-cols-4 gap-6 ${themeClasses.secondaryText}`}>
        <div className="flex flex-col space-y-1">
          <Icon name="Mail" className={`${themeClasses.accentColor} w-5 h-5`} />
          <span className="text-sm">Email</span>
          <a href={`mailto:${profile.contact.email}`} className={`font-semibold ${themeClasses.primaryText} ${themeClasses.hoverTextColor} transition truncate`}>
            {profile.contact.email}
          </a>
        </div>
        
        {/* GitHub Link Block */}
        <div className="flex flex-col space-y-1">
          <Icon name="Github" className={`${themeClasses.accentColor} w-5 h-5`} />
          <span className="text-sm">GitHub</span>
          <a href={profile.contact.github} target="_blank" rel="noopener noreferrer" className={`font-semibold ${themeClasses.primaryText} ${themeClasses.hoverTextColor} transition truncate`}>
            @{new URL(profile.contact.github).pathname.replace('/', '')}
          </a>
        </div>
      </div>
    </Card>
  </div>
);

// --- New Skill Icon Map for visual enhancement ---
const skillIconMap: Record<string, string> = {
  // Languages
  "Java": "☕",
  "MySQL": "💾",
  "Javascript": "💻",
  "HTML/CSS": "🌐",
  "Python": "🐍",
  // Frameworks
  "Spring (Basics)": "🌱",
  "JSP": "📄",
  "Node.JS": "🟢",
  "Flask": "⚗️", // Flask icon
  "Tkinter": "🖼️", // GUI icon
  // Tools
  "Git/ Github": "🐙",
  "MS Office": "📊",
  "Bash": "🐚",
  "Figma": "🎨",
  "Godot Engine": "🎮", // Game engine icon
  // Core
  "DBMS": "🗄️",
  "Cybersecurity Concepts": "🛡️",
  "Networking": "🔗",
};

const SkillCategory: React.FC<{ title: string, items: string[], themeClasses: ReturnType<typeof getThemeClasses> }> = ({ title, items, themeClasses }) => (
  <Card themeClasses={themeClasses} className='h-full'>
    <h3 className={`text-xl font-bold ${themeClasses.primaryText} border-b ${themeClasses.divider} pb-3 mb-4`}>{title}</h3>
    {/* Adjusted to a grid for more spacious, icon-based display */}
    <div className="grid grid-cols-1 gap-3">
      {items.map((item, index) => (
        <div 
          key={index} 
          className={`
            flex items-center space-x-4 p-3 rounded-xl cursor-default
            ${themeClasses.accentBgActive} 
            font-medium transition duration-300 hover:scale-[1.02] hover:shadow-lg
          `}
        >
          {/* Icon/Emoji */}
          <span className="text-2xl flex-shrink-0">{skillIconMap[item] || "⚙️"}</span>
          {/* Skill Name */}
          <span className={`${themeClasses.primaryText} text-lg`}>
            {item}
          </span>
        </div>
      ))}
    </div>
  </Card>
);

const SkillsPage: React.FC<{ skills: Skills, themeClasses: ReturnType<typeof getThemeClasses> }> = ({ skills, themeClasses }) => (
  <div className="space-y-10 pt-4">
    <SectionTitle iconName="Code" title="Technical Skills" themeClasses={themeClasses} />
    {/* Main skill grid maintains original layout */}
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <SkillCategory title="Languages" items={skills.languages} themeClasses={themeClasses} />
      <SkillCategory title="Frameworks" items={skills.frameworks} themeClasses={themeClasses} />
      <SkillCategory title="Tools" items={skills.tools} themeClasses={themeClasses} />
      <SkillCategory title="Core Knowledge" items={skills.core} themeClasses={themeClasses} />
    </div>
  </div>
);


const ProjectsPage: React.FC<{ projects: ProjectItem[], themeClasses: ReturnType<typeof getThemeClasses> }> = ({ projects, themeClasses }) => (
  <div className="space-y-10 pt-4">
    <SectionTitle iconName="Layers" title="Key Projects" themeClasses={themeClasses} />
    <div className="grid md:grid-cols-2 gap-8">
      {projects.map((project, index) => (
        <Card key={index} themeClasses={themeClasses} className="space-y-3 flex flex-col">
          <div className={`flex items-center space-x-3 pb-2 border-b ${themeClasses.divider}`}>
            <Icon name={project.icon as IconName} className={`w-7 h-7 ${themeClasses.accentColor} flex-shrink-0`} />
            <h3 className={`text-2xl font-bold ${themeClasses.primaryText} leading-tight`}>{project.name}</h3>
          </div>
          <p className={`text-sm font-medium ${themeClasses.secondaryText} italic mt-2`}>{project.tech}</p>
          <p className={`${themeClasses.secondaryText} flex-grow`}>{project.description}</p>
        </Card>
      ))}
    </div>
  </div>
);

interface ExpEduProps { education: EducationItem[]; experience: ExperienceItem[]; themeClasses: ReturnType<typeof getThemeClasses>; }

const ExperienceEducationPage: React.FC<ExpEduProps> = ({ education, experience, themeClasses }) => (
  <div className="grid lg:grid-cols-2 gap-10 pt-4">
    <div>
      <SectionTitle iconName="GraduationCap" title="Academic Qualification" themeClasses={themeClasses} />
      <div className="space-y-6">
        {education.map((item, index) => (
          <Card key={index} themeClasses={themeClasses} className={`border-l-4 ${themeClasses.accentBorder}/80`}>
            <p className={`text-xl font-bold ${themeClasses.primaryText}`}>{item.qualification}</p>
            <p className={`${themeClasses.accentColor} font-medium`}>{item.institution}</p>
            <p className={`${themeClasses.secondaryText} text-sm mt-1`}>Year: {item.year}</p>
          </Card>
        ))}
      </div>
    </div>

    <div>
      <SectionTitle iconName="Briefcase" title="Professional Experience" themeClasses={themeClasses} />
      <div className="space-y-6">
        {experience.map((item, index) => (
          <Card key={index} themeClasses={themeClasses} className={`border-l-4 ${themeClasses.accentBorder}/80`}>
            <div className="flex items-start space-x-3">
              <Icon name={item.icon as IconName} className={`w-5 h-5 ${themeClasses.accentColor} mt-1 flex-shrink-0`} />
              <p className={`text-xl font-bold ${themeClasses.primaryText} leading-tight`}>{item.title}</p>
            </div>
            <p className={`${themeClasses.secondaryText} font-medium ml-8`}>{item.company}</p>
            <p className={`text-sm italic ${themeClasses.secondaryText} ml-8`}>{item.duration}</p>
            <p className={`${themeClasses.secondaryText} mt-3 border-t ${themeClasses.divider} pt-3`}>{item.details}</p>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

const InterestsProfilePage: React.FC<{ interests: string[], themeClasses: ReturnType<typeof getThemeClasses> }> = ({ interests, themeClasses }) => (
  <div className="space-y-10 pt-4">
    <SectionTitle iconName="Heart" title="Interests & Personal Details" themeClasses={themeClasses} />
    <div className='grid lg:grid-cols-2 gap-6'>
      <Card themeClasses={themeClasses}>
        <h3 className={`text-2xl font-bold ${themeClasses.accentColor} mb-4`}>Extra-Curricular Activities</h3>
        <ul className={`space-y-3 ${themeClasses.secondaryText}`}>
          {interests.map((item, index) => (
            <li key={index} className="flex items-start">
              <Icon name="CheckCircle" className={`w-5 h-5 mr-3 mt-1 ${themeClasses.accentColor} flex-shrink-0`} />
              {item}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  </div>
);


// --- 5. NAVIGATION & MAIN APP ---

interface ThemeToggleProps {
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
  themeClasses: ReturnType<typeof getThemeClasses>;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, setTheme, themeClasses }) => (
  <button
    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    className={`p-2 rounded-full transition duration-300 ml-4 border ${themeClasses.divider}
      ${theme === 'dark' ? 'text-teal-400 hover:bg-gray-700' : 'text-indigo-600 hover:bg-gray-200'}
    `}
    aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
  >
    <Icon name={theme === 'dark' ? 'Sun' : 'Moon'} className="w-6 h-6" />
  </button>
);


interface NavBarProps {
  currentPage: PageId;
  setCurrentPage: React.Dispatch<React.SetStateAction<PageId>>;
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
  themeClasses: ReturnType<typeof getThemeClasses>;
}

const NavBar: React.FC<NavBarProps> = ({ currentPage, setCurrentPage, theme, setTheme, themeClasses }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems: { id: PageId, label: string, icon: IconName }[] = [
    { id: 'home', label: 'Summary', icon: 'User' },
    { id: 'skills', label: 'Skills', icon: 'Code' },
    { id: 'projects', label: 'Projects', icon: 'Layers' },
    { id: 'edu_exp', label: 'Timeline', icon: 'GraduationCap' },
    { id: 'interests', label: 'Personal', icon: 'Heart' },
  ];

  const handleNavigation = (id: PageId) => {
    setCurrentPage(id);
    setIsMenuOpen(false); // Close menu on navigation
  };

  return (
    <nav className={`${themeClasses.cardBg} border-b ${themeClasses.accentBorder}/50 sticky top-0 z-20 shadow-xl transition-colors duration-500`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className={`text-3xl font-light ${themeClasses.accentColor}`}>K</span>
            <span className={`text-3xl font-black ${themeClasses.primaryText}`}>doshi13</span>
          </div>
          <div className="flex flex-row items-center">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium transition duration-200 ease-in-out
                    ${currentPage === item.id
                      ? `${themeClasses.accentBg} ${themeClasses.primaryText} shadow-md`
                      : `${themeClasses.secondaryText} ${themeClasses.hoverBgSecondary} ${themeClasses.hoverTextColor} border border-transparent`
                    }
                    flex items-center
                  `}
                  aria-current={currentPage === item.id ? 'page' : undefined}
                >
                  <Icon name={item.icon} className="w-4 h-4 mr-2" />
                  {item.label}
                </button>
              ))}
            </div>

            {/* Theme Toggle & Mobile Menu Button */}
            <ThemeToggle theme={theme} setTheme={setTheme} themeClasses={themeClasses} />

            <button
              className={`md:hidden p-2 rounded-lg ${themeClasses.secondaryText} hover:${themeClasses.primaryText} hover:bg-opacity-20 ml-2 focus:outline-none focus:ring-2 focus:ring-inset ${themeClasses.accentBorder} transition`}
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
            >
              <Icon name="Menu" className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-out Menu (Sidebar) */}
      <div
        className={`fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ pointerEvents: isMenuOpen ? 'auto' : 'none' }}
      >
        {/* Background Overlay */}
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${isMenuOpen ? 'opacity-50' : 'opacity-0'}`}
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />

        {/* Menu Content (Sidebar Card) */}
        {/* Note: noAnimation=true for the sidebar to ensure it loads instantly */}
        <Card themeClasses={themeClasses} noAnimation={true} className={`absolute top-0 right-0 h-full w-64 ${themeClasses.cardBg} shadow-2xl rounded-l-2xl p-6 flex flex-col space-y-4 border-l ${themeClasses.accentBorder}/50`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-xl font-bold ${themeClasses.accentColor}`}>Sections</h3>
            <button
              onClick={() => setIsMenuOpen(false)}
              className={`p-2 rounded-full ${themeClasses.secondaryText} hover:${themeClasses.primaryText} hover:bg-opacity-20 transition`}
              aria-label="Close menu"
            >
              <Icon name="X" className="w-6 h-6" />
            </button>
          </div>

          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              className={`
                w-full text-left px-4 py-3 rounded-xl text-lg font-medium transition duration-150 ease-in-out
                ${currentPage === item.id
                  ? `${themeClasses.accentBg} ${themeClasses.primaryText} shadow-md`
                  : `${themeClasses.primaryText} ${themeClasses.hoverBgSecondary} ${themeClasses.hoverTextColor}`
                }
                flex items-center
              `}
            >
              {/* Ensure icon color adapts */}
              <Icon name={item.icon} className={`w-5 h-5 mr-3 ${currentPage === item.id ? themeClasses.primaryText : themeClasses.accentColor}`} />
              {item.label}
            </button>
          ))}
        </Card>
      </div>
    </nav>
  );
};


// --- Main App Component ---
export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  // Initialize to 'dark' for the new dynamic theme
  const [theme, setTheme] = useState<Theme>('dark'); 
  const themeClasses = useMemo(() => getThemeClasses(theme), [theme]);

  // Load anime.js dynamically on client side and only once
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ((window as any).anime) return; // already loaded

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // keep script (don't aggressively remove) — cleanup only if you appended and it still exists
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, []);

  // Function to render the current page based on state
  const renderPage = useMemo(() => {
    // We force re-render/re-mount of children when page changes to re-trigger animation
    const pageKey = `${currentPage}-${theme}`; 
    
    // pageProps only contains non-key props
    const pageProps = { themeClasses }; 

    switch (currentPage) {
      case 'home':
        // Key passed directly, following React's best practices
        return <HomePage key={pageKey} profile={userData.profile} {...pageProps} />;
      case 'skills':
        // Key passed directly, following React's best practices
        return <SkillsPage key={pageKey} skills={userData.skills} {...pageProps} />;
      case 'projects':
        // Key passed directly, following React's best practices
        return <ProjectsPage key={pageKey} projects={userData.projects} {...pageProps} />;
      case 'edu_exp':
        // Key passed directly, following React's best practices
        return <ExperienceEducationPage key={pageKey} education={userData.education} experience={userData.experience} {...pageProps} />;
      case 'interests':
        // Key passed directly, following React's best practices
        return <InterestsProfilePage key={pageKey} interests={userData.interests} {...pageProps} />;
      default:
        // Key passed directly, following React's best practices
        return <HomePage key={pageKey} profile={userData.profile} {...pageProps} />;
    }
  }, [currentPage, themeClasses, theme]);

  return (
    <div className={`min-h-screen ${themeClasses.appBg} font-sans antialiased ${themeClasses.primaryText} transition-colors duration-500`}>
      {/* Keep font link — placing it here is fine for client-rendered component */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" />

      {/* Navigation Bar */}
      <NavBar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        theme={theme} 
        setTheme={setTheme} 
        themeClasses={themeClasses} 
      />

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {renderPage}
      </main>

      {/* Footer */}
      <footer className={`w-full text-center py-6 mt-12 border-t ${themeClasses.divider} ${themeClasses.secondaryText} text-sm transition-colors duration-500`}>
        &copy; {new Date().getFullYear()} Keval Doshi Portfolio. Designed with React, Tailwind CSS, and Anime.js.
      </footer>
    </div>
  );
}
