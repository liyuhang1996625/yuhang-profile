
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, X } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
  onClose: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onClose }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  // Auto-check logic
  useEffect(() => {
    if (pin === '1996') {
      onLogin();
    } else if (pin.length >= 4) {
      setError(true);
      setTimeout(() => {
        setPin('');
        setError(false);
      }, 500);
    }
  }, [pin, onLogin]);

  // Keyboard Support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent input during error animation
      if (error) return;

      if (e.key >= '0' && e.key <= '9') {
        setPin(prev => (prev.length < 4 ? prev + e.key : prev));
      } else if (e.key === 'Backspace') {
        setPin(prev => prev.slice(0, -1));
      } else if (e.key === 'Enter') {
         // Auto-check handles '1996', but if user presses enter prematurely or just as habit:
         // If correct, it triggers via effect. If wrong length, do nothing.
         // If wrong PIN but length 4, effect triggers error.
      } else if (e.key === 'Escape') {
         onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [error, onClose]);

  return (
    <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-lg flex items-center justify-center animate-in fade-in duration-300">
      <div className="w-full max-w-sm bg-black border border-tech-800 p-8 relative shadow-2xl">
         <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-tech-500 hover:text-white transition-colors"
         >
            <X size={20} />
         </button>

         <div className="flex flex-col items-center mb-8">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors duration-300 ${error ? 'bg-red-500/20 text-red-500' : 'bg-tech-900 text-neon'}`}>
                <Lock size={20} />
            </div>
            <h2 className="font-mono text-lg text-white font-bold tracking-widest">AUTHENTICATION</h2>
            <p className="font-mono text-[10px] text-tech-500 mt-2">ENTER 4-DIGIT ACCESS CODE</p>
         </div>

         {/* Visual Dots */}
         <div className="flex justify-center gap-4 mb-8">
            {[0, 1, 2, 3].map((i) => (
                <div 
                    key={i} 
                    className={`w-3 h-3 rounded-full border border-tech-600 transition-all duration-200 ${
                        pin.length > i ? 'bg-neon border-neon' : 'bg-transparent'
                    } ${error ? 'bg-red-500 border-red-500' : ''}`}
                />
            ))}
         </div>

         {/* Numpad */}
         <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                    key={num}
                    onClick={() => !error && setPin(prev => prev.length < 4 ? prev + num : prev)}
                    className="h-12 border border-tech-800 hover:border-neon hover:text-neon text-tech-300 font-mono text-lg transition-colors bg-tech-900/30 active:bg-neon/20"
                >
                    {num}
                </button>
            ))}
            <div className="col-start-2">
                <button
                    onClick={() => !error && setPin(prev => prev.length < 4 ? prev + 0 : prev)}
                    className="w-full h-12 border border-tech-800 hover:border-neon hover:text-neon text-tech-300 font-mono text-lg transition-colors bg-tech-900/30 active:bg-neon/20"
                >
                    0
                </button>
            </div>
         </div>
         
         <div className="mt-8 text-center">
            <p className="font-mono text-[9px] text-tech-600">
                KEYBOARD INPUT SUPPORTED
            </p>
         </div>
      </div>
    </div>
  );
};

export default AdminLogin;
