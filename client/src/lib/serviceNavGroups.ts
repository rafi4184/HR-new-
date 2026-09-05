import { PlaneTakeoff, CarFront, Globe2, GraduationCap, Mic, Landmark, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavGroupItem {
  key: "airport" | "hotel" | "studyWorkGulf" | "coursesCareers" | "mediaPublicSpeaking" | "government" | "manpower";
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
      { key: "studyWorkGulf", path: "/study-work-gulf", icon: Globe2 },
      { key: "coursesCareers", path: "/courses-careers", icon: GraduationCap },
    ],
  },
  {
    key: "media",
    items: [{ key: "mediaPublicSpeaking", path: "/media-public-speaking", icon: Mic }],
  },
  {
    key: "government",
    items: [
      { key: "government", path: "/government-request", icon: Landmark },
      { key: "manpower", path: "/manpower-security", icon: ShieldCheck },
    ],
  },
];
