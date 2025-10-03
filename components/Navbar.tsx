'use client'
import Image from "next/image";
import Link from "next/link";
import { SearchIcon, House } from "lucide-react";
import { useState } from "react";
import { Pacifico } from "next/font/google";
const pacifico = Pacifico({ subsets: ["latin"], weight: "400" });

export default function Navbar() {
      const [isOpen, setIsOpen] = useState(false);

      const toggleMenu = () => {
        setIsOpen(!isOpen);
      };

  return (
    <nav className="bg-white container mx-auto max-w-full border-gray-200 border-b shadow-lg text-center flex justify-between items-center text-sm text-gray-500 sticky top-0 z-10 sm:justify-around sm:items-center sm:p-2 sm:text-sm">
      {/* image/logo */}
      <div className="flex items-center text-xl">
        <Link href="/" className="flex items-center">
          <Image
            src="/clovel.png"
            alt="Logo"
            height={32}
            width={60}
            className="border rounded-lg"
          />
          {/* <img src="/logo.png" alt="Logo" className="h-8 mr-2" /> */}
          <span className={pacifico.className}>Clovel</span>
        </Link>
      </div>
      <div className="hidden md:flex">
        <form action="/search" method="post">
          <input
            type="search"
            name="search"
            id="search"
            className="p-1 border-gray-200 border rounded-full"
            placeholder=" Search..."
          />
        </form>
      </div>
      {/* Mobile Menu Button */}
      <div className="md:hidden flex space-x-2 text-sm">
        <SearchIcon />
        <button onClick={toggleMenu} className=" focus:outline-none">
          {isOpen ? (
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Sidebar Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed left-0 top-15 w-1/3 inset-0 bg-black/5 z-40 sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed top-15 right-0 flex flex-col  space-y-2 w-2/3 h-screen sm:h-screen px-4 pt-4 sm:pt-0 bg-white">
          <Link href="/" className="block text-black hover:text-white py-2">
            <House /> Home
          </Link>
          <Link
            href="/about"
            className="block text-black hover:text-white py-2"
          >
            Genres
          </Link>
          <Link
            href="/contact"
            className="block text-black hover:text-white py-2"
          >
            Rankings?
          </Link>
        </div>
      )}
    </nav>
  );
}