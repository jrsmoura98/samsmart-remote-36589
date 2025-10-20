import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tv, Wifi } from 'lucide-react';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 gradient-primary">
      <div className="max-w-md w-full text-center space-y-8 animate-fade-in">
        <div className="relative">
          <div className="absolute inset-0 bg-accent/20 rounded-full blur-3xl animate-pulse-glow" />
          <Tv className="w-32 h-32 text-white relative z-10 mx-auto mb-4" strokeWidth={1.5} />
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-white">Smart Remote</h1>
          <p className="text-white/90 text-lg">Controle sua TV Samsung</p>
          <p className="text-white/70 text-sm max-w-sm mx-auto">
            Conecte-se à sua TV via Wi-Fi e tenha controle total com este aplicativo moderno e intuitivo
          </p>
        </div>

        <div className="pt-8">
          <Button
            onClick={() => navigate('/devices')}
            size="lg"
            className="w-full max-w-xs bg-white text-primary hover:bg-white/90 h-14 text-lg font-semibold shadow-strong rounded-2xl transition-bounce"
          >
            <Wifi className="w-5 h-5 mr-2" />
            Conectar à TV Samsung
          </Button>
        </div>

        <p className="text-white/60 text-xs pt-4">
          Certifique-se de que seu dispositivo e a TV<br />estão na mesma rede Wi-Fi
        </p>
      </div>
    </div>
  );
};

export default Welcome;
