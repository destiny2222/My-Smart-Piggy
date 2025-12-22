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
        <div className="container mx-auto  px-6 py-20">
          <div className="flex justify-between gap-4">
            <div className="w-1/2">
              <h2 className="text-3xl font-bold mb-6 text-gray-800">About SmartPiggy</h2>
              <p className="text-lg mb-4 text-gray-600">
                SmartPiggy is your personal finance companion designed to help you take control of your money. Whether you're looking to budget better, track your expenses, or save for future goals, SmartPiggy has got you covered.
              </p>
              <p className="text-lg mb-4 text-gray-600">
                Our intuitive platform offers a range of features to simplify your financial management, making it easier than ever to stay on top of your finances and make informed decisions.
              </p>
            </div>
            <div className="w-1/2">
              <Image
                src="/image/about-image.webp"
                alt="About SmartPiggy"
                width={500}
                height={300}
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
