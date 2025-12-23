"use client";
import Header from "./components/Header"
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import Features from "./components/Features";
import useScrollAnimation from "./hooks/useScrollAnimation";

export default function Home() {
  useScrollAnimation(null);
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
      </main>
      <Footer />
    </>
  );
}
