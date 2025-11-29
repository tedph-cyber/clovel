# Clovel - Modern Novel Reading PlatformThis is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).



A personalized novel reading application built with Next.js 15 and Supabase, designed for an immersive reading experience.## Getting Started



## 🚀 FeaturesFirst, run the development server:



- **Direct Supabase Integration**: No external backend API - connects directly to Supabase for optimal performance```bash

- **Novel Discovery**: Browse, search, and discover novels by genre, rating, and popularitynpm run dev

- **Immersive Reading**: Customizable reading experience with multiple themes, fonts, and layouts# or

- **Reading Progress**: Track your reading progress across devicesyarn dev

- **Author Profiles**: Explore author pages with their complete works# or

- **Responsive Design**: Fully responsive UI that works seamlessly on all devicespnpm dev

- **Modern Stack**: Built with Next.js 15, React 19, TypeScript, and Tailwind CSS# or

bun dev

## 📋 Prerequisites```



- Node.js 20 or higherOpen [http://localhost:3000](http://localhost:3000) with your browser to see the result.

- npm or yarn

- A Supabase account and projectYou can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.



## 🛠️ Quick StartThis project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.



1. **Clone and install**## Learn More

   ```bash

   git clone <your-repo-url>To learn more about Next.js, take a look at the following resources:

   cd clovel

   npm install- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.

   ```- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.



2. **Configure environment**You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

   ```bash

   cp .env.example .env.local## Deploy on Vercel

   ```

   The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

   Update `.env.local` with your Supabase credentials

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

3. **Set up database**
   
   See [SETUP.md](./SETUP.md) for complete database schema

4. **Run development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
clovel/
├── app/                 # Next.js app directory
│   ├── (main)/         # Main pages
│   ├── novel/          # Novel & chapter pages
│   ├── author/         # Author pages
│   └── search/         # Search functionality
├── components/         # React components
│   └── ui/            # UI components
├── lib/               # Core library
│   ├── supabase/      # Supabase client
│   ├── db/            # Database queries
│   ├── hooks/         # React hooks
│   └── utils/         # Utilities
└── public/            # Static assets
```

## 🎨 Technologies

- **Framework**: Next.js 15 with App Router & Turbopack
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Animations**: Framer Motion

## 📚 Key Features

### Novel Reading
- Customizable font, size, and themes
- Reading progress tracking
- Fullscreen mode
- Keyboard navigation

### Discovery
- Browse by genre, rating, popularity
- Advanced search with filters
- Featured & trending sections

### Database
- Direct Supabase integration
- Optimized queries
- Real-time updates
- Type-safe operations

## 📝 Scripts

```bash
npm run dev    # Development with Turbopack
npm run build  # Production build
npm start      # Start production server
```

## 🔐 Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 📖 Documentation

- [Setup Guide](./SETUP.md) - Complete setup instructions
- [Database Schema](./SETUP.md#database-schema) - Database structure

## 🎯 Database Tables

- **authors** - Author information
- **novels** - Novel data and metadata
- **chapters** - Chapter content
- **reading_progress** - User reading progress
- **bookmarks** - User bookmarks

## 🤝 Contributing

This is a personal project, but suggestions are welcome!

## 📄 License

Private - All rights reserved

---

Built with ❤️ using Next.js 15 and Supabase
