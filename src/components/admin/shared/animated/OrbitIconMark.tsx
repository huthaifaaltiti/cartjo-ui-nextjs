import { LucideIcon } from "lucide-react";

interface OrbitIconMarkProps {
  icon: LucideIcon;
}

const OrbitIconMark = ({ icon: Icon }: OrbitIconMarkProps) => (
  <div className="relative w-24 h-24 sm:w-28 sm:h-28 mb-3 shrink-0">
    {/* Pulse rings */}
    <div className="creator-pulse-a absolute inset-0 rounded-full border border-purple-400/30" />
    <div className="creator-pulse-b absolute inset-0 rounded-full border border-pink-400/20" />

    {/* Outer ring */}
    <div className="creator-ring-outer absolute inset-0 rounded-full border border-dashed border-purple-400/35 flex items-start justify-center">
      <div className="w-2 h-2 rounded-full bg-purple-600 -mt-1 shadow-xs" />
    </div>

    {/* Inner ring */}
    <div className="creator-ring-inner absolute inset-3 rounded-full border border-dashed border-blue-400/35 flex items-end justify-center">
      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 -mb-0.5 shadow-xs" />
    </div>

    {/* Center icon mark */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white border border-purple-100 shadow-md flex items-center justify-center text-purple-600">
        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>
    </div>
  </div>
);

export default OrbitIconMark;
