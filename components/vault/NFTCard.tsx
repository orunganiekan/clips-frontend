import React from "react";
import { sanitize } from "@/app/lib/sanitize";

interface NFTCardProps {
  id: string;
  title: string;
  thumbnail: string;
  viralityScore: number;
  mintStatus: "pending" | "minted" | "listed" | "failed";
  onAction?: (id: string) => void;
}

export default function NFTCard({ id, title, thumbnail, viralityScore, mintStatus, onAction }: NFTCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400";
      case "minted":
        return "bg-green-500/20 text-green-400";
      case "listed":
        return "bg-blue-500/20 text-blue-400";
      case "failed":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getActionLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Mint";
      case "minted":
        return "List";
      case "listed":
        return "View";
      case "failed":
        return "Retry";
      default:
        return "View";
    }
  };

  return (
    <div className="bg-input border border-white/10 rounded-[20px] overflow-hidden hover:border-brand/50 transition-colors">
      {/* Thumbnail */}
      <div className="aspect-video w-full relative">
        <img
          src={thumbnail}
          alt={sanitize(title)}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(mintStatus)}`}>
            {mintStatus}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <h3 className="text-white font-bold text-[14px] truncate">{sanitize(title)}</h3>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-brand" />
            <span className="text-muted text-[12px]">Virality: {viralityScore}</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onAction?.(id)}
          className="w-full bg-brand hover:bg-brand-hover text-black py-2.5 rounded-xl font-bold text-[13px] transition-all active:scale-[0.98]"
        >
          {getActionLabel(mintStatus)}
        </button>
      </div>
    </div>
  );
}
