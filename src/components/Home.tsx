import React, { useState } from 'react';
import { Leaf, Mic, Clock, Sparkles } from 'lucide-react';
import { VoiceName } from '../lib/gemini';
import { motion } from 'motion/react';

interface HomeProps {
  onStart: (topic: string, duration: number, voice: VoiceName) => void;
}

export function Home({ onStart }: HomeProps) {
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState<number>(2);
  const [voice, setVoice] = useState<VoiceName>('Kore');

  const voices: { name: VoiceName; desc: string }[] = [
    { name: 'Kore', desc: 'Calm, gentle, soothing' },
    { name: 'Puck', desc: 'Warm, grounding, deep' },
    { name: 'Charon', desc: 'Resonant, mindful' },
    { name: 'Zephyr', desc: 'Breathy, light, airy' },
  ];

  const presetTopics = ['Anxiety Relief', 'Deep Sleep', 'Morning Focus', 'Self-Compassion'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    onStart(topic, duration, voice);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <div className="atmosphere" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-lg glass-panel rounded-[32px] p-8 md:p-12 relative overflow-hidden"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-6 border border-white/20">
            <Leaf className="w-8 h-8 text-white/90" />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-light tracking-tight mb-3">Aura</h1>
          <p className="text-white/60 font-light tracking-wide text-sm uppercase">AI Guided Meditation</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className="block text-sm font-medium text-white/80 uppercase tracking-wider text-xs">What do you want to focus on?</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Letting go of string stress..."
              className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition-all font-light"
              required
            />
            <div className="flex flex-wrap gap-2 pt-2">
              {presetTopics.map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTopic(t)}
                  className="text-xs px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-white/80 uppercase tracking-wider text-xs">
                <Clock className="w-4 h-4 text-white/50" /> Duration
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition-all font-light appearance-none"
              >
                <option value={1} className="bg-zinc-900">1 Minute</option>
                <option value={2} className="bg-zinc-900">2 Minutes</option>
                <option value={3} className="bg-zinc-900">3 Minutes</option>
                <option value={5} className="bg-zinc-900">5 Minutes</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-white/80 uppercase tracking-wider text-xs">
                <Mic className="w-4 h-4 text-white/50" /> Guide Voice
              </label>
              <select
                value={voice}
                onChange={(e) => setVoice(e.target.value as VoiceName)}
                className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition-all font-light appearance-none"
              >
                {voices.map(v => (
                  <option key={v.name} value={v.name} className="bg-zinc-900">
                    {v.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={!topic.trim()}
            className="w-full relative group overflow-hidden rounded-2xl bg-white text-black font-medium py-4 px-6 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 mt-4"
          >
            <Sparkles className="w-5 h-5" />
            <span>Generate Session</span>
          </button>
        </form>
      </motion.div>
    </div>
  );
}
