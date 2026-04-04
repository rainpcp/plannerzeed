export interface Task {
  id: string;
  title: string;
  description?: string;
  category: string;
  priority: "high" | "medium" | "low";
  date?: string;
  time?: string;
  endTime?: string;
  completed: boolean;
  icon?: string;
  color?: string;
}

export interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  period: "morning" | "afternoon" | "evening";
  completed: boolean;
  color: string;
}

export interface CalendarEvent {
  id: string;
  day: number;
  title: string;
  color: string;
  isCurrentMonth: boolean;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  color: string;
  updatedAt: string;
  isFavorite: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  plan: string;
  avatar: string;
}

export interface Settings {
  pushNotifications: boolean;
  doNotDisturb: boolean;
  theme: "light" | "dark";
  accentColor: string;
  cloudSync: boolean;
}
