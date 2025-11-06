import type { Metadata } from "next";
import "./globals.css";
import MobileBottomNav from "@/components/MobileBottomNav";

export const metadata: Metadata = {
  title: "Kenavo - Montfort Class of 2000",
  description: "A space for the Montfort Class of 2000 to reconnect, remember, and share stories.",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased pb-0 lg:pb-0">
        <div className="pb-20 lg:pb-0">
          {children}
        </div>
        <MobileBottomNav />
      </body>
    </html>
  );
}
