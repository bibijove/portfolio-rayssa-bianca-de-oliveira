/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cloud, Sparkles, RefreshCw, Save, Sliders, Palette, Layers, LogIn, LogOut, Trash2, History } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { GoogleGenAI } from "@google/genai";
import { auth, db, googleProvider, signInWithPopup, collection, addDoc, serverTimestamp, query, where, orderBy, onSnapshot } from './firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { deleteDoc, doc } from 'firebase/firestore';

// We'll initialize Gemini for the AI color suggestion
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export default function App() {
  const [complexity, setComplexity] = useState(6);
  const [contrast, setContrast] = useState(8);
  const [color, setColor] = useState('#ff0080');
  const [path, setPath] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [savedBlobs, setSavedBlobs] = useState<any[]>([]);
  const [showGallery, setShowGallery] = useState(false);

  const generateBlob = useCallback(() => {
    const points = complexity;
    const radius = 60;
    const variance = contrast * 4;
    const coords: { x: number; y: number }[] = [];
    const angleStep = (Math.PI * 2) / points;

    for (let i = 0; i < points; i++) {
      const theta = i * angleStep;
      const r = radius + (Math.random() * variance);
      const x = 100 + r * Math.cos(theta);
      const y = 100 + r * Math.sin(theta);
      coords.push({ x, y });
    }

    let d = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length; i++) {
      const next = coords[(i + 1) % coords.length];
      const midX = (coords[i].x + next.x) / 2;
      const midY = (coords[i].y + next.y) / 2;
      d += ` Q ${coords[i].x} ${coords[i].y}, ${midX} ${midY}`;
    }
    setPath(d + ' Z');
  }, [complexity, contrast]);

  useEffect(() => {
    generateBlob();
  }, [generateBlob]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setSavedBlobs([]);
      return;
    }

    const q = query(
      collection(db, 'userBlobs'),
      where('uid', '==', user.uid),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const blobs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSavedBlobs(blobs);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'userBlobs');
    });

    return () => unsubscribe();
  }, [user]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleAiColors = async () => {
    setIsGenerating(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Suggest 5 vibrant, modern hex color codes for a creative design tool. Return only the hex codes separated by commas.",
      });
      const colors = response.text?.split(',').map(c => c.trim()) || [];
      if (colors.length > 0) {
        const validColors = colors.filter(c => /^#[0-9A-F]{6}$/i.test(c));
        if (validColors.length > 0) {
          const randomColor = validColors[Math.floor(Math.random() * validColors.length)];
          setColor(randomColor);
        }
      }
    } catch (error) {
      console.error("Error generating AI colors:", error);
      const fallbackColors = ['#00dfd8', '#007cf0', '#7928ca', '#ff0080', '#ffb800'];
      setColor(fallbackColors[Math.floor(Math.random() * fallbackColors.length)]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      handleLogin();
      return;
    }

    setIsSaving(true);
    try {
      await addDoc(collection(db, 'userBlobs'), {
        uid: user.uid,
        color,
        svgPath: path,
        complexity,
        contrast,
        timestamp: serverTimestamp()
      });
      alert("Salvo com sucesso!");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'userBlobs');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'userBlobs', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `userBlobs/${id}`);
    }
  };

  const loadBlob = (blob: any) => {
    setComplexity(blob.complexity || 6);
    setContrast(blob.contrast || 8);
    setColor(blob.color);
    setPath(blob.svgPath);
    setShowGallery(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans">
      <div className="app-container glass w-full max-w-5xl h-[85vh] rounded-3xl grid grid-cols-1 md:grid-cols-[320px_1fr] overflow-hidden">
        {/* Sidebar */}
        <aside className="sidebar p-8 border-b md:border-b-0 md:border-r border-white/10 flex flex-col gap-8 overflow-y-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff0080] to-[#7928ca] flex items-center justify-center shadow-lg">
                <Layers className="text-white w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">OrganicShape</h2>
            </div>
            {user && (
              <button 
                onClick={() => setShowGallery(!showGallery)}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  showGallery ? "bg-[#ff0080] text-white" : "bg-white/5 text-white/60 hover:bg-white/10"
                )}
                title="Galeria"
              >
                <History className="w-5 h-5" />
              </button>
            )}
          </div>

          {!showGallery ? (
            <>
              <div className="space-y-6">
                <div className="control-group space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] uppercase tracking-widest font-semibold opacity-60 flex items-center gap-2">
                      <Sliders className="w-3 h-3" /> COMPLEXIDADE
                    </label>
                    <span className="text-xs font-mono opacity-80">{complexity}</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="15"
                    value={complexity}
                    onChange={(e) => setComplexity(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#ff0080]"
                  />
                </div>

                <div className="control-group space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] uppercase tracking-widest font-semibold opacity-60 flex items-center gap-2">
                      <Sliders className="w-3 h-3" /> CONTRASTE
                    </label>
                    <span className="text-xs font-mono opacity-80">{contrast}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={contrast}
                    onChange={(e) => setContrast(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#ff0080]"
                  />
                </div>

                <div className="control-group space-y-3">
                  <label className="text-[10px] uppercase tracking-widest font-semibold opacity-60 flex items-center gap-2">
                    <Palette className="w-3 h-3" /> COR
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-12 h-12 rounded-xl bg-transparent border-none cursor-pointer overflow-hidden"
                    />
                    <span className="text-sm font-mono opacity-80 uppercase">{color}</span>
                  </div>
                </div>
              </div>

              <div className="mt-auto space-y-3 pt-6 border-t border-white/10">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full py-3.5 px-4 bg-[#ff0080] hover:bg-[#ff0080]/90 text-white rounded-xl font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-[#ff0080]/20 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Salvando...' : user ? 'Salvar na Nuvem' : 'Entrar para Salvar'}
                </button>

                <button
                  onClick={handleAiColors}
                  disabled={isGenerating}
                  className="w-full py-3.5 px-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold text-sm transition-all active:scale-95 flex items-center justify-center gap-2 border border-white/10 disabled:opacity-50"
                >
                  <Sparkles className={cn("w-4 h-4", isGenerating && "animate-pulse")} />
                  Sugestão de Cores IA
                </button>

                <button
                  onClick={generateBlob}
                  className="w-full py-3.5 px-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold text-sm transition-all active:scale-95 flex items-center justify-center gap-2 border border-white/5"
                >
                  <RefreshCw className="w-4 h-4" />
                  Novo Formato
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-widest opacity-60">Sua Galeria</h3>
                <span className="text-[10px] font-mono opacity-40">{savedBlobs.length} itens</span>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {savedBlobs.length === 0 ? (
                  <div className="text-center py-12 opacity-40">
                    <Cloud className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    <p className="text-xs">Nenhum blob salvo ainda.</p>
                  </div>
                ) : (
                  savedBlobs.map((blob) => (
                    <div 
                      key={blob.id}
                      className="group relative bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-3 transition-all cursor-pointer"
                      onClick={() => loadBlob(blob)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-black/20 flex items-center justify-center">
                          <svg viewBox="0 0 200 200" className="w-10 h-10">
                            <path fill={blob.color} d={blob.svgPath} />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-mono opacity-80 truncate uppercase">{blob.color}</p>
                          <p className="text-[10px] opacity-40">
                            {blob.timestamp?.toDate().toLocaleDateString()}
                          </p>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(blob.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-2 hover:text-red-400 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <button 
                onClick={() => setShowGallery(false)}
                className="mt-4 w-full py-2 text-xs font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
              >
                Voltar ao Editor
              </button>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-white/10">
            {user ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={user.photoURL || ''} alt="" className="w-8 h-8 rounded-full border border-white/20" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate">{user.displayName}</p>
                    <p className="text-[10px] opacity-40 truncate">{user.email}</p>
                  </div>
                </div>
                <button onClick={handleLogout} className="p-2 text-white/40 hover:text-white transition-colors">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 border border-white/10"
              >
                <LogIn className="w-4 h-4" />
                Entrar com Google
              </button>
            )}
          </div>
        </aside>

        {/* Canvas Area */}
        <main className="canvas-area relative flex items-center justify-center p-8 bg-black/20">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#ff0080]/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#7928ca]/10 blur-[120px] rounded-full" />
          </div>

          <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center">
            <svg
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            >
              <AnimatePresence mode="wait">
                <motion.path
                  key={path}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.1, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 100, damping: 15 }}
                  fill={color}
                  d={path}
                />
              </AnimatePresence>
            </svg>
          </div>

          <div className="absolute bottom-8 right-8 flex items-center gap-2 opacity-40 hover:opacity-100 transition-opacity">
            <Cloud className={cn("w-4 h-4", user && "text-green-400")} />
            <span className="text-[10px] uppercase tracking-widest font-bold">
              {user ? 'Cloud Sync Active' : 'Offline Mode'}
            </span>
          </div>
        </main>
      </div>
    </div>
  );
}
