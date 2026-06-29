import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Solusi Digital Terbaik",
  description: "",
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
