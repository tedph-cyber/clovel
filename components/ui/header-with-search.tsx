'use client'

import React, { useState } from 'react'
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BookOpen, Menu, X, House, SearchIcon, TrendingUp, Activity } from 'lucide-react'
import { Pacifico } from "next/font/google"

import { SearchModal } from './search-modal'
import { Button } from './button'
import { Sheet, SheetContent, SheetTrigger } from './sheet'

const pacifico = Pacifico({ subsets: ["latin"], weight: "400" })

// Sample novel data - you can replace this with your actual data
const novels = [
  {
    id: 'novel-1',
    title: 'The Shadow Realm',
    description: 'A dark fantasy adventure through mystical realms.',
    category: 'Fantasy',
    icon: BookOpen,
  },
  {
    id: 'novel-2',
    title: 'Digital Hearts',
    description: 'A contemporary romance in the tech world.',
    category: 'Romance',
    icon: BookOpen,
  },
  {
    id: 'novel-3',
    title: 'Quantum Paradox',
    description: 'Hard science fiction exploring parallel universes.',
    category: 'Sci-Fi',
    icon: BookOpen,
  },
  {
    id: 'novel-4',
    title: 'Blood Moon Rising',
    description: 'Action-packed supernatural thriller.',
    category: 'Action',
    icon: BookOpen,
  },
  {
    id: 'novel-5',
    title: 'Whispering Woods',
    description: 'A mysterious tale of secrets and ancient magic.',
    category: 'Mystery',
    icon: BookOpen,
  },
  {
    id: 'novel-6',
    title: 'City of Neon Dreams',
    description: 'Urban drama set in a cyberpunk metropolis.',
    category: 'Drama',
    icon: BookOpen,
  },
  {
    id: 'novel-7',
    title: 'The Last Kingdom',
    description: 'Epic fantasy of kingdoms and ancient powers.',
    category: 'Fantasy',
    icon: BookOpen,
  },
  {
    id: 'novel-8',
    title: 'Starborn Legacy',
    description: 'Space opera with political intrigue.',
    category: 'Sci-Fi',
    icon: BookOpen,
  },
  {
    id: 'novel-9',
    title: 'Forbidden Love',
    description: 'Historical romance across social boundaries.',
    category: 'Romance',
    icon: BookOpen,
  },
  {
    id: 'novel-10',
    title: 'Dark Conspiracy',
    description: 'Modern thriller with government secrets.',
    category: 'Thriller',
    icon: BookOpen,
  }
]

const navigationItems = [
  { name: 'Browse Novels', href: '/search', icon: SearchIcon },
  { name: 'My Library', href: '/library', icon: BookOpen },
  { name: 'Reading List', href: '/reading-list', icon: TrendingUp },
]

const genreLinks = [
  { name: 'Fantasy', href: '/genre/fantasy' },
  { name: 'Romance', href: '/genre/romance' },
  { name: 'Action', href: '/genre/action' },
  { name: 'Mystery', href: '/genre/mystery' }
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleSearch = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <header className="bg-white/90 backdrop-blur-sm container mx-auto max-w-full border-emerald-100 border-b shadow-lg sticky top-0 z-50">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/clovel.png"
              alt="Logo"
              height={32}
              width={60}
              className="border rounded-lg"
            />
            <span className={`${pacifico.className} text-emerald-600 text-xl`}>Clovel</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:space-x-6">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Search and Mobile Menu */}
        <div className="flex items-center space-x-4">
          {/* Search Modal */}
          <SearchModal data={novels}>
            <Button
              variant="outline"
              className="relative h-9 w-9 p-0 md:border xl:h-9 xl:w-60 xl:justify-between xl:px-3 xl:py-2 hover:bg-emerald-50 border-emerald-200"
            >
              <span className="hidden xl:inline-flex text-gray-500">Search novels...</span>
              <span className="sr-only">Search</span>
              <SearchIcon className="h-4 w-4 text-emerald-600" />
            </Button>
          </SearchModal>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 px-0 hover:bg-emerald-50"
                >
                  <Menu className="h-5 w-5 text-emerald-600" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-full sm:w-[400px] bg-white"
                showClose={false}
              >
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                      <Image
                        src="/clovel.png"
                        alt="Logo"
                        height={24}
                        width={45}
                        className="border rounded-lg"
                      />
                      <span className={`${pacifico.className} text-emerald-600 text-lg`}>Clovel</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 w-9 px-0 hover:bg-gray-100"
                      onClick={() => setIsOpen(false)}
                    >
                      <X className="h-6 w-6 text-gray-600" />
                    </Button>
                  </div>

                  {/* Mobile Search */}
                  <div className="py-4 border-b border-gray-200">
                    <SearchModal data={novels}>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-gray-500 border-emerald-200 hover:bg-emerald-50"
                      >
                        <SearchIcon className="h-4 w-4 mr-2 text-emerald-600" />
                        Search novels, authors...
                      </Button>
                    </SearchModal>
                  </div>

                  {/* Navigation Links */}
                  <nav className="flex-1 py-4 space-y-1">
                    <Link 
                      href="/" 
                      className="flex items-center px-3 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <House className="h-5 w-5 mr-3" />
                      <span className="font-medium">Home</span>
                    </Link>
                    
                    {navigationItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center px-3 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          <Icon className="h-5 w-5 mr-3" />
                          <span className="font-medium">{item.name}</span>
                        </Link>
                      )
                    })}

                    {/* Divider */}
                    <div className="border-t border-gray-200 my-4"></div>

                    {/* Developer Tools */}
                    <div className="px-3 py-2 mb-4">
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

                    {/* Genre Links */}
                    <div className="px-3 py-2">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Popular Genres</h3>
                      <div className="space-y-2">
                        {genreLinks.map((genre) => (
                          <Link 
                            key={genre.name}
                            href={genre.href} 
                            className="block py-2 text-sm text-gray-600 hover:text-emerald-600 transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            {genre.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}