"use client";
import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Button from "./ui/button";
import { useState, useEffect } from "react";

const Hero = () => {
  const [typewriterText, setTypewriterText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const fullText = "My SmartPiggy";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    let timeout: ReturnType<typeof setTimeout>;
    
    const typeWriter = () => {
      const currentLength = typewriterText.length;
      
      if (!isDeleting && currentLength < fullText.length) {
        // Typing forward
        setTypewriterText(fullText.slice(0, currentLength + 1));
        timeout = setTimeout(typeWriter, 150);
      } else if (!isDeleting && currentLength === fullText.length) {
        // Pause before deleting
        timeout = setTimeout(() => {
          setIsDeleting(true);
          typeWriter();
        }, 2000);
      } else if (isDeleting && currentLength > 0) {
        // Deleting backward
        setTypewriterText(fullText.slice(0, currentLength - 1));
        timeout = setTimeout(typeWriter, 100);
      } else if (isDeleting && currentLength === 0) {
        // Restart typing
        setIsDeleting(false);
        timeout = setTimeout(typeWriter, 500);
      }
    };

    timeout = setTimeout(typeWriter, 150);

    return () => clearTimeout(timeout);
  }, [typewriterText, isDeleting, isMounted]);

  return (
    <>
      <section className="hero-section">
        <div className="container mx-auto lg:px-6 px-4  pt-20 flex flex-col items-center">
          <div className="w-full lg:w-1/2 mx-auto text-center">
            <h1 className=" js-scroll fade-in text-4xl lg:text-5xl font-bold mb-6 text-gray-800 "  style={{ lineHeight: '1.2' }}>
              Take Control of Your Finances with <span className="text-[#2255ec]">{isMounted ? typewriterText : ''}<span className="typewriter-cursor">|</span></span>
            </h1>
            <p className=" js-scroll fade-in text-lg mb-8 text-black font-normal">
              Manage your budget, track expenses, and achieve your savings goals all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 justify-center items-center">
              <Button variant="primary" size="lg" className="inline-flex items-center js-scroll fade-in px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 w-full sm:w-auto">
                Get Started <ArrowRight className="ml-2" />
              </Button>
              <Button variant="outline" size="lg" className="inline-flex items-center js-scroll fade-in px-6 py-3 sm:ml-4 border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition duration-300 w-full sm:w-auto">
                Learn More <Sparkles className="ml-2" />
              </Button>
            </div>
          </div>
          <div className="w-full lg:w-8/12 mx-auto pt-12">
            <div className="header-image-wrapper">
              <Image
                src="/hero-image.webp"
                alt="Hero Image"
                width={600}
                height={400}
                className="w-full h-auto  js-scroll slide-left"
              />
            </div>
          </div>
        </div>
      </section>
    
      <section className="lg:px-32 px-4 pt-20 pb-12" id="about">
        <div className="container mx-auto">
          <div className="flex justify-center mx-auto gap-8 lg:gap-24 flex-col md:flex-row items-center">
            <div className="w-full header-image-wrapper js-scroll slide-left order-2 md:order-1">
              <Image
                src="/about-image.jpeg"
                alt="About SmartPiggy"
                width={500}
                height={300}
                className="w-full h-auto rounded-lg"
              />
            </div>
            <div className="w-full js-scroll fade-in-bottom order-1 md:order-2 max-w-xl">
              <span className="text-[#1447E6] font-semibold text-base/6">About</span>
              <h2 className="text-4xl font-bold mb-6 text-black text-shadow-lg/20 tracking-wide ">My SmartPiggy</h2>
              <p className="text-lg mb-4 text-black font-normal">
                SmartPiggy is your personal finance companion designed to help you take control of your money. Whether you&apos;re looking to budget better, track your expenses, or save for future goals, SmartPiggy has got you covered.
              </p>
              <p className="text-lg mb-4 text-black font-normal">
                Our intuitive platform offers a range of features to simplify your financial management, making it easier than ever to stay on top of your finances and make informed decisions.
              </p>
            </div>
          </div>
        </div>
      </section>
      
    </>
  );
};

export default Hero;
