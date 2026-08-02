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
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    triggerRef.current = document.activeElement as HTMLElement | null;
    confirmRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      triggerRef.current?.focus();
    };
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
        ref={panelRef}
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
              destructive ? "!bg-danger-strong !text-white" : ""
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
