'use client';
import React, { useState } from 'react';
import { toPng } from 'html-to-image';
import { Share2, Link as LinkIcon, Loader2 } from 'lucide-react'; 

export default function DownloadBtn() {
  const [isCapturing, setIsCapturing] = useState(false);

  const handleDownload = async () => {
    const el = document.querySelector('.react-flow') as HTMLElement;
    if (!el) return;

    setIsCapturing(true);
    try {
      const dataUrl = await toPng(el, { 
        backgroundColor: '#000',
        quality: 0.92,
        pixelRatio: 1,
        cacheBust: true,
        skipFonts: true,
      });
      const link = document.createElement('a');
      link.download = 'roster-routes-tree.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Image capture failed:', err);
      alert('Image capture failed—the tree may be too large. Try zooming in or collapsing some branches first.');
    } finally {
      setIsCapturing(false);
    }
  };

  const handleLink = () => {
    // Placeholder for your future Linktree
    window.open('https://linktr.ee/rosterroutes', '_blank');
  };

  return (
    <div className="flex gap-2">
        {/* LINKTREE BUTTON */}
        <button 
          onClick={handleLink}
          className="w-10 h-10 flex items-center justify-center bg-neutral-800 text-white rounded-full hover:bg-neutral-700 transition-all border border-white/10 shadow-xl"
          title="Linktree"
        >
          <LinkIcon size={18} />
        </button>

        {/* SAVE IMAGE BUTTON */}
        <button 
          onClick={handleDownload}
          disabled={isCapturing}
          className="w-10 h-10 flex items-center justify-center bg-white text-black rounded-full hover:bg-gray-200 transition-all shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
          title="Save Image"
        >
          {isCapturing ? <Loader2 size={18} className="animate-spin" /> : <Share2 size={18} />}
        </button>
    </div>
  );
}