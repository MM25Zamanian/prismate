"use client";

import type { ThemeProviderProps } from "next-themes";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useEffect, useState } from "react";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();
  const queryClient = new QueryClient();
  const [showUpdate, setShowUpdate] = useState(false);
  const [showInstallHint, setShowInstallHint] = useState(false);

  // SW update prompt using window.serwist events
  useEffect(() => {
    if (typeof window === "undefined") return;
    const w = window as unknown as { serwist?: any };
    const serwist = w.serwist;
    if (!serwist) return;

    // When a new SW is waiting, show update modal
    const onWaiting = () => setShowUpdate(true);
    const onInstalled = (evt: any) => {
      // First-time install hint
      if (!evt?.isUpdate) setShowInstallHint(true);
    };
    // Serwist event names are simple strings like "waiting" and "installed"
    serwist.addEventListener?.("waiting", onWaiting);
    serwist.addEventListener?.("installed", onInstalled);
    return () => {
      serwist.removeEventListener?.("waiting", onWaiting);
      serwist.removeEventListener?.("installed", onInstalled);
    };
  }, []);

  return (
    <HeroUIProvider navigate={router.push}>
      <QueryClientProvider client={queryClient}>
        <NextThemesProvider {...themeProps}>
          {children}

          {/* Update available modal (Persian text, concise) */}
          <Modal isOpen={showUpdate} onOpenChange={setShowUpdate} backdrop="blur">
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader>به‌روزرسانی در دسترس است</ModalHeader>
                  <ModalBody>
                    نسخه جدید آماده نصب است. برای اعمال به‌روزرسانی، برنامه را ریفرش کنید.
                  </ModalBody>
                  <ModalFooter>
                    <Button variant="flat" onPress={onClose}>بعداً</Button>
                    <Button color="primary" onPress={() => {
                      try {
                        (window as any).serwist?.messageSkipWaiting?.();
                      } catch (e) {
                        console.error("به‌روزرسانی سرویس‌ورکر ناموفق بود.", e);
                      }
                      location.reload();
                    }}>به‌روزرسانی</Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>

          {/* First install hint */}
          <Modal isOpen={showInstallHint} onOpenChange={setShowInstallHint} backdrop="blur">
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader>نصب PWA</ModalHeader>
                  <ModalBody>
                    برای نصب برنامه روی دستگاه، از گزینه «Add to Home Screen» یا «Install App» در مرورگر استفاده کنید.
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" onPress={onClose}>باشه</Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </NextThemesProvider>
      </QueryClientProvider>
    </HeroUIProvider>
  );
}
