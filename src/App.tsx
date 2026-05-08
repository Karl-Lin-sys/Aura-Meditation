/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Home } from './components/Home';
import { Generating } from './components/Generating';
import { Player } from './components/Player';
import { generateMeditationDraft, generateImage, generateAudio, VoiceName, MeditationDraft } from './lib/gemini';

type AppState = 'home' | 'generating' | 'player' | 'error';

export default function App() {
  const [appState, setAppState] = useState<AppState>('home');
  const [status, setStatus] = useState('');
  const [errorInfo, setErrorInfo] = useState('');
  const [meditation, setMeditation] = useState<{
    draft: MeditationDraft;
    imageUrl: string;
    audioUrl: string;
  } | null>(null);

  const startMeditation = async (topic: string, duration: number, voice: VoiceName) => {
    try {
      setAppState('generating');
      
      // Step 1: Draft
      setStatus('Composing your meditation script...');
      const draft = await generateMeditationDraft(topic, duration);
      
      // Step 2: Image & Audio in parallel
      setStatus('Visualizing the scene and voicing the guide...');
      
      const [imageUrl, audioUrl] = await Promise.all([
        generateImage(draft.visualPrompt),
        generateAudio(draft.script, voice)
      ]);
      
      setMeditation({
        draft,
        imageUrl,
        audioUrl
      });
      
      setAppState('player');
      
    } catch (err: any) {
      console.error(err);
      setErrorInfo(err.message || 'An unexpected error occurred.');
      setAppState('error');
    }
  };

  return (
    <>
      {appState === 'home' && <Home onStart={startMeditation} />}
      {appState === 'generating' && <Generating status={status} />}
      {appState === 'player' && meditation && (
        <Player 
          title={meditation.draft.title}
          script={meditation.draft.script}
          imageUrl={meditation.imageUrl}
          audioUrl={meditation.audioUrl}
          onClose={() => {
            setMeditation(null);
            setAppState('home');
          }}
        />
      )}
      {appState === 'error' && (
        <div className="min-h-screen flex items-center justify-center p-6 bg-black text-white relative">
          <div className="atmosphere" />
          <div className="text-center p-8 glass-panel rounded-[32px] max-w-md relative z-10">
            <h2 className="text-red-400 mb-4 text-xl font-serif italic">Something went wrong</h2>
            <p className="text-white/60 mb-6 font-light">{errorInfo}</p>
            <button 
              onClick={() => setAppState('home')}
              className="px-6 py-3 bg-white text-black rounded-full hover:scale-105 transition-transform"
            >
              Back to Start
            </button>
          </div>
        </div>
      )}
    </>
  );
}
