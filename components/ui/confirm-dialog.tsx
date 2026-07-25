"use client";

import { useEffect, useRef } from "react";
import { buttonClass } from "./kit";

/**
 * Small confirmation dialog — replaces window.confirm() for destructive
 * actions so the moment is styled, animated, and keyboard-navigable.
 * Renders nothing when closed; Escape and the scrim both cancel.
 */
export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  destructive = true,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  body?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    confirmRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center px-5">
      <button
        type="button"
        aria-label={cancelLabel}
        onClick={onCancel}
        className="scrim-in absolute inset-0 bg-foreground/30 backdrop-blur-[3px]"
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="rise relative w-full max-w-sm rounded-3xl bg-surface p-6 shadow-[var(--shadow-e3)] ring-1 ring-border"
      >
        <h2 id="confirm-title" className="text-[17px] font-semibold tracking-tight">
          {title}
        </h2>
        {body ? (
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            {body}
          </p>
        ) : null}
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onCancel} className={buttonClass("ghost", "md")}>
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            className={buttonClass(
              "primary",
              "md",
              destructive ? "!bg-danger !text-white" : ""
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
