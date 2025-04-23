"use client";

import { useEffect, useRef } from "react";

export default function HomeBackgroundWrapper({ children }: { children: React.ReactNode }) {
  const vantaRef = useRef<HTMLDivElement>(null);
  const effectRef = useRef<any>(null);

  useEffect(() => {
    const loadVanta = async () => {
      const p5Script = document.createElement("script");
      p5Script.src = "https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.min.js";
      p5Script.async = true;

      const vantaScript = document.createElement("script");
      vantaScript.src = "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.topology.min.js";
      vantaScript.async = true;

      document.body.appendChild(p5Script);
      document.body.appendChild(vantaScript);

      vantaScript.onload = () => {
        if (typeof window !== "undefined" && (window as any).VANTA && vantaRef.current && !effectRef.current) {
          effectRef.current = (window as any).VANTA.TOPOLOGY({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 150.0,
            minWidth: 150.0,
            scale: 1.0,
            scaleMobile: 1.0,
            backgroundColor: 0xc4d4a9,
            color: 0x89964e,
          });
        }
      };
    };

    loadVanta();

    return () => {
      if (effectRef.current) effectRef.current.destroy();
    };
  }, []);

  return (
    <div
      ref={vantaRef}
      className="min-h-[90vh] w-full flex items-center justify-center"
    >
      {children}
    </div>
  );  
}
