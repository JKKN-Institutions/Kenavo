import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kenavo - Montfort Class of 2000",
  description: "A space for the Montfort Class of 2000 to reconnect, remember, and share stories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
