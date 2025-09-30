"use client";

import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import type { ButtonIntent } from "@/config/button-intents";
import { toast } from "@/lib/toast";

type Props = {
  intentKey: string;
  intent: ButtonIntent;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  "data-testid"?: string;
  ariaLabel?: string;
  disabled?: boolean;
};

export default function ButtonBinder({ 
  intentKey, 
  intent, 
  children, 
  className, 
  variant = "default",
  size = "default",
  disabled = false,
  ...rest 
}: Props) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const allowed = (() => {
    if (disabled) return false;
    if (!intent.requiresAuth) return true;
    if (status !== "authenticated") return false;
    if (intent.role && (session?.user as any)?.role !== intent.role) return false;
    return true;
  })();

  const onClick = useCallback(async () => {
    if (!allowed) {
      if (intent.requiresAuth && status !== "authenticated") {
        toast.error("Please sign in to continue");
        router.push("/auth/signin");
      } else if (intent.role && (session?.user as any)?.role !== intent.role) {
        toast.error(`This action requires ${intent.role} role`);
      }
      return;
    }

    try {
      setBusy(true);
      
      if (intent.type === "nav") {
        router.push(intent.to);
      } else {
        // Dispatch to centralized action registry
        const mod = await import("@/lib/button-actions");
        await mod.runAction(intent.id);
      }
    } catch (error) {
      console.error(`Button action failed for ${intentKey}:`, error);
      toast.error("Action failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }, [allowed, intent, router, intentKey, status, session]);

  const getTooltipText = () => {
    if (disabled) return "This action is currently disabled";
    if (!intent.requiresAuth) return undefined;
    if (status !== "authenticated") return "Sign in to use this feature";
    if (intent.role && (session?.user as any)?.role !== intent.role) {
      return `Sign in as ${intent.role} to access this feature`;
    }
    return undefined;
  };

  return (
    <Button
      onClick={onClick}
      className={className}
      variant={variant}
      size={size}
      data-testid={rest["data-testid"] ?? intentKey}
      data-action={intent.type}
      aria-label={rest.ariaLabel}
      aria-busy={busy || undefined}
      aria-disabled={!allowed || undefined}
      disabled={!allowed || busy}
      title={getTooltipText()}
    >
      {children}
    </Button>
  );
}
