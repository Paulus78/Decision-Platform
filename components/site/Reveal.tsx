"use client";

import { useEffect, useRef, useState } from "react";

// Lässt seine Kinder einmal nacheinander erscheinen, sobald sie ins Bild scrollen.
export default function Reveal({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${seen ? "in" : ""} ${className ?? ""}`}>
      {children}
    </div>
  );
}
