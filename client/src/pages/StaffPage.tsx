import { useSeo } from "../lib/useSeo";
import StaffDashboard from "../components/StaffDashboard";

export default function StaffPage({ onToast }: { onToast: (msg: string) => void }) {
  useSeo({
    title: "Staff Dashboard | HR — The Mediator",
    description: "Staff sign-in and request management for HR — The Mediator.",
    path: "/staff",
    noindex: true,
  });

  return (
    <div className="bg-paper-soft min-h-[60vh]">
      <StaffDashboard onToast={onToast} />
    </div>
  );
}
