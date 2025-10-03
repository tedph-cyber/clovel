import React from "react";
import { Outfit } from "next/font/google"; 

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${outfit.variable} min-h-screen flex flex-col justify-center items-center p-2`}
    >
      <main className="flex-1">{children}</main>
    </div>
  );
}
