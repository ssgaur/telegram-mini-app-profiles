import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Profiles from "./pages/Profiles";
import Annotate from "./pages/Annotate";
import Future from "./pages/Future";
import { BottomNavigation } from "./components/BottomNavigation";
import { useEffect } from "react";


function Router() {
  const [location] = useLocation();
  // Show bottom nav on main routes, hide on 404 and other error pages
  const showBottomNav = location === "/" || location === "/annotate" || location === "/future";

  return (
    <>
      <Switch>
        <Route path={"/"} component={Profiles} />
        <Route path={"/annotate"} component={Annotate} />
        <Route path={"/future"} component={Future} />
        <Route path={"/404"} component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
      {showBottomNav && <BottomNavigation />}
    </>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  // Initialize Telegram WebApp script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-web-app.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
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
