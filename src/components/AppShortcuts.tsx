import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/card';

const apps = [
  { id: 'netflix', name: 'Netflix', color: '#E50914', icon: '▶' },
  { id: 'youtube', name: 'YouTube', color: '#FF0000', icon: '▶' },
  { id: 'prime', name: 'Prime Video', color: '#00A8E1', icon: '▶' },
  { id: 'disney', name: 'Disney+', color: '#113CCF', icon: '▶' },
  { id: 'hbo', name: 'HBO Max', color: '#B026FF', icon: '▶' },
  { id: 'spotify', name: 'Spotify', color: '#1DB954', icon: '♫' },
  { id: 'globoplay', name: 'Globoplay', color: '#FF6600', icon: '▶' },
  { id: 'appletv', name: 'Apple TV', color: '#000000', icon: '▶' },
];

const AppShortcuts = () => {
  const { sendCommand } = useApp();

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <h2 className="text-2xl font-bold text-foreground mb-4">Atalhos de Apps</h2>
      <div className="grid grid-cols-4 gap-4">
        {apps.map((app, index) => (
          <button
            key={app.id}
            onClick={() => sendCommand(`launch_${app.id}`)}
            className="app-shortcut animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl text-white shadow-soft"
              style={{ backgroundColor: app.color }}
            >
              {app.icon}
            </div>
            <span className="text-xs font-medium text-foreground text-center leading-tight">
              {app.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AppShortcuts;
