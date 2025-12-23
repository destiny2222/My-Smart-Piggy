"use client";
import { Sparkles, PiggyBank, ShieldCheck, TrendingUp } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Features() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3]);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  };

  // Word by word animation for heading
  const headingText = "Why Choose My Smart Piggy?";
  const words = headingText.split(" ");

  return (
    <>
      {/* why choose us */}
      <motion.section 
        ref={sectionRef}
        className="lg:px-32 px-4 py-20 lg:py-28 feature-section" 
        id="features"
        style={{ opacity }}
      >
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4 text-black">
              {words.map((word, index) => {
                const isHighlighted = word === "My" || word === "Smart" || word === "Piggy?";
                return (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.5 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1,
                      ease: "easeOut" as const
                    }}
                    className={isHighlighted ? "text-[#1447E6]" : ""}
                    style={{ display: "inline-block", marginRight: "0.25em" }}
                  >
                    {word}
                  </motion.span>
                );
              })}
            </h2>
            <motion.p 
              className="text-base lg:text-lg text-black font-normal px-4 lg:px-0"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              We make saving simple, stress-free, and actually enjoyable.
            </motion.p>
          </div>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
          >
            <motion.div className="feature-card p-6 lg:p-8 text-center" variants={cardVariants}>
              <div className="icon-wrapper mx-auto mb-4 w-14 h-14 lg:w-16 lg:h-16 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-[#1447E6] icon-wrapper-transition" size={28} />
              </div>
              <h3 className="text-lg lg:text-xl font-bold mb-3 text-white">Steady Growth</h3>
              <p className="text-sm lg:text-base text-white">
                Watch your savings grow  with our smart tracking tools.
              </p>
            </motion.div>
            <motion.div className="feature-card p-6 lg:p-8 text-center" variants={cardVariants}>
              <div className="icon-wrapper mx-auto mb-4 w-14 h-14 lg:w-16 lg:h-16 rounded-lg flex items-center justify-center">
                <ShieldCheck className="text-[#1447E6] icon-wrapper-transition" size={28} />
              </div>
              <h3 className="text-lg lg:text-xl font-bold mb-3 text-white">Safe & Secure</h3>
              <p className="text-sm lg:text-base text-white">
                Your financial journey is protected with security.
              </p>
            </motion.div>
            <motion.div className="feature-card p-6 lg:p-8 text-center" variants={cardVariants}>
              <div className="icon-wrapper mx-auto mb-4 w-14 h-14 lg:w-16 lg:h-16 rounded-lg flex items-center justify-center">
                <Sparkles className="text-[#1447E6] icon-wrapper-transition" size={28} />
              </div>
              <h3 className="text-lg lg:text-xl font-bold mb-3 text-white">Build Discipline</h3>
              <p className="text-sm lg:text-base text-white">
                Develop lasting saving habits that transform your future.
              </p>
            </motion.div>
            <motion.div className="feature-card p-6 lg:p-8 text-center" variants={cardVariants}>
              <div className="icon-wrapper mx-auto mb-4 w-14 h-14 lg:w-16 lg:h-16 rounded-lg flex items-center justify-center">
                <PiggyBank className="text-[#1447E6] icon-wrapper-transition" size={28} />
              </div>
              <h3 className="text-lg lg:text-xl font-bold mb-3 text-white">No Pressure</h3>
              <p className="text-sm lg:text-base text-white">
                Save at your own pace. Every little bit counts.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </>
  )
}
