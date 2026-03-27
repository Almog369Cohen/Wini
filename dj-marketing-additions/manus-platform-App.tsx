import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ContentPlanner from "./pages/ContentPlanner";
import LeadsManager from "./pages/LeadsManager";
import CompetitorAnalysis from "./pages/CompetitorAnalysis";
import DocumentManager from "./pages/DocumentManager";
import InvoiceManager from "./pages/InvoiceManager";
import ContentBotTrainer from "./pages/ContentBotTrainer";
import CompetitorResearch from "./pages/CompetitorResearch";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/content-planner"} component={ContentPlanner} />
      <Route path={"/leads"} component={LeadsManager} />
      <Route path={"/competitors"} component={CompetitorAnalysis} />
      <Route path={"/documents"} component={DocumentManager} />
      <Route path={"/invoices"} component={InvoiceManager} />
      <Route path={"/bot-trainer"} component={ContentBotTrainer} />
      <Route path={"/competitor-research"} component={CompetitorResearch} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
