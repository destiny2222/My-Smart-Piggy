"use client";
import { ArrowRight, PiggyBank } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <>
      {/* CTA Section */}
      <section className="cta-section py-20 px-6">
        <div className="container mx-auto text-center">
          <h2 className=" js-scroll fade-in text-3xl lg:text-5xl font-bold mb-6 text-white">
            Ready to Start Your <br />
            <span className="text-[#1447E6]">Savings Journey?</span>
          </h2>
          <p className=" js-scroll fade-in font-normal text-lg mb-8 text-[#A3B1C6] max-w-3xl mx-auto">
            Join thousands of smart savers who are building their future, one day at a time. No pressure, no judgment — just progress.
          </p>
          <button className="cta-btn inline-flex items-center js-scroll fade-in px-8 py-4 bg-[#1447E6] text-white font-bold rounded-lg hover:bg-[#0F35B8] transition duration-300">
            Get Started Free <ArrowRight className="ml-2" />
          </button>
          <p className="text-sm font-normal mt-4 text-[#A3B1C6]">
            No credit card required • Start in 30 seconds
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-section py-8 px-6 border-t border-[#2D3D54]">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="w-10 h-10 bg-[#1447E6] rounded-lg flex items-center justify-center">
              <PiggyBank className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold text-[#1447E6]">My Smart Piggy</span>
          </div>
          
          <nav className="flex gap-6 mb-4 md:mb-0">
            <Link href="#about" className="text-[#A3B1C6] hover:text-[#1447E6] transition">
              About
            </Link>
            <Link href="#features" className="text-[#A3B1C6] hover:text-[#1447E6] transition">
              Features
            </Link>
            <Link href="#contact" className="text-[#A3B1C6] hover:text-[#1447E6] transition">
              Contact
            </Link>
            <Link href="#privacy" className="text-[#A3B1C6] hover:text-[#1447E6] transition">
              Privacy
            </Link>
          </nav>

          <p className="text-[#A3B1C6] text-sm font-normal">
            © 2024 My Smart Piggy. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
