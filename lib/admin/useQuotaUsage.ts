"use client";

import { useState, useEffect, useCallback } from "react";
import type { QuotaPolicy, QuotaUsage } from "@/lib/types/admin";
import {
  getEffectiveQuotaPolicy,
  getQuotaUsage as getStoredQuotaUsage,
  setQuotaUsage as storeQuotaUsage,
  DEFAULT_QUOTA_POLICY,
} from "@/lib/admin/quota-storage";

/** Quota state for header display */
export interface QuotaState {
  transcripts: {
    used: number | null;
    max: number;
  };
  scripts: {
    used: number | null;
    max: number;
  };
  policy: QuotaPolicy;
}

/**
 * Hook to get current quota usage state.
 * Reads from localStorage (admin-configured policy) and fetches usage from API.
 * Returns used/max for transcripts and scripts.
 */
export function useQuotaUsage(): QuotaState {
  const [state, setState] = useState<QuotaState>(() => {
    const policy = DEFAULT_QUOTA_POLICY;
    return {
      transcripts: { used: null, max: policy.transcriptsPerMonth },
      scripts: { used: null, max: policy.scriptsPerMonth },
      policy,
    };
  });

  useEffect(() => {
    // Load policy from localStorage
    const policy = getEffectiveQuotaPolicy();

    // Load cached usage from localStorage first
    const cachedUsage = getStoredQuotaUsage();

    setState({
      transcripts: {
        used: cachedUsage?.transcriptsUsed ?? null,
        max: policy.transcriptsPerMonth,
      },
      scripts: {
        used: cachedUsage?.scriptsUsed ?? null,
        max: policy.scriptsPerMonth,
      },
      policy,
    });

    // Then fetch fresh usage from API
    fetch("/api/admin/quota-usage")
      .then((res) => (res.ok ? res.json() : null))
      .then((usage: QuotaUsage | null) => {
        if (usage) {
          // Cache the usage
          storeQuotaUsage(usage);

          // Update state with fresh data
          setState((prev) => ({
            ...prev,
            transcripts: {
              used: usage.transcriptsUsed ?? null,
              max: prev.policy.transcriptsPerMonth,
            },
            scripts: {
              used: usage.scriptsUsed ?? null,
              max: prev.policy.scriptsPerMonth,
            },
          }));
        }
      })
      .catch(() => {
        // Silently fail - keep cached/default values
      });
  }, []);

  return state;
}

/**
 * Hook to manage quota policy with refresh capability.
 */
export function useQuotaPolicy(): {
  policy: QuotaPolicy;
  refresh: () => void;
} {
  const [policy, setPolicy] = useState<QuotaPolicy>(DEFAULT_QUOTA_POLICY);

  const refresh = useCallback(() => {
    setPolicy(getEffectiveQuotaPolicy());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { policy, refresh };
}

/**
 * Format quota for display in header.
 * Returns "12 / 40" or "— / 40" or "— / —"
 */
export function formatQuotaDisplay(
  used: number | null,
  max: number | null,
): string {
  const usedStr = used !== null ? used.toLocaleString("pt-BR") : "—";
  const maxStr = max !== null ? max.toLocaleString("pt-BR") : "—";
  return `${usedStr} / ${maxStr}`;
}
