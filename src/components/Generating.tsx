import React from 'react';
import { motion } from 'motion/react';

interface GeneratingProps {
  status: string;
}

export function Generating({ status }: GeneratingProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative">
      <div className="atmosphere" />
      
      <div className="flex flex-col items-center max-w-sm text-center">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
          className="w-32 h-32 rounded-full blur-[40px] bg-[#ff4e00]/40 mb-12"
        />
        
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-serif text-2xl font-light mb-4 text-white"
        >
          Creating your space
        </motion.h2>
        
        <motion.p 
          key={status}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white/60 font-light tracking-wide text-sm"
        >
          {status}
        </motion.p>
      </div>
    </div>
  );
}
