"use client";

import { useToast as useToastFromProvider } from "@/components/providers/ToastProvider";

/**
 * Hook to access the global luxury toast system.
 * Usage: const { showToast } = useToast();
 */
export const useToast = useToastFromProvider;
