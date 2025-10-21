/**
 * LG TV WebOS Client
 * Controla TVs LG via WebSocket
 */

interface LGTVConfig {
  ip: string;
  port?: number;
  appName?: string;
  token?: string;
}

export class LGTVClient {
  private ws: WebSocket | null = null;
  private config: LGTVConfig;
  private isConnected = false;
  private messageId = 1;

  constructor(config: LGTVConfig) {
    this.config = {
      port: 3000,
      appName: 'Smart Remote',
      ...config,
    };
  }

  async connect(): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        const wsUrl = `ws://${this.config.ip}:${this.config.port}`;
        console.log('Connecting to LG TV at:', wsUrl);

        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log('LG TV WebSocket connected');
          this.register();
        };

        this.ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          console.log('LG TV response:', data);

          if (data.type === 'registered') {
            this.isConnected = true;
            resolve(true);
          }
        };

        this.ws.onerror = (error) => {
          console.error('LG TV WebSocket error:', error);
          resolve(false);
        };

        this.ws.onclose = () => {
          console.log('LG TV WebSocket closed');
          this.isConnected = false;
        };

        setTimeout(() => resolve(false), 10000);
      } catch (error) {
        console.error('Failed to connect to LG TV:', error);
        resolve(false);
      }
    });
  }

  private register() {
    const registerPayload = {
      type: 'register',
      id: 'register_0',
      payload: {
        forcePairing: false,
        pairingType: 'PROMPT',
        'client-key': this.config.token,
        manifest: {
          manifestVersion: 1,
          appVersion: '1.0.0',
          signed: {
            created: '20200101',
            appId: 'com.smartremote.app',
            vendorId: 'com.smartremote',
            localizedAppNames: {
              '': this.config.appName,
            },
            permissions: ['LAUNCH', 'LAUNCH_WEBAPP', 'APP_TO_APP', 'CONTROL_INPUT_MEDIA_PLAYBACK', 'CONTROL_POWER', 'CONTROL_AUDIO', 'CONTROL_TV_SCREEN'],
          },
        },
      },
    };

    this.ws?.send(JSON.stringify(registerPayload));
  }

  sendCommand(command: string) {
    if (!this.isConnected || !this.ws) {
      console.error('LG TV not connected');
      return;
    }

    const payload = {
      type: 'request',
      id: `command_${this.messageId++}`,
      uri: 'ssap://system.launcher/open',
      payload: {
        id: command,
      },
    };

    this.ws.send(JSON.stringify(payload));
  }

  sendKey(key: string) {
    if (!this.isConnected || !this.ws) {
      console.error('LG TV not connected');
      return;
    }

    const lgKey = LGTVClient.keyMap[key] || key;
    
    const payload = {
      type: 'request',
      id: `key_${this.messageId++}`,
      uri: 'ssap://com.webos.service.ime/sendEnterKey',
      payload: {
        key: lgKey,
      },
    };

    this.ws.send(JSON.stringify(payload));
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  static keyMap: Record<string, string> = {
    // Navigation
    UP: 'UP',
    DOWN: 'DOWN',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
    ENTER: 'ENTER',
    BACK: 'BACK',
    HOME: 'HOME',
    
    // Playback
    PLAY: 'PLAY',
    PAUSE: 'PAUSE',
    STOP: 'STOP',
    REWIND: 'REWIND',
    FORWARD: 'FASTFORWARD',
    
    // Volume
    VOLUME_UP: 'VOLUMEUP',
    VOLUME_DOWN: 'VOLUMEDOWN',
    MUTE: 'MUTE',
    
    // Channels
    CHANNEL_UP: 'CHANNELUP',
    CHANNEL_DOWN: 'CHANNELDOWN',
    
    // Numbers
    '0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
    '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
    
    // Special
    POWER: 'POWER',
    MENU: 'MENU',
    INFO: 'INFO',
  };
}
