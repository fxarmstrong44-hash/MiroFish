"use client";

import { FileKey, Upload, File, Folder } from "lucide-react";

export default function VaultPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#c9a84c]/10"><FileKey className="w-6 h-6 text-[#c9a84c]" /></div>
          <div>
            <h1 className="text-xl font-bold text-white">Execution Vault</h1>
            <p className="text-xs text-white/40">Contracts, documents, and professional contacts</p>
          </div>
        </div>
        <button className="btn-primary text-sm flex items-center gap-2"><Upload className="w-4 h-4" /> Upload</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Contracts", count: 0, icon: File },
          { label: "Tax Documents", count: 0, icon: Folder },
          { label: "Legal", count: 0, icon: FileKey },
        ].map((cat) => (
          <div key={cat.label} className="glass p-5 text-center cursor-pointer hover:border-[#c9a84c]/30 transition">
            <cat.icon className="w-8 h-8 text-[#c9a84c]/50 mx-auto mb-2" />
            <div className="font-medium text-white">{cat.label}</div>
            <div className="text-xs text-white/40">{cat.count} documents</div>
          </div>
        ))}
      </div>

      <div className="glass p-8 text-center text-white/30">
        <p>Your vault is empty. Upload documents to get started.</p>
      </div>
    </div>
  );
}
