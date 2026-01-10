import { Home, PenTool, Sparkles } from 'lucide-react';
import { useLocation } from 'wouter';

interface NavItem {
  path: string;
  icon: React.ReactNode;
  label: string;
}

const navItems: NavItem[] = [
  {
    path: '/',
    icon: <Home className="h-5 w-5" />,
    label: 'Home',
  },
  {
    path: '/annotate',
    icon: <PenTool className="h-5 w-5" />,
    label: 'Annotate',
  },
  {
    path: '/future',
    icon: <Sparkles className="h-5 w-5" />,
    label: 'Future',
  },
];

export function BottomNavigation() {
  const [location, setLocation] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/75">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const isActive = location === item.path;
            return (
              <button
                key={item.path}
                onClick={() => setLocation(item.path)}
                className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'text-primary scale-105'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                aria-label={item.label}
              >
                <div
                  className={`transition-transform duration-200 ${
                    isActive ? 'scale-110' : ''
                  }`}
                >
                  {item.icon}
                </div>
                <span
                  className={`text-xs font-medium transition-colors ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      {/* Safe area spacer for mobile devices with notches */}
      <div className="h-safe-area-inset-bottom" />
    </nav>
  );
}
