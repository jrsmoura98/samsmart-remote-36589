import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Power,
  Volume2,
  VolumeX,
  Plus,
  Minus,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  Home,
  ArrowLeft,
  Menu,
  Settings,
  Tv2,
  Keyboard,
} from 'lucide-react';
import AppShortcuts from '@/components/AppShortcuts';
import VirtualKeyboard from '@/components/VirtualKeyboard';
import { toast } from 'sonner';

const Remote = () => {
  const navigate = useNavigate();
  const { connectedTV, sendCommand } = useApp();
  const [showKeyboard, setShowKeyboard] = useState(false);

  if (!connectedTV) {
    navigate('/devices');
    return null;
  }

  const handleCommand = (cmd: string) => {
    sendCommand(cmd);
    if (cmd === 'power') {
      toast.success('Comando de energia enviado');
    }
  };

  return (
    <div className="min-h-screen pb-24">
      <Tabs defaultValue="remote" className="w-full">
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">{connectedTV.name}</h2>
                <p className="text-sm text-muted-foreground">{connectedTV.model}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/settings')}
                className="rounded-full"
              >
                <Settings className="w-5 h-5" />
              </Button>
            </div>
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="remote">Controle</TabsTrigger>
              <TabsTrigger value="apps">Apps</TabsTrigger>
              <TabsTrigger value="devices">TVs</TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="remote" className="p-6 mt-0">
          <div className="max-w-md mx-auto space-y-6 animate-fade-in">
            {/* Power Button */}
            <Button
              onClick={() => handleCommand('power')}
              className="w-full h-16 remote-button-primary text-xl font-semibold"
            >
              <Power className="w-6 h-6 mr-2" />
              Power
            </Button>

            {/* Volume Controls */}
            <Card className="p-6 shadow-soft">
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={() => handleCommand('volume_down')}
                  className="remote-button-icon"
                >
                  <Minus className="w-6 h-6" />
                </button>
                <div className="flex-1 text-center">
                  <Volume2 className="w-8 h-8 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">Volume</p>
                </div>
                <button
                  onClick={() => handleCommand('volume_up')}
                  className="remote-button-icon"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </div>
              <button
                onClick={() => handleCommand('mute')}
                className="w-full mt-4 h-12 remote-button-secondary"
              >
                <VolumeX className="w-5 h-5 mr-2" />
                Mudo
              </button>
            </Card>

            {/* Channel Controls */}
            <Card className="p-6 shadow-soft">
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={() => handleCommand('channel_down')}
                  className="remote-button-icon"
                >
                  <ChevronDown className="w-6 h-6" />
                </button>
                <div className="flex-1 text-center">
                  <Tv2 className="w-8 h-8 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">Canal</p>
                </div>
                <button
                  onClick={() => handleCommand('channel_up')}
                  className="remote-button-icon"
                >
                  <ChevronUp className="w-6 h-6" />
                </button>
              </div>
            </Card>

            {/* D-Pad Navigation */}
            <Card className="p-8 shadow-soft">
              <div className="relative w-full aspect-square max-w-[280px] mx-auto">
                {/* Up */}
                <button
                  onClick={() => handleCommand('up')}
                  className="absolute top-0 left-1/2 -translate-x-1/2 remote-button-icon"
                >
                  <ChevronUp className="w-6 h-6" />
                </button>
                {/* Down */}
                <button
                  onClick={() => handleCommand('down')}
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 remote-button-icon"
                >
                  <ChevronDown className="w-6 h-6" />
                </button>
                {/* Left */}
                <button
                  onClick={() => handleCommand('left')}
                  className="absolute left-0 top-1/2 -translate-y-1/2 remote-button-icon"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                {/* Right */}
                <button
                  onClick={() => handleCommand('right')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 remote-button-icon"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                {/* OK/Enter */}
                <button
                  onClick={() => handleCommand('enter')}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 remote-button-primary rounded-full"
                >
                  <Circle className="w-8 h-8" fill="currentColor" />
                </button>
              </div>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-3">
              <button onClick={() => handleCommand('home')} className="remote-button-secondary h-16">
                <Home className="w-5 h-5 mb-1" />
                <span className="text-xs">Home</span>
              </button>
              <button onClick={() => handleCommand('back')} className="remote-button-secondary h-16">
                <ArrowLeft className="w-5 h-5 mb-1" />
                <span className="text-xs">Voltar</span>
              </button>
              <button onClick={() => handleCommand('menu')} className="remote-button-secondary h-16">
                <Menu className="w-5 h-5 mb-1" />
                <span className="text-xs">Menu</span>
              </button>
            </div>

            {/* Keyboard Toggle */}
            <Button
              onClick={() => setShowKeyboard(!showKeyboard)}
              variant="outline"
              className="w-full h-12 rounded-2xl"
            >
              <Keyboard className="w-5 h-5 mr-2" />
              {showKeyboard ? 'Ocultar' : 'Mostrar'} Teclado
            </Button>

            {showKeyboard && <VirtualKeyboard />}
          </div>
        </TabsContent>

        <TabsContent value="apps" className="p-6 mt-0">
          <AppShortcuts />
        </TabsContent>

        <TabsContent value="devices" className="p-6 mt-0">
          <div className="max-w-md mx-auto">
            <Button
              onClick={() => navigate('/devices')}
              className="w-full h-14 rounded-2xl bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
            >
              <Tv2 className="w-5 h-5 mr-2" />
              Gerenciar Dispositivos
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Remote;
