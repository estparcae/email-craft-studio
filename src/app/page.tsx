"use client";

import { AppProvider } from "@/context/AppContext";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { EmailPreview } from "@/components/EmailPreview";

export const dynamic = 'force-static';

export default function Home() {
  return (
    <AppProvider>
      <div className="h-screen flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-[380px] shrink-0 overflow-hidden">
            <Sidebar />
          </div>

          {/* Preview */}
          <div className="flex-1 overflow-hidden">
            <EmailPreview />
          </div>
        </div>
      </div>
    </AppProvider>
  );
}
