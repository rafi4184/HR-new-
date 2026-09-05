import { PlaneTakeoff, CarFront, GraduationCap, Briefcase, Mic, Landmark, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavGroupItem {
  key: "airport" | "hotel" | "studyAbroad" | "jobsGulf" | "coursesCareers" | "mediaPublicSpeaking" | "government" | "manpower";
  path: string;
  icon: LucideIcon;
}

export interface NavGroup {
  key: "travel" | "study" | "media" | "government";
  items: NavGroupItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    key: "travel",
    items: [
      { key: "airport", path: "/airport-vip", icon: PlaneTakeoff },
      { key: "hotel", path: "/hotel-car", icon: CarFront },
    ],
  },
  {
    key: "study",
    items: [
      { key: "studyAbroad", path: "/study-work-gulf", icon: GraduationCap },
      { key: "jobsGulf", path: "/study-work-gulf", icon: Briefcase },
    ],
  },
  {
    key: "media",
    items: [
      { key: "mediaPublicSpeaking", path: "/media-public-speaking", icon: Mic },
      { key: "coursesCareers", path: "/courses-careers", icon: GraduationCap },
    ],
  },
  {
    key: "government",
    items: [
      { key: "government", path: "/government-request", icon: Landmark },
      { key: "manpower", path: "/manpower-security", icon: ShieldCheck },
    ],
  },
];
