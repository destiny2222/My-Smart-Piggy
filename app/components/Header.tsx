"use client";

import { useState } from "react";
import  Button  from "./ui/button";
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
      <div className="container mx-auto flex justify-between items-center lg:px-32 px-4 py-6">
        <Link href="/" className="flex items-center gap-2 mb-4 md:mb-0">
          <div className="w-10 h-10 bg-[#1447E6] rounded-lg flex items-center justify-center">
            <PiggyBank className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold text-[#1447E6]">My Smart Piggy</span>
        </Link>
        <nav className="hidden md:flex space-x-6">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="text-black font-bold hover:text-blue-500 px-5">
              {link.name} 
            </Link>
          ))}
        </nav>
        <div className="hidden md:block">
          <Link href="/get-started" className="bg-[#1447E6] text-white hover:bg-[#0f3bbd] get-started-btn">Get Started</Link>
        </div>
        <div className="md:hidden">
          <Button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <nav className="flex flex-col px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="text-black font-medium hover:text-blue-500 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link 
              href="/get-started" 
              className="bg-[#1447E6] text-white hover:bg-[#0f3bbd] get-started-btn text-center mt-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Get Started
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
