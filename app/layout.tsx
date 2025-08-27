import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import FrameContextStore from "@/lib/store/FrameContextStore";

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
      <body>
        <div className="bg-white rounded-3xl w-full  h-full flex justify-center items-center">
          {/* <Navbar /> */}
          {children}
          {/* <Toaster position="bottom-right" theme="light" /> */}
        </div>
      </body>
    </html>
  );
}
