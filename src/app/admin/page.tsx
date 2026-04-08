"use client";

import { useState, useEffect } from "react";
import defaultData from "@/data/content.json";
import { saveContentAction, uploadImageAction, uploadAudioAction, deleteWishAction } from "./actions";
import { supabase } from "@/lib/supabase";

// --- Components ---

const ImageUpload = ({ 
  label, 
  value, 
  onChange, 
  onUploadStart, 
  onUploadEnd 
}: { 
  label: string; 
  value: string; 
  onChange: (url: string) => void;
  onUploadStart?: () => void;
  onUploadEnd?: () => void;
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    onUploadStart?.();

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        const result = await uploadImageAction(base64);
        if (result.success && result.url) {
          onChange(result.url);
        } else {
          alert("Upload failed. Check console for details.");
        }
        setIsUploading(false);
        onUploadEnd?.();
      };
    } catch (error) {
      console.error(error);
      setIsUploading(false);
      onUploadEnd?.();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</label>
        {value && !isUploading && (
          <button 
            type="button"
            onClick={() => onChange("")}
            className="text-[9px] font-black text-red-400 uppercase tracking-widest hover:text-red-600 transition-colors"
          >
            ✕ Remove Photo
          </button>
        )}
      </div>
      
      <div className="flex items-center gap-4 group">
        <div className={`relative w-24 h-24 rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center shrink-0 transition-all ${isUploading ? 'ring-2 ring-blue-500 animate-pulse' : ''}`}>
          {value ? (
            <>
              <img src={value} alt="Preview" className={`w-full h-full object-cover transition-opacity ${isUploading ? 'opacity-30' : 'opacity-100'}`} />
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm">
                  <span className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </>
          ) : (
            <div className="text-xl text-gray-300">🖼️</div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <input 
            type="file" 
            accept="image/*"
            disabled={isUploading}
            onChange={handleFileChange}
            className="block w-full text-xs text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-xl file:border-0
              file:text-[10px] file:font-black file:uppercase
              file:bg-gray-900 file:text-white
              hover:file:bg-blue-600 file:transition-all cursor-pointer
              disabled:opacity-50"
          />
          {isUploading && <p className="text-[9px] text-blue-600 mt-2 font-black uppercase tracking-widest animate-pulse">Processing High-Res Upload...</p>}
          {!value && !isUploading && <p className="text-[9px] text-gray-400 mt-2 italic">No photo selected. Reverting to color.</p>}
        </div>
      </div>
    </div>
  );
};

// --- Main Page ---

type SectionKey = keyof typeof defaultData.theme.sections;

export default function AdminPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [wishes, setWishes] = useState<any[]>([]);

  const [activeTab, setActiveTab] = useState("design");
  const [content, setContent] = useState<any>(defaultData);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [musicUploading, setMusicUploading] = useState(false);

  useEffect(() => {
    // Check if previously authorized in this session
    const auth = sessionStorage.getItem("admin_auth");
    if (auth === "true") setIsAuthorized(true);
  }, []);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === "2907") {
      setIsAuthorized(true);
      sessionStorage.setItem("admin_auth", "true");
      setError("");
    } else {
      setError("Incorrect PIN. Please try again.");
      setPin("");
    }
  };

  useEffect(() => {
    if (!isAuthorized) return;
    async function fetchDB() {
      const { data } = await supabase.from("site_settings").select("payload").eq("id", 1).single();
      if (data && data.payload) {
        setContent(data.payload);
      }
      
      const { data: wishesData } = await supabase.from("wedding_wishes").select("*").order("created_at", { ascending: false });
      if (wishesData) {
        setWishes(wishesData);
      }
    }
    fetchDB();
  }, [isAuthorized]);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage("");
    const result = await saveContentAction(content);
    if (result.success) {
      setMessage("✓ Saved to Supabase successfully!");
      setTimeout(() => setMessage(""), 3000);
    } else {
      setMessage(`✕ ERROR: ${result.error || "Failed to save"}`);
    }
    setIsSaving(false);
  };

  const navItems = [
    { id: "design", label: "Design Studio", icon: "🎨" },
    { id: "hero", label: "Hero Details", icon: "✨" },
    { id: "couple", label: "Couple Info", icon: "❤️" },
    { id: "events", label: "Events Schedule", icon: "📅" },
    { id: "gallery", label: "Gallery Momen", icon: "📸" },
    { id: "loveStory", label: "Cerita Cinta", icon: "📜" },
    { id: "banking", label: "Amplop Digital", icon: "💳" },
    { id: "music", label: "Background Music", icon: "🎵" },
    { id: "rsvp", label: "Guest Wishes", icon: "💌" },
    { id: "advanced", label: "Advanced JSON", icon: "⚙️" },
  ];

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 font-sans">
        <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm animate-in fade-in zoom-in duration-300">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">
              🔒
            </div>
            <h1 className="text-2xl font-black tracking-tight text-gray-900">Protected Access</h1>
            <p className="text-gray-500 text-sm mt-2 font-medium uppercase tracking-widest text-[10px]">Admin Studio Entrance</p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Secure PIN</label>
              <input 
                type="password" 
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••"
                maxLength={4}
                autoFocus
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-center text-2xl tracking-[1em] font-black focus:ring-4 ring-blue-500/10 outline-none transition-all"
              />
            </div>
            {error && <p className="text-red-500 text-[10px] font-bold text-center uppercase tracking-tighter">{error}</p>}
            <button 
              type="submit"
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-blue-200"
            >
              UNLOCK STUDIO
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <a href="/" className="text-gray-400 text-[10px] font-bold uppercase tracking-widest hover:text-blue-600 transition-colors">
              ← Back to Invitation
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row text-gray-900 font-sans">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b p-4 flex items-center justify-between sticky top-0 z-50">
        <h1 className="font-bold text-xl text-blue-600">Admin Studio</h1>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-gray-100 rounded-lg">
          {isSidebarOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 md:hidden backdrop-blur-sm" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen w-64 bg-white border-r z-50 transition-transform duration-300 flex flex-col
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <div className="p-8 shrink-0">
          <h1 className="text-2xl font-black tracking-tighter text-blue-600 hidden md:block">Wedding Admin</h1>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-1 md:block hidden">Titis & Tyara Edition</p>
        </div>

        <nav className="mt-4 px-4 space-y-1 flex-1 overflow-y-auto pb-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                ${activeTab === item.id ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "text-gray-600 hover:bg-gray-100"}
              `}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t bg-white shrink-0">
          {isSaving ? (
            <button disabled className="w-full py-4 bg-gray-400 text-white rounded-2xl font-black text-sm animate-pulse cursor-wait">
              SAVING...
            </button>
          ) : (
            <button 
              onClick={handleSave}
              className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-2"
            >
              💾 Save All Changes
            </button>
          )}
          
          {message && (
            <div className={`mt-3 p-3 rounded-xl border text-[10px] font-black uppercase tracking-tighter text-center leading-tight
              ${message.includes("✓") ? "bg-green-50 border-green-200 text-green-600" : "bg-red-50 border-red-200 text-red-600 animate-shake"}
            `}>
              {message}
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-12 overflow-y-auto max-w-5xl mx-auto w-full">
        <header className="mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="min-w-0">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 capitalize tracking-tight leading-tight">{navItems.find(i => i.id === activeTab)?.label}</h2>
            <p className="text-gray-500 text-sm mt-2 max-w-md">Manage your wedding invitation details dynamically.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "💾 Save Changes"}
            </button>
            <a href="/" target="_blank" className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 transition-all whitespace-nowrap">
              View Site ↗
            </a>
          </div>
        </header>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {activeTab === "design" && (
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">Global Palette</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="min-w-0">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Primary Background</label>
                    <div className="flex gap-2">
                      <input type="color" value={content.theme.global.primaryBg} onChange={(e) => setContent({...content, theme: {...content.theme, global: {...content.theme.global, primaryBg: e.target.value}}})} className="w-12 h-10 p-1 rounded-lg border border-gray-200 cursor-pointer shrink-0" />
                      <input type="text" value={content.theme.global.primaryBg} onChange={(e) => setContent({...content, theme: {...content.theme, global: {...content.theme.global, primaryBg: e.target.value}}})} className="w-full p-2 border border-gray-200 rounded-lg text-sm uppercase font-mono" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Text Color</label>
                    <div className="flex gap-2">
                      <input type="color" value={content.theme.global.textColor} onChange={(e) => setContent({...content, theme: {...content.theme, global: {...content.theme.global, textColor: e.target.value}}})} className="w-12 h-10 p-1 rounded-lg border border-gray-200 cursor-pointer shrink-0" />
                      <input type="text" value={content.theme.global.textColor} onChange={(e) => setContent({...content, theme: {...content.theme, global: {...content.theme.global, textColor: e.target.value}}})} className="w-full p-2 border border-gray-200 rounded-lg text-sm uppercase font-mono" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Accent Color</label>
                    <div className="flex gap-2">
                      <input type="color" value={content.theme.global.accentColor} onChange={(e) => setContent({...content, theme: {...content.theme, global: {...content.theme.global, accentColor: e.target.value}}})} className="w-12 h-10 p-1 rounded-lg border border-gray-200 cursor-pointer shrink-0" />
                      <input type="text" value={content.theme.global.accentColor} onChange={(e) => setContent({...content, theme: {...content.theme, global: {...content.theme.global, accentColor: e.target.value}}})} className="w-full p-2 border border-gray-200 rounded-lg text-sm uppercase font-mono" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Guide Icon</label>
                    <select 
                      value={content.theme.global.guideIcon || 'plane'}
                      onChange={(e) => setContent({...content, theme: {...content.theme, global: {...content.theme.global, guideIcon: e.target.value}}})}
                      className="w-full p-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 uppercase font-mono"
                    >
                      <option value="plane">Paper Plane</option>
                      <option value="leaf">Leaf</option>
                      <option value="feather">Feather</option>
                      <option value="sparkles">Sparkles</option>
                      <option value="custom">Custom Image</option>
                    </select>
                  </div>
                </div>
                {content.theme.global.guideIcon === 'custom' && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Custom Guide Image</label>
                    <p className="text-xs text-gray-500 mb-4">Specs: SVG or transparent PNG recommended. Max size: 100x100px. Upload below.</p>
                    <ImageUpload 
                      label="Upload Guide Icon"
                      value={content.theme.global.guideImage || ''}
                      onChange={(url) => setContent({...content, theme: {...content.theme, global: {...content.theme.global, guideImage: url}}})}
                    />
                  </div>
                )}
                <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="min-w-0">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Icon Rotation (Degrees)</label>
                    <input 
                      type="number" 
                      value={content.theme.global.guideRotation || 0}
                      onChange={(e) => setContent({...content, theme: {...content.theme, global: {...content.theme.global, guideRotation: parseInt(e.target.value) || 0}}})}
                      className="w-full p-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 font-mono"
                    />
                  </div>
                  <div className="min-w-0">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Icon Animation</label>
                    <select 
                      value={content.theme.global.guideAnimation || 'breathing'}
                      onChange={(e) => setContent({...content, theme: {...content.theme, global: {...content.theme.global, guideAnimation: e.target.value}}})}
                      className="w-full p-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 uppercase font-mono"
                    >
                      <option value="breathing">Breathing</option>
                      <option value="spinning">Spinning</option>
                      <option value="wobbling">Wobbling (Leaf)</option>
                      <option value="flipping">Flipping (Coin)</option>
                      <option value="fluttering">Fluttering (Butterfly)</option>
                      <option value="floating">Floating (Balloon)</option>
                      <option value="twinkling">Twinkling (Star)</option>
                      <option value="barrel-roll">Barrel Roll</option>
                      <option value="zigzag">Zigzag</option>
                      <option value="heartbeat">Heartbeat</option>
                      <option value="pendulum">Pendulum</option>
                      <option value="bouncing">Bouncing</option>
                    </select>
                  </div>
                  <div className="min-w-0">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 font-mono">Animation Speed</label>
                    <select 
                      value={content.theme.global.guideAnimationSpeed || 'normal'}
                      onChange={(e) => setContent({...content, theme: {...content.theme, global: {...content.theme.global, guideAnimationSpeed: e.target.value}}})}
                      className="w-full p-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 uppercase font-mono"
                    >
                      <option value="slow">Slow</option>
                      <option value="normal">Normal</option>
                      <option value="fast">Fast</option>
                    </select>
                  </div>
                  <div className="min-w-0 sm:col-span-3 lg:col-span-1">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 font-mono">
                      Flight Start Trigger: {100 - (content.theme.global.guideTrigger || 10)}% (Higher = Earlier)
                    </label>
                    <input 
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={100 - (content.theme.global.guideTrigger || 10)}
                      onChange={(e) => setContent({...content, theme: {...content.theme, global: {...content.theme.global, guideTrigger: 100 - parseInt(e.target.value)}}})}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-[8px] text-gray-400 uppercase mt-1 px-1">
                      <span>Late</span>
                      <span>Early</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-6">Section Specifics</h3>
                <div className="divide-y divide-gray-100">
                  {Object.keys(content.theme.sections).map((secKey) => (
                    <div key={secKey} className="py-6 first:pt-0 last:pb-0 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                      <div className="min-w-0">
                        <h4 className="font-bold text-gray-900 capitalize text-base">{secKey} Background</h4>
                        <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-bold">Section Template Styling</p>
                        <select 
                          value={content.theme.sections[secKey as SectionKey].backgroundType}
                          onChange={(e) => setContent({...content, theme: {...content.theme, sections: {...content.theme.sections, [secKey]: {...content.theme.sections[secKey as SectionKey], backgroundType: e.target.value}}}})}
                          className="mt-4 w-full p-3 border border-gray-200 rounded-xl text-sm font-bold bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                          <option value="color">Solid Color</option>
                          <option value="image">Cloudinary Image</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-4 min-w-0">
                        {content.theme.sections[secKey as SectionKey].backgroundType === 'color' ? (
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pick Color</label>
                            <div className="flex gap-2">
                              <input type="color" value={content.theme.sections[secKey as SectionKey].backgroundColor || ""} onChange={(e) => setContent({...content, theme: {...content.theme, sections: {...content.theme.sections, [secKey]: {...content.theme.sections[secKey as SectionKey], backgroundColor: e.target.value}}}})} className="w-12 h-10 p-1 rounded-lg border border-gray-200 cursor-pointer shrink-0" />
                              <input type="text" placeholder="Hex Code" value={content.theme.sections[secKey as SectionKey].backgroundColor} onChange={(e) => setContent({...content, theme: {...content.theme, sections: {...content.theme.sections, [secKey]: {...content.theme.sections[secKey as SectionKey], backgroundColor: e.target.value}}}})} className="w-full p-2 border border-gray-200 rounded-lg text-sm uppercase font-mono" />
                            </div>
                          </div>
                        ) : (
                          <ImageUpload 
                            label="Background Photo"
                            value={content.theme.sections[secKey as SectionKey].backgroundImage || ""}
                            onChange={(url) => {
                              const newContent = {...content};
                              newContent.theme.sections[secKey as SectionKey].backgroundImage = url;
                              // Sync Hero and Splash if one is updated in Design Studio
                              // REMOVED sync logic as per user request for separate inputs
                              setContent(newContent);
                            }}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "hero" && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2">Title Prefix</label>
                  <input type="text" value={content.hero.title} onChange={(e) => setContent({...content, hero: {...content.hero, title: e.target.value}})} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2">Groom's Name</label>
                  <input type="text" value={content.hero.groomName} onChange={(e) => setContent({...content, hero: {...content.hero, groomName: e.target.value}})} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2">Bride's Name</label>
                  <input type="text" value={content.hero.brideName} onChange={(e) => setContent({...content, hero: {...content.hero, brideName: e.target.value}})} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2">Wedding Date</label>
                  <input type="date" value={(content.hero.date || "").split('T')[0]} onChange={(e) => setContent({...content, hero: {...content.hero, date: e.target.value}})} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ImageUpload 
                  label="1. Splash Screen Background"
                  value={content.theme.sections.splash.backgroundImage || ""}
                  onChange={(url) => {
                    const newContent = {...content};
                    newContent.theme.sections.splash.backgroundImage = url;
                    newContent.theme.sections.splash.backgroundType = 'image';
                    setContent(newContent);
                  }}
                />
                <ImageUpload 
                  label="2. Hero Section Background"
                  value={content.theme.sections.hero.backgroundImage || ""}
                  onChange={(url) => {
                    const newContent = {...content};
                    newContent.theme.sections.hero.backgroundImage = url;
                    newContent.theme.sections.hero.backgroundType = 'image';
                    // We also keep content.hero.backgroundImage updated as a reference
                    newContent.hero.backgroundImage = url;
                    setContent(newContent);
                  }}
                />
              </div>
            </div>
          )}

          {activeTab === "couple" && (
            <div className="space-y-8">
              {['groom', 'bride'].map((person) => (
                <div key={person} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold mb-6 capitalize">{person}'s Profile</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-600 mb-2">Full Name</label>
                        <input type="text" value={content.couple[person].fullName} onChange={(e) => setContent({...content, couple: {...content.couple, [person]: {...content.couple[person], fullName: e.target.value}}})} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-600 mb-2">Father's Name</label>
                        <input type="text" value={content.couple[person].father} onChange={(e) => setContent({...content, couple: {...content.couple, [person]: {...content.couple[person], father: e.target.value}}})} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-600 mb-2">Mother's Name</label>
                        <input type="text" value={content.couple[person].mother} onChange={(e) => setContent({...content, couple: {...content.couple, [person]: {...content.couple[person], mother: e.target.value}}})} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-600 mb-2">Instagram Handle</label>
                        <input type="text" value={content.couple[person].instagram} onChange={(e) => setContent({...content, couple: {...content.couple, [person]: {...content.couple[person], instagram: e.target.value}}})} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-sm" />
                      </div>
                    </div>
                    <ImageUpload 
                      label="Polaroid Photo"
                      value={content.couple[person].photo}
                      onChange={(url) => setContent({...content, couple: {...content.couple, [person]: {...content.couple[person], photo: url}}})}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "events" && (
            <div className="space-y-8">
              {content.events.map((event: any, idx: number) => (
                <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold mb-6">{event.title || `Event ${idx + 1}`}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-600 mb-2">Event Title</label>
                      <input type="text" value={event.title || ""} onChange={(e) => {
                        const newEvents = [...content.events];
                        newEvents[idx] = {...newEvents[idx], title: e.target.value};
                        setContent({...content, events: newEvents});
                      }} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-600 mb-2">Date</label>
                      <input type="date" value={event.date || ""} onChange={(e) => {
                        const newEvents = [...content.events];
                        newEvents[idx] = {...newEvents[idx], date: e.target.value};
                        setContent({...content, events: newEvents});
                      }} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-600 mb-2">Time Range</label>
                      <input type="text" value={event.time || ""} placeholder="08:00 - 10:00 WIB" onChange={(e) => {
                        const newEvents = [...content.events];
                        newEvents[idx] = {...newEvents[idx], time: e.target.value};
                        setContent({...content, events: newEvents});
                      }} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-600 mb-2">Venue Name</label>
                      <input type="text" value={event.locationName || ""} onChange={(e) => {
                        const newEvents = [...content.events];
                        newEvents[idx] = {...newEvents[idx], locationName: e.target.value};
                        setContent({...content, events: newEvents});
                      }} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-sm" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-600 mb-2">Full Address</label>
                      <textarea rows={2} value={event.address || ""} placeholder="Jl. Example No. 1, Kota, Provinsi" onChange={(e) => {
                        const newEvents = [...content.events];
                        newEvents[idx] = {...newEvents[idx], address: e.target.value};
                        setContent({...content, events: newEvents});
                      }} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-sm resize-none" />
                      <p className="text-[10px] text-gray-400 mt-1">This address is also used to auto-generate the embedded map preview</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-600 mb-2">Google Maps Link</label>
                      <input type="url" value={event.mapLink || ""} placeholder="https://maps.google.com/..." onChange={(e) => {
                        const newEvents = [...content.events];
                        newEvents[idx] = {...newEvents[idx], mapLink: e.target.value};
                        setContent({...content, events: newEvents});
                      }} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-sm" />
                      <p className="text-[10px] text-gray-400 mt-1">Paste the Google Maps link for the &quot;Lihat Maps&quot; button on the invitation</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "gallery" && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold mb-6">Gallery Images</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {content.gallery.map((img: string, idx: number) => (
                  <div key={idx} className="p-4 border border-gray-100 rounded-2xl bg-gray-50">
                    <ImageUpload 
                      label={`Photo #${idx + 1}`}
                      value={img}
                      onChange={(url) => {
                        const newGallery = [...content.gallery];
                        newGallery[idx] = url;
                        setContent({...content, gallery: newGallery});
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "loveStory" && (
            <div className="space-y-6">
              {content.loveStory.map((item: any, idx: number) => (
                <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-600 mb-2">Year</label>
                      <input type="text" value={item.year} onChange={(e) => {
                        const newStory = [...content.loveStory];
                        newStory[idx].year = e.target.value;
                        setContent({...content, loveStory: newStory});
                      }} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-sm" />
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-sm font-bold text-gray-600 mb-2">Headline</label>
                      <input type="text" value={item.title} onChange={(e) => {
                        const newStory = [...content.loveStory];
                        newStory[idx].title = e.target.value;
                        setContent({...content, loveStory: newStory});
                      }} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-sm" />
                    </div>
                    <div className="md:col-span-4">
                      <label className="block text-sm font-bold text-gray-600 mb-2">Description</label>
                      <textarea rows={3} value={item.description} onChange={(e) => {
                        const newStory = [...content.loveStory];
                        newStory[idx].description = e.target.value;
                        setContent({...content, loveStory: newStory});
                      }} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-sm resize-none" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "banking" && (
            <div className="space-y-6">
              {content.banking.map((bank: any, idx: number) => (
                <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">Bank Name</label>
                    <input type="text" value={bank.bank} onChange={(e) => {
                      const newBanks = [...content.banking];
                      newBanks[idx].bank = e.target.value;
                      setContent({...content, banking: newBanks});
                    }} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">Account #</label>
                    <input type="text" value={bank.accountNumber} onChange={(e) => {
                      const newBanks = [...content.banking];
                      newBanks[idx].accountNumber = e.target.value;
                      setContent({...content, banking: newBanks});
                    }} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">Account Holder</label>
                    <input type="text" value={bank.accountName} onChange={(e) => {
                      const newBanks = [...content.banking];
                      newBanks[idx].accountName = e.target.value;
                      setContent({...content, banking: newBanks});
                    }} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-sm" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "music" && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-8">
              <div>
                <h3 className="text-lg font-bold mb-2">Background Music</h3>
                <p className="text-sm text-gray-500 mb-6">Upload an MP3 file or paste a direct URL. Music auto-plays when guests open the invitation.</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Upload MP3 File</label>
                  <input
                    type="file"
                    accept="audio/*"
                    disabled={musicUploading}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setMusicUploading(true);
                      const reader = new FileReader();
                      reader.readAsDataURL(file);
                      reader.onloadend = async () => {
                        const base64 = reader.result as string;
                        const result = await uploadAudioAction(base64);
                        if (result.success && result.url) {
                          setContent({...content, music: result.url});
                        } else {
                          alert("Audio upload failed. Try pasting a URL instead.");
                        }
                        setMusicUploading(false);
                      };
                    }}
                    className="block w-full text-xs text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-xl file:border-0
                      file:text-[10px] file:font-black file:uppercase
                      file:bg-gray-900 file:text-white
                      hover:file:bg-blue-600 file:transition-all cursor-pointer
                      disabled:opacity-50"
                  />
                  {musicUploading && <p className="text-[9px] text-blue-600 mt-2 font-black uppercase tracking-widest animate-pulse">Uploading Audio to Cloud...</p>}
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1 h-[1px] bg-gray-200" />
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">OR</span>
                  <div className="flex-1 h-[1px] bg-gray-200" />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Direct URL</label>
                  <input
                    type="url"
                    value={content.music || ""}
                    onChange={(e) => setContent({...content, music: e.target.value})}
                    placeholder="https://example.com/song.mp3"
                    className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-sm"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">Direct link to an MP3 file (YouTube/Spotify links won&apos;t work)</p>
                </div>

                {content.music && (
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Preview</label>
                    <audio controls src={content.music} className="w-full" />
                    <button
                      onClick={() => setContent({...content, music: ""})}
                      className="mt-3 text-[9px] font-black text-red-400 uppercase tracking-widest hover:text-red-600 transition-colors"
                    >
                      ✕ Remove Music
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* --- RSVP & WISHES TAB --- */}
          {activeTab === "rsvp" && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-black mb-2 tracking-tight">Guest Wishes & RSVP</h2>
                <p className="text-sm text-gray-500 mb-8">Manage messages and attendance confirmations sent by guests.</p>
              </div>

              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-black tracking-widest border-b border-gray-100">
                      <tr>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Message</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {wishes.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                            No wishes received yet.
                          </td>
                        </tr>
                      ) : (
                        wishes.map((wish) => (
                          <tr key={wish.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-gray-400 font-mono text-[11px]">
                              {new Date(wish.created_at).toLocaleDateString("id-ID", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                            </td>
                            <td className="px-6 py-4 font-bold max-w-[150px] truncate">{wish.name}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-block px-2 text-[10px] font-bold uppercase tracking-wider rounded-full ${wish.attendance === 'hadir' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {wish.attendance}
                              </span>
                            </td>
                            <td className="px-6 py-4 max-w-[300px] text-gray-600">
                              <p className="truncate block w-full" title={wish.message}>{wish.message}</p>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={async () => {
                                  if(confirm("Are you sure you want to delete this wish?")) {
                                    const res = await deleteWishAction(wish.id);
                                    if(res.success) {
                                      setWishes(wishes.filter(w => w.id !== wish.id));
                                    } else {
                                      alert("Failed to delete wish.");
                                    }
                                  }
                                }}
                                className="text-[10px] font-black text-red-400 uppercase tracking-widest hover:text-red-700 transition-colors p-2 bg-red-50 rounded-lg"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
