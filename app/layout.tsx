import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PlannerZeed",
  description: "Productivity System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className="min-h-screen bg-background text-on-surface font-body antialiased">
        {children}
      </body>
    </html>
  );
}
