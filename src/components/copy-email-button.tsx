"use client";

import { useEffect, useState } from "react";
import { CheckIcon, CopyIcon } from "@/components/icons";

export function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="group inline-flex max-w-full items-center gap-3 rounded-full border border-border bg-surface py-2 pr-2 pl-4 text-left transition hover:border-foreground/40"
    >
      <span className="truncate font-medium">{email}</span>
      <span
        className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition ${
          copied ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" : "bg-foreground/5 text-muted group-hover:text-foreground"
        }`}
      >
        {copied ? <CheckIcon className="size-3.5" /> : <CopyIcon className="size-3.5" />}
        <span aria-live="polite">{copied ? "Copié !" : "Copier"}</span>
      </span>
    </button>
  );
}
