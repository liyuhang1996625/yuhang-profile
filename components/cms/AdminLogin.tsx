
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

  useEffect(() => {
    if (pin === '2077') { // Simple "geeky" pin
      onLogin();
    } else if (pin.length >= 4) {
      setError(true);
      setTimeout(() => {
        setPin('');
        setError(false);
      }, 500);
    }
  }, [pin, onLogin]);

  return (
    <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-lg flex items-center justify-center">
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
            <p className="font-mono text-[10px] text-tech-500 mt-2">ENTER 4-DIGIT ACCESS CODE (Hint: 2077)</p>
         </div>

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

         <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                    key={num}
                    onClick={() => setPin(prev => prev.length < 4 ? prev + num : prev)}
                    className="h-12 border border-tech-800 hover:border-neon hover:text-neon text-tech-300 font-mono text-lg transition-colors bg-tech-900/30"
                >
                    {num}
                </button>
            ))}
            <div className="col-start-2">
                <button
                    onClick={() => setPin(prev => prev.length < 4 ? prev + 0 : prev)}
                    className="w-full h-12 border border-tech-800 hover:border-neon hover:text-neon text-tech-300 font-mono text-lg transition-colors bg-tech-900/30"
                >
                    0
                </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AdminLogin;
