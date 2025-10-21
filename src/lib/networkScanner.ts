import { Capacitor } from '@capacitor/core';

export interface DiscoveredTV {
  id: string;
  name: string;
  model: string;
  ip: string;
  discovered: boolean;
}

/**
 * Escaneia a rede local por TVs Samsung
 * Funciona apenas em apps nativos (Capacitor)
 */
export async function scanNetworkForTVs(): Promise<DiscoveredTV[]> {
  // Verifica se está rodando como app nativo
  if (!Capacitor.isNativePlatform()) {
    console.log('Network scan only available on native platforms');
    return [];
  }

  const foundTVs: DiscoveredTV[] = [];
  
  try {
    // Pegar IP local do dispositivo
    const localIP = await getLocalIP();
    if (!localIP) {
      console.log('Could not determine local IP');
      return [];
    }

    const subnet = localIP.substring(0, localIP.lastIndexOf('.'));
    console.log('Scanning subnet:', subnet);

    // Escanear IPs comuns (1-254)
    const scanPromises: Promise<void>[] = [];
    
    // Scan em paralelo para ser mais rápido (grupos de 50)
    for (let i = 1; i <= 254; i++) {
      const ip = `${subnet}.${i}`;
      scanPromises.push(
        checkTVAtIP(ip).then(tvInfo => {
          if (tvInfo) {
            foundTVs.push(tvInfo);
          }
        })
      );

      // Processar em lotes de 50 para não sobrecarregar
      if (i % 50 === 0) {
        await Promise.all(scanPromises);
        scanPromises.length = 0;
      }
    }

    // Processar restantes
    await Promise.all(scanPromises);

  } catch (error) {
    console.error('Error scanning network:', error);
  }

  return foundTVs;
}

/**
 * Obtém o IP local do dispositivo
 */
async function getLocalIP(): Promise<string | null> {
  try {
    // Em apps nativos, podemos usar fetch para um serviço que retorna nosso IP
    // Ou usar plugins específicos do Capacitor
    
    // Método simples: tentar conectar ao gateway comum
    const commonGateways = ['192.168.1.1', '192.168.0.1', '10.0.0.1'];
    
    for (const gateway of commonGateways) {
      try {
        // Se conseguir fazer fetch (mesmo que falhe), estamos na rede certa
        await fetch(`http://${gateway}`, { 
          mode: 'no-cors',
          signal: AbortSignal.timeout(1000)
        });
        return gateway.substring(0, gateway.lastIndexOf('.')) + '.2'; // Assume que somos .2
      } catch {
        continue;
      }
    }
    
    // Fallback: assume rede mais comum
    return '192.168.1.2';
  } catch (error) {
    console.error('Error getting local IP:', error);
    return null;
  }
}

/**
 * Verifica se há uma TV Samsung no IP especificado
 */
async function checkTVAtIP(ip: string): Promise<DiscoveredTV | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);

    // TVs Samsung geralmente respondem na porta 8002 (WebSocket) ou 8001
    const response = await fetch(`http://${ip}:8001/api/v2/`, {
      signal: controller.signal,
      mode: 'no-cors',
      method: 'GET'
    });

    clearTimeout(timeout);

    // Se chegou aqui, provavelmente é uma TV Samsung
    return {
      id: `discovered_${ip.replace(/\./g, '_')}`,
      name: `TV Samsung (${ip})`,
      model: 'Descoberta automaticamente',
      ip: ip,
      discovered: true
    };

  } catch (error) {
    // Não é uma TV ou não está disponível
    return null;
  }
}

/**
 * Scan rápido apenas em IPs comuns de TVs
 */
export async function quickScanForTVs(): Promise<DiscoveredTV[]> {
  if (!Capacitor.isNativePlatform()) {
    return [];
  }

  const commonSubnets = ['192.168.1', '192.168.0', '10.0.0'];
  const commonHosts = [100, 101, 102, 103, 104, 105, 10, 11, 12, 20, 21, 22];
  
  const foundTVs: DiscoveredTV[] = [];
  const scanPromises: Promise<void>[] = [];

  for (const subnet of commonSubnets) {
    for (const host of commonHosts) {
      const ip = `${subnet}.${host}`;
      scanPromises.push(
        checkTVAtIP(ip).then(tvInfo => {
          if (tvInfo) {
            foundTVs.push(tvInfo);
          }
        })
      );
    }
  }

  await Promise.all(scanPromises);
  return foundTVs;
}
