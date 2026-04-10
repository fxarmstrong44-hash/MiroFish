"use client";

import { useState } from "react";
import { FileKey, Upload, File, Folder, Shield, Download, ExternalLink } from "lucide-react";

const LEGAL_TEMPLATES = [
  { name: "Investment Agreement", description: "Standard investment agreement template for deal structuring", category: "contract" },
  { name: "Terms of Service", description: "Platform terms of service for Vaultr users", category: "legal" },
  { name: "Privacy Policy", description: "POPIA-compliant privacy policy", category: "legal" },
  { name: "NDA Template", description: "Non-disclosure agreement for deal discussions", category: "contract" },
];

export default function VaultPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = [
    { label: "Contracts", count: 2, icon: File, key: "contract" },
    { label: "Tax Documents", count: 0, icon: Folder, key: "tax" },
    { label: "Legal", count: 2, icon: FileKey, key: "legal" },
  ];

  const filteredTemplates = activeCategory
    ? LEGAL_TEMPLATES.filter((t) => t.category === activeCategory)
    : LEGAL_TEMPLATES;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#c9a84c]/10"><FileKey className="w-6 h-6 text-[#c9a84c]" /></div>
          <div>
            <h1 className="text-xl font-bold text-white">Execution Vault</h1>
            <p className="text-xs text-white/40">Contracts, documents, legal templates, and professional contacts</p>
          </div>
        </div>
        <button className="btn-primary text-sm flex items-center gap-2"><Upload className="w-4 h-4" /> Upload</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.label}
            onClick={() => setActiveCategory(activeCategory === cat.key ? null : cat.key)}
            className={`glass p-5 text-center cursor-pointer transition ${activeCategory === cat.key ? "border-[#c9a84c]/50 bg-[#c9a84c]/5" : "hover:border-[#c9a84c]/30"}`}
          >
            <cat.icon className="w-8 h-8 text-[#c9a84c]/50 mx-auto mb-2" />
            <div className="font-medium text-white">{cat.label}</div>
            <div className="text-xs text-white/40">{cat.count} documents</div>
          </div>
        ))}
      </div>

      {/* Legal Templates Section */}
      <div className="glass p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-[#c9a84c]" />
          <h2 className="font-semibold text-white">Legal Templates</h2>
          <span className="text-xs text-white/30 ml-auto">Powered by OpenClaw</span>
        </div>
        <div className="space-y-3">
          {filteredTemplates.map((template) => (
            <div key={template.name} className="glass-subtle p-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-white">{template.name}</div>
                <div className="text-xs text-white/40">{template.description}</div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-[#c9a84c] transition">
                  <Download className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-[#c9a84c] transition">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload area */}
      <div className="glass p-8 text-center text-white/30 border-dashed border-2 border-white/10 rounded-xl">
        <Upload className="w-8 h-8 mx-auto mb-3 text-white/20" />
        <p>Drag and drop files here, or click Upload to add documents.</p>
        <p className="text-xs mt-2">Supports PDF, DOCX, and image files. Stored securely in Google Cloud.</p>
      </div>
    </div>
  );
}
