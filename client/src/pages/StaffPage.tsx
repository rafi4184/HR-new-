import { useSeo } from "../lib/useSeo";
import StaffDashboard from "../components/StaffDashboard";

export default function StaffPage({ onToast }: { onToast: (msg: string) => void }) {
  useSeo({
    title: "Staff Dashboard | ARK Property Solution",
    description: "Staff sign-in and enquiry management for ARK Property Solution.",
    path: "/staff",
    noindex: true,
  });

  return (
    <div className="bg-paper-soft min-h-[60vh]">
      <StaffDashboard onToast={onToast} />
    </div>
  );
}
