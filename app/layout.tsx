import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Live Tracking",
  description: "Sistem pelacakan lokasi real-time",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}
