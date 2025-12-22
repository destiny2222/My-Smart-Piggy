"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Menu, X, PiggyBank } from "lucide-react";
import Link from "next/link";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Savings", href: "#savings" },
    { name: "About", href: "#about" },
  ];

  return (
    <header className="bg-white shadow-sm fixed w-full z-10">
      <div className="container mx-auto flex justify-between items-center px-32 py-6">
        <Link href="/" className="flex items-center space-x-2">
          <PiggyBank className="text-blue-500" />
          <span className="text-xl font-bold text-gray-800">My SmartPiggy</span>
        </Link>
        <nav className="hidden md:flex space-x-6">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="text-gray-600 hover:text-blue-500">
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
