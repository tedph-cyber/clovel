import Image from "next/image";
import { Pacifico } from "next/font/google";
const pacifico = Pacifico({ subsets: ["latin"], weight: "400" });

export default function Footer() {
    return (
    <footer className="p-3 sm:p-4 md:p-6 text-center text-xs sm:text-sm flex-col flex justify-center text-gray-500 sm:justify-around items-center sm:flex-row sm:items-center border-t border-gray-200 mt-auto">
    <div className="flex items-center text-base sm:text-lg mb-2 sm:mb-0">
       <Image src="/clovel.png" alt="Logo" height={28} width={35} className="border rounded-lg mr-2 sm:h-8 sm:w-10" />
       <span className={pacifico.className}>Clovel</span>
    </div>
        <div className="text-xs sm:text-sm">&copy; {new Date().getFullYear()} Clovel. All rights reserved.</div>
    </footer>
    )
}