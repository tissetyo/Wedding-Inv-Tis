"use client";

import { useState } from "react";
import data from "@/data/content.json";
import { saveContentAction } from "./actions";

export default function AdminPage() {
  const [content, setContent] = useState(data);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    setIsSaving(true);
    setMessage("");
    const result = await saveContentAction(content);
    if (result.success) {
      setMessage("Data saved successfully!");
    } else {
      setMessage("Error saving data.");
    }
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>
        
        <div className="space-y-6">
          <section className="bg-gray-100 p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Design Studio (Global Theme)</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Primary Background</label>
                <div className="flex gap-2">
                  <input type="color" value={content.theme.global.primaryBg} onChange={(e) => setContent({...content, theme: {...content.theme, global: {...content.theme.global, primaryBg: e.target.value}}})} className="w-12 h-10 p-1 rounded border" />
                  <input type="text" value={content.theme.global.primaryBg} onChange={(e) => setContent({...content, theme: {...content.theme, global: {...content.theme.global, primaryBg: e.target.value}}})} className="w-full p-2 border rounded-md" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Text Color</label>
                <div className="flex gap-2">
                  <input type="color" value={content.theme.global.textColor} onChange={(e) => setContent({...content, theme: {...content.theme, global: {...content.theme.global, textColor: e.target.value}}})} className="w-12 h-10 p-1 rounded border" />
                  <input type="text" value={content.theme.global.textColor} onChange={(e) => setContent({...content, theme: {...content.theme, global: {...content.theme.global, textColor: e.target.value}}})} className="w-full p-2 border rounded-md" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Accent Color</label>
                <div className="flex gap-2">
                  <input type="color" value={content.theme.global.accentColor} onChange={(e) => setContent({...content, theme: {...content.theme, global: {...content.theme.global, accentColor: e.target.value}}})} className="w-12 h-10 p-1 rounded border" />
                  <input type="text" value={content.theme.global.accentColor} onChange={(e) => setContent({...content, theme: {...content.theme, global: {...content.theme.global, accentColor: e.target.value}}})} className="w-full p-2 border rounded-md" />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-gray-100 p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Section Backgrounds</h2>
            <div className="space-y-4">
              {Object.keys(content.theme.sections).map((secKey) => (
                <div key={secKey} className="grid grid-cols-4 gap-4 items-end border-b border-gray-200 pb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 capitalize">{secKey}</label>
                    <select 
                      value={(content.theme.sections as any)[secKey].backgroundType}
                      onChange={(e) => setContent({...content, theme: {...content.theme, sections: {...content.theme.sections, [secKey]: {...(content.theme.sections as any)[secKey], backgroundType: e.target.value}}}})}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="color">Solid Color</option>
                      <option value="image">Image Upload</option>
                    </select>
                  </div>
                  
                  {(content.theme.sections as any)[secKey].backgroundType === 'color' ? (
                    <div className="col-span-3 flex gap-2">
                       <input type="color" value={(content.theme.sections as any)[secKey].backgroundColor || content.theme.global.primaryBg} onChange={(e) => setContent({...content, theme: {...content.theme, sections: {...content.theme.sections, [secKey]: {...(content.theme.sections as any)[secKey], backgroundColor: e.target.value}}}})} className="w-12 h-10 p-1 rounded border" />
                       <input type="text" placeholder="Hex override..." value={(content.theme.sections as any)[secKey].backgroundColor} onChange={(e) => setContent({...content, theme: {...content.theme, sections: {...content.theme.sections, [secKey]: {...(content.theme.sections as any)[secKey], backgroundColor: e.target.value}}}})} className="w-full p-2 border rounded-md" />
                    </div>
                  ) : (
                    <div className="col-span-3">
                       <input type="text" placeholder="Image URL (e.g. /first-screen.png)" value={(content.theme.sections as any)[secKey].backgroundImage} onChange={(e) => setContent({...content, theme: {...content.theme, sections: {...content.theme.sections, [secKey]: {...(content.theme.sections as any)[secKey], backgroundImage: e.target.value}}}})} className="w-full p-2 border rounded-md" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="bg-gray-100 p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Advanced (Raw JSON)</h2>
            <textarea 
              className="w-full p-4 border rounded-md font-mono text-sm h-64"
              value={JSON.stringify(content, null, 2)}
              onChange={(e) => {
                try {
                  setContent(JSON.parse(e.target.value));
                } catch(err) {
                  // Ignore parse errors while typing
                }
              }}
            />
          </section>
        </div>

        <div className="mt-8 flex items-center gap-4">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
          
          {message && <span className="text-sm font-medium text-green-600">{message}</span>}
          
          <div className="ml-auto">
            <a href="/" target="_blank" className="text-blue-600 hover:text-blue-800 hover:underline">
              View Website →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
