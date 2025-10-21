import React, { createContext, useContext, useState, useEffect } from 'react';
import { SamsungTVClient } from '@/lib/samsungTV';
import { LGTVClient } from '@/lib/lgTV';
import { TCLTVClient } from '@/lib/tclTV';
import type { TVBrand } from '@/lib/tvBrands';

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
  tvClient: SamsungTVClient | LGTVClient | TCLTVClient | null;
  setTVClient: (client: SamsungTVClient | LGTVClient | TCLTVClient | null) => void;
  connectToTV: (tv: TV) => Promise<boolean>;
  selectedBrand: TVBrand;
  setSelectedBrand: (brand: TVBrand) => void;
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
  const [tvClient, setTVClient] = useState<SamsungTVClient | LGTVClient | TCLTVClient | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<TVBrand>(() => {
    const saved = localStorage.getItem('selected_brand');
    return (saved as TVBrand) || 'samsung';
  });
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
      const savedToken = localStorage.getItem(`tv_token_${tv.ip}`);
      
      console.log(`🔌 Iniciando conexão com ${tv.name} (${tv.ip}) - Marca: ${selectedBrand}`);
      
      let client: SamsungTVClient | LGTVClient | TCLTVClient;

      // Criar cliente baseado na marca selecionada
      switch (selectedBrand) {
        case 'samsung':
          client = new SamsungTVClient({
            ip: tv.ip,
            port: 8002,
            name: 'Smart Remote',
            token: savedToken || undefined,
          });
          break;
        
        case 'lg':
          client = new LGTVClient({
            ip: tv.ip,
            port: 3000,
            appName: 'Smart Remote',
            token: savedToken || undefined,
          });
          break;
        
        case 'tcl':
          client = new TCLTVClient({
            ip: tv.ip,
            port: 8060,
          });
          break;
        
        default:
          throw new Error(`Marca ${selectedBrand} ainda não suportada`);
      }

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
      // Mapear comando baseado na marca
      let mappedKey: string | undefined;
      
      if (tvClient instanceof SamsungTVClient) {
        mappedKey = SamsungTVClient.keyMap[command];
      } else if (tvClient instanceof LGTVClient) {
        mappedKey = LGTVClient.keyMap[command];
      } else if (tvClient instanceof TCLTVClient) {
        mappedKey = TCLTVClient.keyMap[command];
      }

      if (mappedKey) {
        tvClient.sendKey(mappedKey);
        console.log(`Comando enviado: ${mappedKey} para ${selectedBrand} TV ${connectedTV?.name}`);
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
        selectedBrand,
        setSelectedBrand,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
