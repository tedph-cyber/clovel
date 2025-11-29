'use client'
import Image from "next/image";
import Link from "next/link";
import { SearchIcon, House, Menu, X, BookOpen, TrendingUp, Activity } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pacifico } from "next/font/google";
const pacifico = Pacifico({ subsets: ["latin"], weight: "400" });

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const router = useRouter();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSearchSubmit = (e: React.FormEvent, query: string) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleMobileSearch = () => {
    if (mobileSearchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(mobileSearchQuery.trim())}`);
      setIsOpen(false); // Close mobile menu after search
    }
  };

  return (
    <nav className="bg-white/90 backdrop-blur-sm container mx-auto max-w-full border-emerald-100 border-b shadow-lg text-center flex justify-between items-center text-sm text-gray-600 sticky top-0 z-10 sm:justify-around sm:items-center sm:p-2 sm:text-sm">
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
          <span className={`${pacifico.className} text-emerald-600`}>Clovel</span>
        </Link>
      </div>
      {/* Desktop Search */}
      <div className="hidden md:flex">
        <form onSubmit={(e) => handleSearchSubmit(e, searchQuery)}>
          <input
            type="search"
            name="search"
            id="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border-emerald-200 border rounded-full focus:ring-2 focus:ring-emerald-300 focus:outline-none"
            placeholder="Search novels, authors..."
          />
        </form>
      </div>
      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center space-x-3">
        <Link href="/search" className="p-2 hover:bg-emerald-50 rounded-full transition-colors">
          <SearchIcon className="h-5 w-5 text-emerald-600" />
        </Link>
        <button 
          onClick={toggleMenu} 
          className="p-2 hover:bg-emerald-50 rounded-full transition-colors focus:outline-none"
        >
          {isOpen ? (
            <X className="h-6 w-6 text-emerald-600" />
          ) : (
            <Menu className="h-6 w-6 text-emerald-600" />
          )}
        </button>
      </div>

      {/* Sidebar Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-white md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed top-0 right-0 h-full w-full bg-white shadow-2xl z-50 md:hidden transform transition-transform duration-300 ease-in-out">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center">
              <Image
                src="/clovel.png"
                alt="Logo"
                height={24}
                width={45}
                className="border rounded-lg mr-2"
              />
              <span className={`${pacifico.className} text-emerald-600 text-lg`}>Clovel</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-6 w-6 text-gray-600" />
            </button>
          </div>

          {/* Mobile Search */}
          <div className="p-4 border-b border-gray-200">
            <form onSubmit={(e) => handleSearchSubmit(e, mobileSearchQuery)} className="flex gap-2">
              <input
                type="search"
                value={mobileSearchQuery}
                onChange={(e) => setMobileSearchQuery(e.target.value)}
                className="flex-1 p-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-300 focus:outline-none"
                placeholder="Search novels, authors..."
              />
              <button
                type="submit"
                className="px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <SearchIcon className="h-5 w-5" />
              </button>
            </form>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col py-4">
            <Link 
              href="/" 
              className="flex items-center px-6 py-4 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <House className="h-5 w-5 mr-3" />
              <span className="font-medium">Home</span>
            </Link>
            
            <Link 
              href="/search" 
              className="flex items-center px-6 py-4 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <SearchIcon className="h-5 w-5 mr-3" />
              <span className="font-medium">Browse Novels</span>
            </Link>
            
            <Link 
              href="/library" 
              className="flex items-center px-6 py-4 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <BookOpen className="h-5 w-5 mr-3" />
              <span className="font-medium">My Library</span>
            </Link>
            
            <Link 
              href="/reading-list" 
              className="flex items-center px-6 py-4 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <TrendingUp className="h-5 w-5 mr-3" />
              <span className="font-medium">Reading List</span>
            </Link>

            {/* Divider */}
            <div className="border-t border-gray-200 my-4 mx-6"></div>

            {/* Developer Tools */}
            <div className="px-6 py-2 mb-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Developer</h3>
              <Link 
                href="/diagnostics" 
                className="flex items-center py-2 text-sm text-gray-600 hover:text-emerald-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Activity className="h-4 w-4 mr-2" />
                Database Diagnostics
              </Link>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 mb-4 mx-6"></div>

            {/* Genre Links */}
            <div className="px-6 py-2">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Popular Genres</h3>
              <div className="space-y-2">
                <Link 
                  href="/genre/fantasy" 
                  className="block py-2 text-sm text-gray-600 hover:text-emerald-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Fantasy
                </Link>
                <Link 
                  href="/genre/romance" 
                  className="block py-2 text-sm text-gray-600 hover:text-emerald-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Romance
                </Link>
                <Link 
                  href="/genre/action" 
                  className="block py-2 text-sm text-gray-600 hover:text-emerald-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Action
                </Link>
                <Link 
                  href="/genre/mystery" 
                  className="block py-2 text-sm text-gray-600 hover:text-emerald-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Mystery
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}