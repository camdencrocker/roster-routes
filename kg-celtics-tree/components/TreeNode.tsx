"use client";

import React from "react";
import { Handle, Position } from "@xyflow/react";
import { Ticket, User } from "lucide-react";
import { getHeadshotUrl, getHeadshotFallback } from "@/lib/headshots";

const CARD_W = 148;
const CARD_H = 168;
const HEADSHOT_SIZE = 80;

export function PlayerNode({ id, data }: { id: string; data: any }) {
  const nbaId = data.nbaId ?? data.id;
  const name = data.label ?? data.name ?? "—";
  const teamColor = data.teamColor ?? "#007A33";
  const imgSrc = nbaId ? getHeadshotUrl(nbaId) : getHeadshotFallback();

  return (
    <div
      className="rounded-[20px] overflow-hidden border border-white/10 bg-black/90 flex flex-col items-center shadow-xl"
      style={{ width: CARD_W, height: CARD_H }}
    >
      <Handle id="topTarget" type="target" position={Position.Top} className="!bg-transparent !border-0 !w-0 !h-0" style={{ left: "50%" }} />
      <Handle id="bottom" type="source" position={Position.Bottom} className="!bg-transparent !border-0 !w-0 !h-0" style={{ left: "50%" }} />
      {data.teamBadge && (
        <div
          className="w-full px-2 py-0.5 text-center text-xs font-mono font-bold uppercase"
          style={{ backgroundColor: teamColor, color: "#fff" }}
        >
          → {data.teamBadge}
        </div>
      )}
      <div className="flex justify-center pt-1 flex-1">
        <div
          className="rounded-full overflow-hidden border border-white/10 shrink-0"
          style={{ width: HEADSHOT_SIZE, height: HEADSHOT_SIZE }}
        >
          <img
            src={imgSrc}
            className="w-full h-full object-cover object-center"
            onError={(e) => ((e.target as HTMLImageElement).src = getHeadshotFallback())}
            alt=""
          />
        </div>
      </div>
      <div className="w-full px-2 py-2 text-center border-t border-white/10">
        <div className="text-sm font-mono font-bold text-white truncate">{name}</div>
      </div>
    </div>
  );
}

export function PickNode({ id, data }: { id: string; data: any }) {
  const label = data.label ?? data.description ?? "Pick";

  return (
    <div
      className="rounded-[20px] border border-zinc-500/50 bg-black/90 flex flex-col items-center justify-center py-3 px-4 shadow-xl"
      style={{ width: 140, height: 88 }}
    >
      <Handle id="topTarget" type="target" position={Position.Top} className="!bg-transparent !border-0 !w-0 !h-0" />
      <Handle id="bottom" type="source" position={Position.Bottom} className="!bg-transparent !border-0 !w-0 !h-0" />
      <Ticket size={18} className="text-zinc-500 mb-1" />
      <div className="text-sm font-mono font-bold text-zinc-200 uppercase">{label}</div>
    </div>
  );
}

export function DateNode({ id, data }: { id: string; data: any }) {
  const date = data.label ?? "—";
  const teams = data.teams ?? "—";

  return (
    <div className="rounded-lg border border-white/20 bg-black/60 flex flex-col items-center justify-center py-2 px-3 min-w-[140px]">
      <Handle id="topTarget" type="target" position={Position.Top} className="!bg-transparent !border-0 !w-0 !h-0" style={{ left: "50%" }} />
      <Handle id="bottom" type="source" position={Position.Bottom} className="!bg-transparent !border-0 !w-0 !h-0" style={{ left: "50%" }} />
      <span className="text-sm font-mono font-semibold text-zinc-200 uppercase">{date}</span>
      <span className="text-xs font-mono text-zinc-400 mt-0.5">{teams}</span>
    </div>
  );
}
