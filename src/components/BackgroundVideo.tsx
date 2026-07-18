import React from "react";

export default function BackgroundVideo() {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      {/* Background Video Layer */}
      <video
        autoPlay
        loop
        muted
        playsInline
        referrerPolicy="no-referrer"
        className="absolute top-0 left-0 w-full h-full object-cover opacity-[0.12] mix-blend-multiply"
        src="https://assets.mixkit.co/videos/preview/mixkit-abstract-background-of-flowing-glowing-lines-41586-large.mp4"
      />

      {/* CSS-Only Ambient 3D Glowing Elements (100% reliable fallback & enhancer) */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Deep light glows */}
        <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[50%] rounded-full bg-[#5B5FEF]/10 blur-[140px] animate-pulse" style={{ animationDuration: "12s" }} />
        <div className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[50%] rounded-full bg-[#FF8F70]/8 blur-[160px] animate-pulse" style={{ animationDuration: "16s" }} />
        <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] rounded-full bg-[#B8A7FF]/8 blur-[130px] animate-pulse" style={{ animationDuration: "10s" }} />

        {/* Isometric Grid Background Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#5b5fef/0.03_1px,transparent_1px)] [background-size:24px_24px] opacity-70" />
      </div>

      {/* Solid to Transparent Gradients for Pristine Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FAF7F2]/80 via-[#FAF7F2]/95 to-[#FAF7F2]" />
      <div className="absolute inset-0 bg-radial from-transparent via-[#FAF7F2]/10 to-[#FAF7F2]/30" />
    </div>
  );
}

