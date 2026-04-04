import type { UserProfile, Settings } from "./types";

export const defaultUserProfile: UserProfile = {
  name: "",
  email: "",
  plan: "Free Plan",
  avatar: "U",
};

export const defaultSettings: Settings = {
  pushNotifications: true,
  doNotDisturb: false,
  theme: "dark",
  accentColor: "#85adff",
  cloudSync: false,
};

export const categoryLabels: Record<string, string> = {
  work: "งาน",
  personal: "ส่วนตัว",
  learning: "เรียนรู้",
};

export const priorityLabels: Record<string, string> = {
  high: "ด่วนมาก",
  medium: "ปกติ",
  low: "ต่ำ",
};

export const categoryColors: Record<string, string> = {
  work: "primary",
  personal: "secondary",
  learning: "tertiary",
};
