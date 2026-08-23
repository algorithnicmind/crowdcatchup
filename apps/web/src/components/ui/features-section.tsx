import { cn } from "@/lib/utils";
import {
  Activity,
  Brain,
  Network,
  ShieldAlert,
  Route,
  Users,
  WifiOff,
  MonitorPlay,
} from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      title: "Real-time Crowd Analytics",
      description:
        "Monitor crowd density, flow rates, and directional trends instantly using live CCTV feeds and YOLOv8 computer vision.",
      icon: <Activity className="w-5 h-5 text-zinc-400" />,
    },
    {
      title: "Predictive Risk Engine",
      description:
        "Anticipate bottlenecks and potential crush risks before they escalate using our advanced XGBoost predictive models.",
      icon: <Brain className="w-5 h-5 text-zinc-400" />,
    },
    {
      title: "Multi-Source Integration",
      description:
        "Seamlessly combine optical CCTV, RFID Smart Gates, and live GPS telemetry for absolute situational awareness.",
      icon: <Network className="w-5 h-5 text-zinc-400" />,
    },
    {
      title: "Automated Response",
      description:
        "Instantly broadcast emergency alerts to field officers and automatically trigger dynamic crowd-control protocols.",
      icon: <ShieldAlert className="w-5 h-5 text-zinc-400" />,
    },
    {
      title: "Dynamic Safe Routing",
      description:
        "Guide citizens to safety with live turn-by-turn navigation on premium 3D maps, dynamically avoiding risk zones.",
      icon: <Route className="w-5 h-5 text-zinc-400" />,
    },
    {
      title: "Role-Based Portals",
      description:
        "Secure, dedicated dashboard experiences tailored for Authorities, Field Police, Event Owners, and Citizens.",
      icon: <Users className="w-5 h-5 text-zinc-400" />,
    },
    {
      title: "Offline-Ready Core",
      description:
        "Maintain critical operational capability and access local emergency protocols even during severe network outages.",
      icon: <WifiOff className="w-5 h-5 text-zinc-400" />,
    },
    {
      title: "Digital Twin Sandbox",
      description:
        "Test 'what-if' crowd scenarios and run sophisticated mock drills without disrupting real-world operations.",
      icon: <MonitorPlay className="w-5 h-5 text-zinc-400" />,
    },
  ];

  return (
    <div className="bg-[#050505] py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Next-Generation Security
          </h2>
          <p className="text-zinc-400 max-w-2xl text-lg">
            CrowdShield leverages military-grade architecture and cutting-edge AI to deliver unparalleled crowd management capabilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-l border-t border-zinc-800/50">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative border-r border-b border-zinc-800/50 p-8 transition-all duration-500 hover:bg-gradient-to-br hover:from-zinc-800/30 hover:to-transparent"
            >
              {/* Highlight bar on hover */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0 w-1 bg-cyan-500 transition-all duration-300 group-hover:h-12 opacity-0 group-hover:opacity-100 rounded-r-md shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
              
              <div className="mb-6">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
