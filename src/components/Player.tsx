import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, X, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';

interface PlayerProps {
  title: string;
  script: string;
  imageUrl: string;
  audioUrl: string;
  onClose: () => void;
}

export function Player({ title, script, imageUrl, audioUrl, onClose }: PlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-between bg-black text-white p-6 md:p-12 overflow-hidden">
      {/* Background Image with blur and overlay */}
      <motion.div 
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 0.6, scale: 1 }}
        transition={{ duration: 3, ease: 'easeOut' }}
        className="absolute inset-0 z-0"
      >
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover blur-sm"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60" />
      </motion.div>

      {/* Top Bar */}
      <div className="relative z-10 flex justify-between items-center w-full">
        <h2 className="font-serif text-xl opacity-80 italic">{title}</h2>
        <button 
          onClick={onClose}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Script Display */}
      <div className="relative z-10 flex-1 flex items-center justify-center max-w-2xl mx-auto w-full py-12">
        <motion.div 
          className="text-center font-serif text-2xl md:text-3xl leading-relaxed text-white/90"
        >
          {/* We could animate lines here, but a full script display with simple fade in is elegant too */}
          <div className="max-h-[50vh] overflow-y-auto pr-4 scrollbar-hide text-white/80 font-light" style={{ maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)' }}>
            {script.split('. ').map((sentence, i) => (
              <p key={i} className="mb-6">{sentence}.</p>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Player Controls */}
      <div className="relative z-10 w-full max-w-2xl mx-auto glass-panel rounded-3xl p-6 md:p-8">
        <audio 
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          onLoadedMetadata={handleTimeUpdate}
        />
        
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs font-mono tracking-widest opacity-60">
            {formatTime(progress)}
          </span>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.currentTime = 0;
                  if (!isPlaying) togglePlay();
                }
              }}
              className="text-white/60 hover:text-white transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button 
              onClick={togglePlay}
              className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
            </button>
          </div>
          <span className="text-xs font-mono tracking-widest opacity-60">
            {formatTime(duration)}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="relative h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer">
          <div 
            className="absolute top-0 left-0 h-full bg-white transition-all ease-linear"
            style={{ width: `${duration ? (progress / duration) * 100 : 0}%` }}
          />
        </div>
      </div>
    </div>
  );
}
