import React, { createContext, useContext, useState, useEffect } from 'react';
import { SamsungTVClient } from '@/lib/samsungTV';

interface TV {
  id: string;
  name: string;
  model: string;
  ip: string;
}

interface AppSettings {
  theme: 'light' | 'dark';
  language: 'pt' | 'en';
  vibrationEnabled: boolean;
}

interface AppContextType {
  connectedTV: TV | null;
  setConnectedTV: (tv: TV | null) => void;
  availableTVs: TV[];
  setAvailableTVs: (tvs: TV[]) => void;
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
  isScanning: boolean;
  setIsScanning: (scanning: boolean) => void;
  sendCommand: (command: string) => void;
  tvClient: SamsungTVClient | null;
  setTVClient: (client: SamsungTVClient | null) => void;
  connectToTV: (tv: TV) => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connectedTV, setConnectedTV] = useState<TV | null>(null);
  const [availableTVs, setAvailableTVs] = useState<TV[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [tvClient, setTVClient] = useState<SamsungTVClient | null>(null);
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'light',
    language: 'pt',
    vibrationEnabled: true,
  });

  // Aplicar tema ao documento
  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.theme === 'dark');
  }, [settings.theme]);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const connectToTV = async (tv: TV): Promise<boolean> => {
    try {
      // Get saved token if exists
      const savedToken = localStorage.getItem(`tv_token_${tv.ip}`);
      
      console.log(`🔌 Iniciando conexão com ${tv.name} (${tv.ip})...`);
      
      // Sempre tentar porta 8002 (wss://) primeiro em HTTPS
      const client = new SamsungTVClient({
        ip: tv.ip,
        port: 8002, // Porta segura SSL
        name: 'Smart Remote',
        token: savedToken || undefined,
      });

      const connected = await client.connect();
      
      if (connected) {
        setTVClient(client);
        setConnectedTV(tv);
        console.log('✅ Conexão estabelecida com sucesso!');
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('❌ Erro na conexão:', error);
      throw error;
    }
  };

  const sendCommand = (command: string) => {
    if (settings.vibrationEnabled && navigator.vibrate) {
      navigator.vibrate(10);
    }

    if (tvClient && tvClient.getConnectionStatus()) {
      const samsungKey = SamsungTVClient.keyMap[command];
      if (samsungKey) {
        tvClient.sendKey(samsungKey);
        console.log(`Comando real enviado: ${samsungKey} para TV ${connectedTV?.name}`);
      } else {
        console.warn(`Comando não mapeado: ${command}`);
      }
    } else {
      console.warn('TV não conectada ou cliente não inicializado');
    }
  };

  return (
    <AppContext.Provider
      value={{
        connectedTV,
        setConnectedTV,
        availableTVs,
        setAvailableTVs,
        settings,
        updateSettings,
        isScanning,
        setIsScanning,
        sendCommand,
        tvClient,
        setTVClient,
        connectToTV,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
