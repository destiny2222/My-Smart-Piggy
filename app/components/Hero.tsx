"use client";
import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Button from "./ui/button";
import HeroImg from '../styles/image/hero-image.webp'

const Hero = () => {
  return (
    <>
      <section className="hero-section">
        <div className="container mx-auto px-6 py-20 flex flex-col items-center">
          <div className="w-full lg:w-1/2 mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-800 "  style={{ lineHeight: '1.2' }}>
              Take Control of Your Finances with <span className="text-blue-500">SmartPiggy</span>
            </h1>
            <p className="text-lg mb-8 text-gray-600">
              Manage your budget, track expenses, and achieve your savings goals all in one place.
            </p>
            <Button variant="primary" size="lg" className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300">
              Get Started <ArrowRight className="ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="inline-flex items-center px-6 py-3 ml-4 border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition duration-300">
              Learn More <Sparkles className="ml-2" />
            </Button>
          </div>
          <div className="w-full lg:w-8/12 mx-auto pt-12">
            <div className="header-image-wrapper">
              <Image
                src={HeroImg}
                alt="Hero Image"
                width={600}
                height={400}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>
    
      <section className="" id="about">
        <div className="container mx-auto px-6 py-20">
          <div className="flex "></div>
        </div>
      </section>
    </>
  );
};

export default Hero;
