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
            <h2 className="text-xl font-semibold mb-4">Hero Section</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Groom's Name</label>
                <input 
                  type="text" 
                  value={content.hero.groomName}
                  onChange={(e) => setContent({...content, hero: {...content.hero, groomName: e.target.value}})}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bride's Name</label>
                <input 
                  type="text" 
                  value={content.hero.brideName}
                  onChange={(e) => setContent({...content, hero: {...content.hero, brideName: e.target.value}})}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Background Image URL</label>
                <input 
                  type="text" 
                  value={content.hero.backgroundImage}
                  onChange={(e) => setContent({...content, hero: {...content.hero, backgroundImage: e.target.value}})}
                  className="w-full p-2 border rounded-md"
                />
              </div>
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
