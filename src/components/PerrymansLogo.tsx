import React from "react";

interface PerrymansLogoProps {
  className?: string; // Overall wrapper classes
  iconSize?: number;  // Size of the icon graphic
  showText?: boolean; // Whether to display the text next to/below the logo
  layout?: "horizontal" | "vertical"; // Display layout
  textColorMode?: "light" | "dark" | "gold"; // Text color style
}

export default function PerrymansLogo({
  className = "",
  iconSize = 48,
  showText = true,
  layout = "horizontal",
  textColorMode = "dark",
}: PerrymansLogoProps) {
  // exact corporate deep-forest green matching the provided logo image
  let brandTextColor = "text-[#0e432c]";
  let assetTextColor = "text-[#0e432c]";

  if (textColorMode === "light") {
    brandTextColor = "text-white";
    assetTextColor = "text-emerald-400";
  } else if (textColorMode === "gold") {
    brandTextColor = "text-[#c29b38]";
    assetTextColor = "text-[#a37e28]";
  }

  // Generate an elegant centering layout
  const overallLayout = layout === "vertical" ? "flex-col text-center" : "flex-row text-left";

  return (
    <div className={`flex items-center gap-2.5 font-sans ${overallLayout} ${className}`}>
      {/* Brand Typography matching the exact luxury serif design & letterspacing of the image */}
      {showText && (
        <div className="flex flex-col justify-center leading-none">
          <span className={`font-sans font-extrabold tracking-tight text-xl sm:text-2xl ${brandTextColor}`}>
            Perryman’s
          </span>
          <span className={`font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.38em] font-extrabold mt-1.5 ${assetTextColor} md:tracking-[0.44em]`}>
            Asset
          </span>
        </div>
      )}
    </div>
  );
}
