/**
 * TCL/Roku TV Client
 * Controla TVs TCL (Roku) via API HTTP
 */

interface TCLTVConfig {
  ip: string;
  port?: number;
}

export class TCLTVClient {
  private config: TCLTVConfig;
  private isConnected = false;

  constructor(config: TCLTVConfig) {
    this.config = {
      port: 8060,
      ...config,
    };
  }

  async connect(): Promise<boolean> {
    try {
      const response = await fetch(`http://${this.config.ip}:${this.config.port}/query/device-info`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        this.isConnected = true;
        console.log('TCL TV connected successfully');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to connect to TCL TV:', error);
      return false;
    }
  }

  async sendKey(key: string) {
    if (!this.isConnected) {
      console.error('TCL TV not connected');
      return;
    }

    const rokuKey = TCLTVClient.keyMap[key] || key;
    
    try {
      await fetch(`http://${this.config.ip}:${this.config.port}/keypress/${rokuKey}`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Failed to send key to TCL TV:', error);
    }
  }

  disconnect() {
    this.isConnected = false;
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  static keyMap: Record<string, string> = {
    // Navigation
    UP: 'Up',
    DOWN: 'Down',
    LEFT: 'Left',
    RIGHT: 'Right',
    ENTER: 'Select',
    BACK: 'Back',
    HOME: 'Home',
    
    // Playback
    PLAY: 'Play',
    PAUSE: 'Play',
    STOP: 'InstantReplay',
    REWIND: 'Rev',
    FORWARD: 'Fwd',
    
    // Volume
    VOLUME_UP: 'VolumeUp',
    VOLUME_DOWN: 'VolumeDown',
    MUTE: 'VolumeMute',
    
    // Channels
    CHANNEL_UP: 'ChannelUp',
    CHANNEL_DOWN: 'ChannelDown',
    
    // Numbers
    '0': 'Lit_0', '1': 'Lit_1', '2': 'Lit_2', '3': 'Lit_3', '4': 'Lit_4',
    '5': 'Lit_5', '6': 'Lit_6', '7': 'Lit_7', '8': 'Lit_8', '9': 'Lit_9',
    
    // Special
    POWER: 'PowerOff',
    INFO: 'Info',
  };
}
