"use client";

import { useState, useEffect } from "react";
import defaultData from "@/data/content.json";
import { saveContentAction, uploadImageAction } from "./actions";
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
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex items-center gap-4">
        {value && (
          <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1">
          <input 
            type="file" 
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100 transition-all cursor-pointer"
          />
          {isUploading && <p className="text-xs text-blue-600 mt-1 animate-pulse font-medium">Uploading to Cloudinary...</p>}
        </div>
      </div>
    </div>
  );
};

// --- Main Page ---

type SectionKey = keyof typeof defaultData.theme.sections;

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("design");
  const [content, setContent] = useState<any>(defaultData);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    async function fetchDB() {
      const { data } = await supabase.from("site_settings").select("payload").eq("id", 1).single();
      if (data && data.payload) {
        setContent(data.payload);
      }
    }
    fetchDB();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage("");
    const result = await saveContentAction(content);
    if (result.success) {
      setMessage("Saved to Supabase successfully!");
      setTimeout(() => setMessage(""), 3000);
    } else {
      setMessage("Error saving data.");
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
    { id: "advanced", label: "Advanced JSON", icon: "⚙️" },
  ];

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
        fixed md:sticky top-0 left-0 h-screen w-64 bg-white border-r z-50 transition-transform duration-300
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <div className="p-8">
          <h1 className="text-2xl font-black tracking-tighter text-blue-600 hidden md:block">Wedding Admin</h1>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-1 md:block hidden">Titis & Tyara Edition</p>
        </div>

        <nav className="mt-4 px-4 space-y-1">
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

        <div className="absolute bottom-0 left-0 w-full p-6 border-t">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save All Changes"}
          </button>
          {message && <p className="text-[10px] text-center mt-2 font-bold text-green-600 uppercase tracking-tighter">{message}</p>}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-12 overflow-y-auto max-w-5xl mx-auto w-full">
        <header className="mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="min-w-0">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 capitalize tracking-tight leading-tight">{navItems.find(i => i.id === activeTab)?.label}</h2>
            <p className="text-gray-500 text-sm mt-2 max-w-md">Manage your wedding invitation details dynamically.</p>
          </div>
          <div className="shrink-0">
            <a href="/" target="_blank" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors whitespace-nowrap">
              View Live Site ↗
            </a>
          </div>
        </header>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {activeTab === "design" && (
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">Global Palette</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                            onChange={(url) => setContent({...content, theme: {...content.theme, sections: {...content.theme.sections, [secKey]: {...content.theme.sections[secKey as SectionKey], backgroundImage: url}}}})}
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
                  <input type="datetime-local" value={content.hero.date.split('T')[0]} onChange={(e) => setContent({...content, hero: {...content.hero, date: e.target.value + "T00:00:00Z"}})} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-sm" />
                </div>
              </div>
              <ImageUpload 
                 label="Hero Landing Photo"
                 value={content.hero.backgroundImage}
                 onChange={(url) => setContent({...content, hero: {...content.hero, backgroundImage: url}})}
              />
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
                  <h3 className="text-lg font-bold mb-6">{event.title}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-600 mb-2">Event Title</label>
                      <input type="text" value={event.title} onChange={(e) => {
                        const newEvents = [...content.events];
                        newEvents[idx].title = e.target.value;
                        setContent({...content, events: newEvents});
                      }} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-600 mb-2">Time Range</label>
                      <input type="text" value={event.time} onChange={(e) => {
                        const newEvents = [...content.events];
                        newEvents[idx].time = e.target.value;
                        setContent({...content, events: newEvents});
                      }} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-sm" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-600 mb-2">Venue Name</label>
                      <input type="text" value={event.locationName} onChange={(e) => {
                        const newEvents = [...content.events];
                        newEvents[idx].locationName = e.target.value;
                        setContent({...content, events: newEvents});
                      }} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-sm" />
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

        </div>
      </main>
    </div>
  );
}
