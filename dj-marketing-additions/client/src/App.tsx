import { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import ContentBotTrainer from "./pages/ContentBotTrainer";
import CompetitorResearch from "./pages/CompetitorResearch";
import ContentPlanner from "./pages/ContentPlanner";
import LeadsManager from "./pages/LeadsManager";
import Analytics from "./pages/Analytics";

type Page = "dashboard" | "trainer" | "research" | "planner" | "leads" | "analytics";

const NAV_ITEMS: { page: Page; icon: string; label: string }[] = [
  { page: "dashboard", icon: "🏠", label: "ראשי" },
  { page: "trainer", icon: "✨", label: "תוכן" },
  { page: "planner", icon: "📅", label: "תכנון" },
  { page: "leads", icon: "👥", label: "לידים" },
  { page: "research", icon: "🔍", label: "מחקר" },
  { page: "analytics", icon: "📊", label: "ניתוח" },
];

export default function App() {
  const [page, setPage] = useState<Page>("dashboard");

  // Listen for navigation events from child components
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && NAV_ITEMS.some(n => n.page === detail)) {
        setPage(detail as Page);
      }
    };
    window.addEventListener("navigate", handler);
    return () => window.removeEventListener("navigate", handler);
  }, []);

  return (
    <div className="relative">
      {/* Page Content */}
      {page === "dashboard" && <Dashboard />}
      {page === "trainer" && <ContentBotTrainer />}
      {page === "research" && <CompetitorResearch />}
      {page === "planner" && <ContentPlanner />}
      {page === "leads" && <LeadsManager />}
      {page === "analytics" && <Analytics />}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
        <div className="flex justify-around items-center py-2 px-1 max-w-lg mx-auto">
          {NAV_ITEMS.map(item => (
            <button
              key={item.page}
              onClick={() => setPage(item.page)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors ${
                page === item.page
                  ? "text-[#059cc0]"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className={`text-[10px] font-medium ${page === item.page ? "text-[#059cc0]" : ""}`}>{item.label}</span>
              {page === item.page && <span className="w-1 h-1 rounded-full bg-[#059cc0]" />}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
