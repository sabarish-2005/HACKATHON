import { useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Brain, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-ai-robot.jpg";

const HeroSection = () => {
  const isSmallScreen =
    typeof window !== "undefined" && window.matchMedia("(max-width: 640px)").matches;
  const particleCount = isSmallScreen ? 0 : 20;
  const particles = useMemo(
    () =>
      Array.from({ length: particleCount }, () => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: 2 + Math.random() * 2,
        delay: Math.random() * 2,
      })),
    [particleCount]
  );

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="AI Robot"
          className="w-full h-full object-cover object-center"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Animated Background Elements */}
      {!isSmallScreen && (
        <div className="absolute inset-0 z-0">
          {particles.map((particle, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/30 rounded-full"
              style={{
                left: particle.left,
                top: particle.top,
              }}
              animate={{
                opacity: [0.2, 1, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
              }}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Badge */}
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-full glass-card mb-6 backdrop-blur-md bg-black/40 border-2 border-cyan-500/30 text-center"
          >
            <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
            <motion.span 
              className="text-xs sm:text-sm md:text-lg lg:text-xl font-extrabold uppercase tracking-wide text-cyan-400"
              animate={
                isSmallScreen
                  ? undefined
                  : {
                      textShadow: [
                        "0 0 20px rgba(6, 182, 212, 1), 0 0 30px rgba(6, 182, 212, 0.8), 0 0 40px rgba(6, 182, 212, 0.6), 0 0 50px rgba(6, 182, 212, 0.4)",
                        "0 0 30px rgba(6, 182, 212, 1), 0 0 40px rgba(6, 182, 212, 0.8), 0 0 50px rgba(6, 182, 212, 0.6), 0 0 60px rgba(6, 182, 212, 0.4)",
                        "0 0 20px rgba(6, 182, 212, 1), 0 0 30px rgba(6, 182, 212, 0.8), 0 0 40px rgba(6, 182, 212, 0.6), 0 0 50px rgba(6, 182, 212, 0.4)",
                      ],
                    }
              }
              transition={
                isSmallScreen
                  ? undefined
                  : {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }
              }
            >
              <span className="block sm:inline">DEPARTMENT OF ARTIFICIAL INTELLIGENCE</span>
              <span className="block sm:inline">AND MACHINE LEARNING PRESENTS</span>
            </motion.span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6"
          >
            <span className="block text-foreground">TECHNOVA AI</span>
            <span className="block gradient-text">HACKATHON 2K'26</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-muted-foreground mb-4 font-display tracking-wide"
          >
            <span className="neon-text">Innovate</span>
            <span className="mx-3 text-border">•</span>
            <span className="neon-text-purple">Code</span>
            <span className="mx-3 text-border">•</span>
            <span className="neon-text">Create</span>
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            Join us for an exciting one-day technical hackathon where innovation meets opportunity. 
            Build, collaborate, and showcase your skills!
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-8 mb-10"
          >
            {[
              { icon: Brain, label: "AI/ML Focused", value: "Theme" },
              { icon: Code, label: "Departments", value: "7+" },
              { icon: Sparkles, label: "Duration", value: "6 Hours" },
            ].map((stat, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-lg font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button variant="hero" size="xl" asChild>
              <Link to="/register">
                Register Now
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <a href="#about">Learn More</a>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      {!isSmallScreen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-primary/50 flex items-start justify-center p-2"
          >
            <motion.div className="w-1 h-2 bg-primary rounded-full" />
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default HeroSection;
