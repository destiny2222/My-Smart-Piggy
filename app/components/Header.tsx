"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Menu, X, PiggyBank } from "lucide-react";
import Link from "next/link";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "#about" },
    { name: "Features", href: "#features" },
    // { name: "Savings", href: "#savings" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header className="bg-white  fixed w-full z-10">
      <div className="container mx-auto flex justify-between items-center px-32 py-6">
        <Link href="/" className="flex items-center space-x-2">
          <PiggyBank className="text-blue-500" />
          <span className="text-xl font-bold text-gray-800">My SmartPiggy</span>
        </Link>
        <nav className="hidden md:flex space-x-6">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="text-black font-bold hover:text-blue-500 px-5">
              {link.name} 
            </Link>
          ))}
        </nav>
        <div className="hidden md:block">
          <Link href="/get-started" className="bg-blue-500 text-white hover:bg-blue-600 get-started-btn">Get Started</Link>
        </div>
        <div className="md:hidden">
          {/* <Button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </Button> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
