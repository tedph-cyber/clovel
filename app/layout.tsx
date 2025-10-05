import type { Metadata } from "next";
import { Outfit, Indie_Flower, Sanchez, Righteous } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

const indieFlower = Indie_Flower({
  variable: "--font-indie-flower",
  subsets: ["latin"],
  weight: ["400"],

});

const sanchez = Sanchez({
  variable: "--font-sanchez",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const righteous = Righteous({
  variable: "--font-righteous",
  subsets: ["latin"],
  weight: ["400"],
});


export const metadata: Metadata = {
  title: "Clovel",
  description: "Read and share your favorite novels",
  icons: {
    icon: "/clovel.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${indieFlower.variable} ${sanchez.variable} ${righteous.variable} font-sans bg-gradient-to-br from-emerald-50 via-white to-orange-50 min-h-screen antialiased`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
