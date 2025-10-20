import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Delete, Send } from 'lucide-react';

const VirtualKeyboard = () => {
  const [text, setText] = useState('');
  const { sendCommand } = useApp();

  const keys = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
  ];

  const handleKeyPress = (key: string) => {
    setText((prev) => prev + key);
    sendCommand(`key_${key}`);
  };

  const handleBackspace = () => {
    setText((prev) => prev.slice(0, -1));
    sendCommand('backspace');
  };

  const handleSpace = () => {
    setText((prev) => prev + ' ');
    sendCommand('space');
  };

  const handleSend = () => {
    sendCommand(`text_${text}`);
    setText('');
  };

  return (
    <Card className="p-4 shadow-soft animate-slide-up">
      <h3 className="font-semibold text-foreground mb-3">Teclado Virtual</h3>

      {/* Text Input Display */}
      <div className="flex gap-2 mb-4">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Digite aqui..."
          className="flex-1"
        />
        <Button
          onClick={handleSend}
          disabled={!text}
          size="icon"
          className="rounded-xl bg-accent hover:bg-accent/90"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>

      {/* Keyboard */}
      <div className="space-y-2">
        {keys.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1">
            {row.map((key) => (
              <button
                key={key}
                onClick={() => handleKeyPress(key)}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-card hover:bg-muted text-foreground text-sm font-medium transition-smooth active:scale-95 shadow-soft"
              >
                {key}
              </button>
            ))}
          </div>
        ))}

        {/* Bottom Row */}
        <div className="flex justify-center gap-1">
          <button
            onClick={handleBackspace}
            className="w-16 h-9 rounded-lg bg-card hover:bg-muted transition-smooth active:scale-95 shadow-soft flex items-center justify-center"
          >
            <Delete className="w-4 h-4" />
          </button>
          <button
            onClick={handleSpace}
            className="flex-1 h-9 rounded-lg bg-card hover:bg-muted text-foreground text-sm font-medium transition-smooth active:scale-95 shadow-soft"
          >
            ESPAÇO
          </button>
          <button
            onClick={() => handleKeyPress('.')}
            className="w-16 h-9 rounded-lg bg-card hover:bg-muted text-foreground text-sm font-medium transition-smooth active:scale-95 shadow-soft"
          >
            .
          </button>
        </div>
      </div>
    </Card>
  );
};

export default VirtualKeyboard;
