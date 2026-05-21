import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Activity, Dumbbell, Utensils, Camera, Crown } from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Postür (Premium)", path: "/posture", icon: Activity, premium: true },
    { name: "Kas Gelişimi", path: "/muscle", icon: Dumbbell },
    { name: "Beslenme", path: "/nutrition", icon: Utensils },
    { name: "Disiplin (Premium)", path: "/discipline", icon: Camera, premium: true },
  ];

  return (
    <div className="w-64 h-screen bg-impact-surface border-r border-zinc-800 flex flex-col p-4">
      <div className="flex items-center gap-2 mb-8 px-2">
        <Dumbbell className="text-impact-primary w-8 h-8" />
        <h1 className="text-2xl font-black text-white tracking-tight">
          IMPACT <span className="text-transparent bg-clip-text bg-gradient-to-r from-impact-primary to-impact-secondary">AI</span>
        </h1>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.name} to={item.path} className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all font-medium ${isActive ? "bg-impact-primary/10 text-impact-primary border border-impact-primary/20" : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"}`}>
              <item.icon className="w-5 h-5" />
              {item.name}
              {item.premium && <Crown className="w-4 h-4 ml-auto text-impact-accent" />}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
