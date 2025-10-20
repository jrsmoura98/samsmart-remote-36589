import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tv } from 'lucide-react';

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/welcome');
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center gradient-primary">
      <div className="text-center animate-scale-in">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-accent/20 rounded-full blur-3xl animate-pulse-glow" />
          <Tv className="w-24 h-24 text-white relative z-10 mx-auto" strokeWidth={1.5} />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">Smart Remote</h1>
        <p className="text-white/80 text-lg">TV Samsung</p>
      </div>
    </div>
  );
};

export default Splash;
