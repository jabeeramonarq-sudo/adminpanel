interface AmonarqLogoProps {
  className?: string;
  showWordmark?: boolean;
}

export function AmonarqLogo({ className = "", showWordmark = true }: AmonarqLogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Abstract Logo Mark - Represents continuity and flow */}
      <img
        src="/logo.png"
        alt="amonarq Logo"
        className="h-full w-auto object-contain"
      />
    </div>
  );
}

export function MyNxtLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img
        src="/mynxt-logo.png"
        alt="MyNxt Logo"
        className="h-8 md:h-10 w-auto object-contain"
      />
    </div>
  );
}
