import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Celtics — Kevin Garnett Trade Tree",
  description: "Boston Celtics side of the July 31, 2007 Kevin Garnett trade.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
