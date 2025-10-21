import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tv, Wifi, ChevronRight, Sparkles } from 'lucide-react';
import { TV_BRANDS, type TVBrand } from '@/lib/tvBrands';
import { useApp } from '@/contexts/AppContext';

const Welcome = () => {
  const navigate = useNavigate();
  const { setSelectedBrand } = useApp();
  const [hoveredBrand, setHoveredBrand] = useState<TVBrand | null>(null);

  const handleBrandSelect = (brandId: TVBrand, supported: boolean) => {
    if (!supported) return;
    
    setSelectedBrand(brandId);
    localStorage.setItem('selected_brand', brandId);
    navigate('/devices');
  };

  return (
    <div className="min-h-screen flex flex-col p-6 gradient-primary overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header */}
      <div className="relative z-10 text-center space-y-4 pt-12 pb-8 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-4">
          <Sparkles className="w-4 h-4 text-white" />
          <span className="text-white text-sm font-medium">Controle Remoto Universal</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight">
          Smart Remote
        </h1>
        <p className="text-white/80 text-lg max-w-md mx-auto">
          Escolha a marca da sua TV para começar
        </p>
      </div>

      {/* TV Brands Grid */}
      <div className="relative z-10 flex-1 max-w-4xl w-full mx-auto pb-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-slide-up">
          {TV_BRANDS.map((brand, index) => (
            <Card
              key={brand.id}
              onClick={() => handleBrandSelect(brand.id, brand.supported)}
              onMouseEnter={() => setHoveredBrand(brand.id)}
              onMouseLeave={() => setHoveredBrand(null)}
              className={`
                relative p-6 transition-all duration-300 cursor-pointer overflow-hidden
                ${brand.supported 
                  ? 'hover:scale-105 hover:shadow-2xl active:scale-95' 
                  : 'opacity-60 cursor-not-allowed'
                }
              `}
              style={{ 
                animationDelay: `${index * 100}ms`,
                background: hoveredBrand === brand.id && brand.supported
                  ? `linear-gradient(135deg, ${brand.color.replace('from-', 'hsl(var(--')}, ${brand.color.replace('to-', 'hsl(var(--')})`
                  : undefined
              }}
            >
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 ${brand.gradient} opacity-0 transition-opacity duration-300 ${hoveredBrand === brand.id && brand.supported ? 'opacity-10' : ''}`} />
              
              {/* Content */}
              <div className="relative z-10 flex flex-col items-center gap-4 text-center">
                <div className={`
                  w-16 h-16 rounded-2xl ${brand.gradient} 
                  flex items-center justify-center shadow-lg
                  transition-transform duration-300
                  ${hoveredBrand === brand.id && brand.supported ? 'scale-110' : ''}
                `}>
                  <Tv className="w-8 h-8 text-white" strokeWidth={2} />
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-foreground flex items-center justify-center gap-2">
                    {brand.name}
                    {brand.supported && hoveredBrand === brand.id && (
                      <ChevronRight className="w-5 h-5 text-accent animate-fade-in" />
                    )}
                  </h3>
                  <p className="text-sm text-muted-foreground">{brand.description}</p>
                </div>

                {!brand.supported && (
                  <Badge variant="secondary" className="text-xs">
                    Em Breve
                  </Badge>
                )}
                
                {brand.supported && (
                  <Badge className={`${brand.gradient} text-white border-0 text-xs`}>
                    Disponível
                  </Badge>
                )}
              </div>

              {/* Hover Effect */}
              {brand.supported && (
                <div className={`
                  absolute inset-0 border-2 rounded-lg transition-opacity duration-300
                  ${hoveredBrand === brand.id ? 'opacity-100' : 'opacity-0'}
                `} 
                style={{ 
                  borderImage: `linear-gradient(135deg, ${brand.color.replace('from-', '')}, ${brand.color.replace('to-', '')}) 1`
                }} 
                />
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center space-y-3 pb-6 animate-fade-in" style={{ animationDelay: '600ms' }}>
        <div className="flex items-center justify-center gap-2 text-white/70">
          <Wifi className="w-4 h-4" />
          <p className="text-sm">
            Conecte seu dispositivo e TV na mesma rede Wi-Fi
          </p>
        </div>
        <p className="text-white/50 text-xs">
          Suporte para mais marcas em breve
        </p>
      </div>
    </div>
  );
};

export default Welcome;
