'use client';

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Ticket } from 'lucide-react';

type UniversalCardProps = {
  label: string;
  subLabel?: string;
  status?: string;
  restriction?: string;
  footer?: string;
  footerSub?: string;
  className?: string;
  children?: React.ReactNode;
};

/**
 * Universal card for pick / draft assets.
 * Single-line header, optional subLabel, stacked footer (footer + footerSub) with visual hierarchy.
 */
export function UniversalCard({
  label,
  subLabel,
  status,
  restriction,
  footer,
  footerSub,
  className = '',
  children,
}: UniversalCardProps) {
  const isAmberStatus =
    status?.toUpperCase().includes('DID NOT CONVEY') ||
    status?.toUpperCase().includes('CONVERTED');

  return (
    <div
      className={`group relative w-[180px] min-w-[180px] rounded-xl bg-neutral-900 border-2 border-dashed border-zinc-500 flex flex-col items-center justify-center px-4 py-3 shadow-lg text-center ${className}`}
    >
      <div className="text-lg text-white font-mono uppercase tracking-wide font-bold leading-tight">
        {label}
      </div>
      {subLabel && (
        <div className="mt-1 text-sm text-zinc-400 font-mono">
          {subLabel}
        </div>
      )}
      {status && (
        <div
          className={`mt-2 px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wide ${
            isAmberStatus
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
              : 'bg-zinc-700/50 text-zinc-300 border border-zinc-500/50'
          }`}
        >
          {status}
        </div>
      )}
      {(footer != null || footerSub != null) && (
        <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[20px] bg-[#1a1a1a] text-zinc-400 font-mono text-sm">
          <Ticket size={14} className="text-zinc-500 shrink-0" />
          <span className="uppercase tracking-wide">
            {footer}
            {footerSub != null && ` · ${footerSub}`}
          </span>
        </div>
      )}
      {restriction && !footer && !footerSub && (
        <div className="mt-2 text-lg font-mono leading-tight text-center text-zinc-400">
          {restriction}
        </div>
      )}
      {children}
      <Handle type="target" position={Position.Top} className="!bg-transparent !border-0 !w-0 !h-0" />
      <Handle id="left" type="target" position={Position.Left} className="!bg-transparent !border-0 !w-0 !h-0" />
      <Handle type="source" position={Position.Bottom} className="!bg-transparent !border-0 !w-0 !h-0" />
    </div>
  );
}
