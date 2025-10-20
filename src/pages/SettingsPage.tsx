import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Sun, Moon, Languages, Vibrate } from 'lucide-react';
import { toast } from 'sonner';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { settings, updateSettings } = useApp();

  const handleThemeToggle = () => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light';
    updateSettings({ theme: newTheme });
    toast.success(`Tema ${newTheme === 'dark' ? 'escuro' : 'claro'} ativado`);
  };

  const handleLanguageToggle = () => {
    const newLanguage = settings.language === 'pt' ? 'en' : 'pt';
    updateSettings({ language: newLanguage });
    toast.success(`Idioma alterado para ${newLanguage === 'pt' ? 'Português' : 'English'}`);
  };

  const handleVibrationToggle = () => {
    updateSettings({ vibrationEnabled: !settings.vibrationEnabled });
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  return (
    <div className="min-h-screen p-6 pb-24">
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
        </div>

        {/* Settings List */}
        <div className="space-y-3">
          {/* Theme */}
          <Card className="p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {settings.theme === 'light' ? (
                  <Sun className="w-5 h-5 text-foreground" />
                ) : (
                  <Moon className="w-5 h-5 text-foreground" />
                )}
                <div>
                  <h3 className="font-semibold text-foreground">Tema</h3>
                  <p className="text-sm text-muted-foreground">
                    {settings.theme === 'light' ? 'Claro' : 'Escuro'}
                  </p>
                </div>
              </div>
              <Switch checked={settings.theme === 'dark'} onCheckedChange={handleThemeToggle} />
            </div>
          </Card>

          {/* Language */}
          <Card className="p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Languages className="w-5 h-5 text-foreground" />
                <div>
                  <h3 className="font-semibold text-foreground">Idioma</h3>
                  <p className="text-sm text-muted-foreground">
                    {settings.language === 'pt' ? 'Português' : 'English'}
                  </p>
                </div>
              </div>
              <Switch checked={settings.language === 'en'} onCheckedChange={handleLanguageToggle} />
            </div>
          </Card>

          {/* Vibration */}
          <Card className="p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Vibrate className="w-5 h-5 text-foreground" />
                <div>
                  <h3 className="font-semibold text-foreground">Vibração</h3>
                  <p className="text-sm text-muted-foreground">
                    {settings.vibrationEnabled ? 'Ativada' : 'Desativada'}
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.vibrationEnabled}
                onCheckedChange={handleVibrationToggle}
              />
            </div>
          </Card>
        </div>

        {/* About Section */}
        <Card className="p-6 shadow-soft text-center">
          <h3 className="font-semibold text-foreground mb-2">Smart Remote TV Samsung</h3>
          <p className="text-sm text-muted-foreground">Versão 1.0.0</p>
          <p className="text-xs text-muted-foreground mt-4">
            Controle sua TV Samsung de forma moderna e intuitiva
          </p>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
