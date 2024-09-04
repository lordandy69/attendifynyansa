import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/layouts/nav";
import FrameContextStore from "@/lib/store/FrameContextStore";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Time Trace",
  description: "Class Attendance System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-200`}>
        <Navbar />
        <FrameContextStore>{children}</FrameContextStore>
        <Toaster position="bottom-right" theme="light" />
      </body>
    </html>
  );
}
