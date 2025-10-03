import Image from "next/image";
import { Pacifico } from "next/font/google";
const pacifico = Pacifico({ subsets: ["latin"], weight: "400" });

export default function Footer() {
    return (
    <footer className="sm:p-2 pb-4 text-center text-xs flex-col flex justify-center text-gray-500 sm:justify-around items-center sm:flex-row sm:items-center sm:text-sm border-gray-200">
    <div className="flex items-center text-lg mb-2">
       <Image src="/clovel.png" alt="Logo" height={32} width={40} className="border rounded-lg mr-2" />
       <span className={pacifico.className}>Clovel</span>
    </div>
        &copy; {new Date().getFullYear()} Clovel. All rights reserved.
    </footer>
    )
}