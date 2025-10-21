import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tv, Wifi, RefreshCw, ChevronRight, Plus, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { Capacitor } from '@capacitor/core';
import { quickScanForTVs, type DiscoveredTV } from '@/lib/networkScanner';
import { TV_BRANDS } from '@/lib/tvBrands';

const Devices = () => {
  const navigate = useNavigate();
  const { availableTVs, setAvailableTVs, connectToTV, isScanning, setIsScanning, selectedBrand } = useApp();
  const currentBrand = TV_BRANDS.find(b => b.id === selectedBrand);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualIP, setManualIP] = useState('');
  const [manualName, setManualName] = useState('');
  const [discoveredTVs, setDiscoveredTVs] = useState<DiscoveredTV[]>([]);
  const [isNativeApp, setIsNativeApp] = useState(false);

  // Detectar se é app nativo
  useEffect(() => {
    setIsNativeApp(Capacitor.isNativePlatform());
  }, []);

  const scanForDevices = async () => {
    setIsScanning(true);
    
    try {
      if (isNativeApp) {
        // App nativo: fazer scan real da rede
        toast.info('🔍 Escaneando rede local...');
        
        const found = await quickScanForTVs();
        setDiscoveredTVs(found);
        
        if (found.length > 0) {
          toast.success(`✨ ${found.length} TV(s) encontrada(s) automaticamente!`);
        } else {
          toast.info('Nenhuma TV descoberta automaticamente. Use a opção manual.');
        }
      } else {
        // Navegador web: apenas mostrar TVs salvas
        toast.info('⚠️ Descoberta automática disponível apenas no app nativo. Use "Adicionar Manualmente".');
      }
      
      // Carregar TVs salvas do localStorage
      const savedTVs = localStorage.getItem('saved_tvs');
      if (savedTVs) {
        const parsed = JSON.parse(savedTVs);
        setAvailableTVs(parsed);
      }
      
      setIsScanning(false);
    } catch (error) {
      console.error('Erro no scan:', error);
      setIsScanning(false);
      toast.error('Erro ao escanear rede');
    }
  };

  const handleConnect = async (tv: typeof availableTVs[0]) => {
    const loadingToast = toast.loading('Conectando via WebSocket...');
    
    try {
      const success = await connectToTV(tv);
      
      if (success) {
        toast.success(`✅ Conectado a ${tv.name}`, { id: loadingToast });
        navigate('/remote');
      } else {
        toast.error('Falha na conexão', { id: loadingToast });
      }
    } catch (error: any) {
      console.error('Erro na conexão:', error);
      toast.dismiss(loadingToast);
      
      // Mostrar erro detalhado em modal se for erro de certificado
      if (error.message.includes('CERTIFICADO')) {
        toast.error(
          <div className="text-left space-y-2">
            <div className="font-semibold">🔐 Certificado SSL Bloqueado</div>
            <div className="text-sm">
              <p>1. Abra em nova aba:</p>
              <a 
                href={`https://${tv.ip}:8002`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-accent underline block my-1"
              >
                https://{tv.ip}:8002
              </a>
              <p>2. Aceite o aviso de segurança</p>
              <p>3. Volte aqui e conecte novamente</p>
            </div>
          </div>,
          { duration: 10000 }
        );
      } else {
        toast.error(error.message || 'Não foi possível conectar à TV', { duration: 8000 });
      }
    }
  };

  const handleManualAdd = () => {
    if (!manualIP || !manualName) {
      toast.error('Preencha o IP e nome da TV');
      return;
    }

    // Validate IP format
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(manualIP)) {
      toast.error('IP inválido. Use formato: 192.168.1.100');
      return;
    }

    const newTV = {
      id: Date.now().toString(),
      name: manualName,
      model: 'Manual',
      ip: manualIP,
    };

    const updatedTVs = [...availableTVs, newTV];
    setAvailableTVs(updatedTVs);
    
    // Save to localStorage
    localStorage.setItem('saved_tvs', JSON.stringify(updatedTVs));
    
    toast.success('TV adicionada!');
    setShowManualInput(false);
    setManualIP('');
    setManualName('');
    
    // Auto-connect
    handleConnect(newTV);
  };

  return (
    <div className="min-h-screen p-6 pb-24">
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl ${currentBrand?.gradient} flex items-center justify-center shadow-lg`}>
              <Tv className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-bold text-foreground">{currentBrand?.name}</h1>
              <p className="text-sm text-muted-foreground">{currentBrand?.description}</p>
            </div>
          </div>
          <p className="text-muted-foreground">Selecione sua TV para conectar</p>
        </div>

        {/* Scan Button */}
        <div className="space-y-3">
          <Button
            onClick={scanForDevices}
            disabled={isScanning}
            className="w-full h-12 rounded-2xl bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground font-semibold shadow-glow"
          >
            {isNativeApp ? (
              <>
                <Sparkles className={`w-5 h-5 mr-2 ${isScanning ? 'animate-spin' : ''}`} />
                {isScanning ? 'Procurando TVs na rede...' : 'Descobrir TVs Automaticamente'}
              </>
            ) : (
              <>
                <RefreshCw className={`w-5 h-5 mr-2 ${isScanning ? 'animate-spin' : ''}`} />
                {isScanning ? 'Atualizando...' : 'Atualizar Lista Salva'}
              </>
            )}
          </Button>
        </div>

        {/* Discovered TVs (Auto) */}
        {discoveredTVs.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              <h2 className="text-sm font-semibold text-foreground">Descobertas Automaticamente</h2>
            </div>
            {discoveredTVs.map((tv, index) => (
              <Card
                key={tv.id}
                className="p-4 shadow-soft hover:shadow-medium transition-smooth cursor-pointer animate-slide-up border-accent/30"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => handleConnect(tv)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center shadow-glow">
                    <Sparkles className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{tv.name}</h3>
                    <p className="text-sm text-muted-foreground">{tv.model}</p>
                    <p className="text-xs text-accent font-medium mt-0.5">IP: {tv.ip}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Manual Add Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">Adicionar Manualmente</h2>
          </div>
          
          <Button
            onClick={() => setShowManualInput(!showManualInput)}
            variant="outline"
            className="w-full h-12 rounded-2xl font-semibold"
          >
            <Plus className="w-5 h-5 mr-2" />
            {showManualInput ? 'Cancelar' : 'Adicionar por IP'}
          </Button>
        </div>

        {/* Manual Input */}
        {showManualInput && (
          <Card className="p-4 shadow-soft animate-slide-up space-y-3">
            <div>
              <Label htmlFor="tv-ip" className="text-sm font-medium mb-2 block">
                Endereço IP da TV
              </Label>
              <Input
                id="tv-ip"
                type="text"
                placeholder="Ex: 192.168.1.100"
                value={manualIP}
                onChange={(e) => setManualIP(e.target.value)}
                className="h-11"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Encontre o IP em: Configurações → Rede → Status da Rede
              </p>
            </div>
            <div>
              <Label htmlFor="tv-name" className="text-sm font-medium mb-2 block">
                Nome da TV
              </Label>
              <Input
                id="tv-name"
                type="text"
                placeholder="Ex: TV da Sala"
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                className="h-11"
              />
            </div>
            <Button
              onClick={handleManualAdd}
              className="w-full h-11 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
            >
              Adicionar e Conectar
            </Button>
          </Card>
        )}

        {/* Saved/Manual TVs List */}
        {availableTVs.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Tv className="w-4 h-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground">TVs Salvas</h2>
            </div>
            {availableTVs.map((tv, index) => (
            <Card
              key={tv.id}
              className="p-4 shadow-soft hover:shadow-medium transition-smooth cursor-pointer animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => handleConnect(tv)}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Tv className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{tv.name}</h3>
                  <p className="text-sm text-muted-foreground">{tv.model}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">IP: {tv.ip}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </Card>
            ))}
          </div>
        )}

        {/* No devices found */}
        {availableTVs.length === 0 && discoveredTVs.length === 0 && !isScanning && (
          <Card className="p-8 text-center shadow-soft">
            <Wifi className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">Nenhuma TV encontrada</p>
            <p className="text-sm text-muted-foreground mt-2">
              {isNativeApp 
                ? 'Toque em "Descobrir TVs" ou adicione manualmente'
                : 'Use "Adicionar por IP" para conectar sua TV'
              }
            </p>
          </Card>
        )}

        {/* Help Text */}
        <div className="text-center text-sm space-y-2 pt-4">
          <Card className="p-4 bg-accent/10 border-accent/20">
            <h4 className="font-semibold text-foreground mb-2">
              {isNativeApp ? '✨ Descoberta Automática Ativada!' : '📡 Como Conectar'}
            </h4>
            <ol className="text-left text-xs text-muted-foreground space-y-1">
              {isNativeApp ? (
                <>
                  <li>1. Certifique-se que a TV está <strong>ligada</strong></li>
                  <li>2. TV e celular na <strong>mesma rede Wi-Fi</strong></li>
                  <li>3. Toque em <strong>"Descobrir TVs Automaticamente"</strong></li>
                  <li>4. Selecione sua TV da lista</li>
                  <li>5. <strong>Aceite a solicitação</strong> que aparecerá na TV</li>
                </>
              ) : (
                <>
                  <li>1. Certifique-se que a TV está <strong>ligada</strong></li>
                  <li>2. TV e dispositivo na <strong>mesma rede Wi-Fi</strong></li>
                  <li>3. Encontre o IP: <strong>Menu TV → Rede → Status</strong></li>
                  <li>4. Adicione o IP manualmente acima</li>
                  <li>5. <strong className="text-accent">IMPORTANTE:</strong> Abra <code className="bg-muted px-1 rounded">https://[IP]:8002</code> e aceite certificado SSL</li>
                  <li>6. <strong>Aceite a solicitação</strong> na TV</li>
                </>
              )}
            </ol>
          </Card>
          
          {!isNativeApp && (
            <p className="text-muted-foreground text-xs">
              💡 <strong>Dica:</strong> Instale o app nativo para descoberta automática de TVs!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Devices;
