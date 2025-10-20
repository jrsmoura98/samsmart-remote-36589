// Samsung TV WebSocket API Client
// Baseado no protocolo Samsung Tizen

interface SamsungTVConfig {
  ip: string;
  port?: number;
  name?: string;
  token?: string;
}

export class SamsungTVClient {
  private ws: WebSocket | null = null;
  private ip: string;
  private port: number;
  private appName: string;
  private token: string | null;
  private isConnected: boolean = false;

  constructor(config: SamsungTVConfig) {
    this.ip = config.ip;
    this.port = config.port || 8002; // 8001 for non-SSL, 8002 for SSL
    this.appName = config.name || 'SmartRemote';
    this.token = config.token || null;
  }

  async connect(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        // Encode app name for WebSocket URL
        const encodedName = btoa(this.appName);
        
        // IMPORTANTE: Em páginas HTTPS, SEMPRE usar wss:// (porta 8002)
        // Detectar se a página atual é HTTPS
        const isHTTPS = window.location.protocol === 'https:';
        
        // Se a página é HTTPS, forçar porta 8002 e protocolo wss://
        if (isHTTPS && this.port === 8001) {
          console.warn('Página HTTPS detectada - mudando para porta 8002 (wss://)');
          this.port = 8002;
        }
        
        // Build WebSocket URL - sempre usar wss:// em páginas HTTPS
        const protocol = isHTTPS ? 'wss' : (this.port === 8002 ? 'wss' : 'ws');
        let wsUrl = `${protocol}://${this.ip}:${this.port}/api/v2/channels/samsung.remote.control?name=${encodedName}`;
        
        // Add token if available (for already paired devices)
        if (this.token) {
          wsUrl += `&token=${this.token}`;
        }

        console.log('🔌 Tentando conectar:', wsUrl);

        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log('✅ WebSocket conectado com sucesso!');
          this.isConnected = true;
          resolve(true);
        };

        this.ws.onmessage = (event) => {
          console.log('📨 Mensagem recebida da TV:', event.data);
          try {
            const data = JSON.parse(event.data);
            
            // Handle token from pairing
            if (data.event === 'ms.channel.connect' && data.data?.token) {
              this.token = data.data.token;
              console.log('🔑 Token de pareamento recebido e salvo');
              // Save token to localStorage for future connections
              localStorage.setItem(`tv_token_${this.ip}`, this.token);
            }
          } catch (e) {
            console.error('❌ Erro ao processar mensagem:', e);
          }
        };

        this.ws.onerror = (error) => {
          console.error('❌ Erro WebSocket:', error);
          this.isConnected = false;
          
          // Mensagem de erro mais clara
          let errorMsg = 'Falha na conexão. Verifique:\n';
          errorMsg += '• TV está ligada?\n';
          errorMsg += '• Mesmo Wi-Fi que o celular?\n';
          errorMsg += '• IP está correto?\n';
          errorMsg += '• Porta 8002 está aberta na TV?';
          
          reject(new Error(errorMsg));
        };

        this.ws.onclose = () => {
          console.log('WebSocket desconectado');
          this.isConnected = false;
        };

        // Timeout de 10 segundos
        setTimeout(() => {
          if (!this.isConnected) {
            this.disconnect();
            reject(new Error('Timeout: TV não respondeu em 10 segundos'));
          }
        }, 10000);

      } catch (error) {
        reject(error);
      }
    });
  }

  sendKey(key: string) {
    if (!this.ws || !this.isConnected) {
      console.error('TV não conectada');
      return;
    }

    const message = {
      method: 'ms.remote.control',
      params: {
        Cmd: 'Click',
        DataOfCmd: key,
        Option: 'false',
        TypeOfRemote: 'SendRemoteKey'
      }
    };

    console.log('Enviando comando:', key);
    this.ws.send(JSON.stringify(message));
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.isConnected = false;
    }
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  getToken(): string | null {
    return this.token;
  }

  // Mapeamento de comandos para teclas Samsung
  static keyMap: Record<string, string> = {
    // Power
    'power': 'KEY_POWER',
    'power_off': 'KEY_POWEROFF',
    
    // Volume
    'volume_up': 'KEY_VOLUP',
    'volume_down': 'KEY_VOLDOWN',
    'mute': 'KEY_MUTE',
    
    // Channel
    'channel_up': 'KEY_CHUP',
    'channel_down': 'KEY_CHDOWN',
    
    // Navigation
    'up': 'KEY_UP',
    'down': 'KEY_DOWN',
    'left': 'KEY_LEFT',
    'right': 'KEY_RIGHT',
    'enter': 'KEY_ENTER',
    
    // Menu
    'home': 'KEY_HOME',
    'back': 'KEY_RETURN',
    'menu': 'KEY_MENU',
    'source': 'KEY_SOURCE',
    'tools': 'KEY_TOOLS',
    'info': 'KEY_INFO',
    
    // Playback
    'play': 'KEY_PLAY',
    'pause': 'KEY_PAUSE',
    'stop': 'KEY_STOP',
    'rewind': 'KEY_REWIND',
    'forward': 'KEY_FF',
    
    // Numbers
    '0': 'KEY_0',
    '1': 'KEY_1',
    '2': 'KEY_2',
    '3': 'KEY_3',
    '4': 'KEY_4',
    '5': 'KEY_5',
    '6': 'KEY_6',
    '7': 'KEY_7',
    '8': 'KEY_8',
    '9': 'KEY_9',
  };
}
