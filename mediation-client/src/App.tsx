import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import MediationPillars from "./components/MediationPillars";
import ProcessTimeline from "./components/ProcessTimeline";
import { useSmoothScroll } from "./lib/smooth-scroll";

export default function App() {
  useSmoothScroll();

  const scrollToProcess = () => {
    document.getElementById("process")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-obsidian-950">
      <Navbar onBook={scrollToProcess} />
      <HeroSection onBook={scrollToProcess} onExplore={scrollToProcess} />
      <MediationPillars />
      <ProcessTimeline />
    </div>
  );
}
