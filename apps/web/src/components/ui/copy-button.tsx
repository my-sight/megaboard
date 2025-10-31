"use client";

import { Clipboard, ClipboardCheck } from "lucide-react";
import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { cn } from "@/lib/utils/cn";

interface CopyButtonProps {
  text: string;
  label?: string;
}

export function CopyButton({ text, label = "Kopieren" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  return (
    <CopyToClipboard
      text={text}
      onCopy={() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
    >
      <button
        type="button"
        className={cn(
          "inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow hover:bg-slate-700"
        )}
      >
        {copied ? <ClipboardCheck className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
        {copied ? "Kopiert" : label}
      </button>
    </CopyToClipboard>
  );
}
