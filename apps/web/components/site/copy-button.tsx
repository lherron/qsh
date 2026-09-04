"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyButton({
  value,
  label = "copy",
  className,
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      return;
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1200);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className={[
        "inline-flex shrink-0 items-center gap-1.5 rounded-sm border border-rule px-2.5 py-1.5 font-mono text-2xs text-paper-muted transition-colors duration-[120ms] hover:border-rule-strong hover:text-paper",
        className ?? "",
      ].join(" ")}
    >
      {copied ? (
        <Check size={14} className="text-done" aria-hidden="true" />
      ) : (
        <Copy size={14} aria-hidden="true" />
      )}
      <span>{copied ? "copied" : label}</span>
    </button>
  );
}
