// src/pages/Index.jsx
import Header from "@/components/_Header";
import Button from "@/components/_Button";
import StickyNotesCard from "@/components/_StickyNotesCard";
import { motion } from "framer-motion";
import {
  Play,
  Download,
  ArrowRight,
  CheckCircle,
  Calendar,
  TrendingUp,
  Target,
  Zap,
} from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: Calendar,
      title: "Custom Duration Lists",
      description:
        "Create to-do lists for any number of days. Plan your tasks for a week, month, or any custom period.",
    },
    {
      icon: CheckCircle,
      title: "Daily Check-ins",
      description:
        "Check off tasks as you complete them. Unchecked tasks are automatically recorded for review.",
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      description:
        "Watch your progress grow. See which days you completed and where you can improve.",
    },
    {
      icon: Target,
      title: "Set Goals",
      description:
        "Define clear objectives for each day and track your achievement rate over time.",
    },
    {
      icon: Zap,
      title: "Quick Reset",
      description:
        "Tasks reset automatically each day, keeping your focus on what matters today.",
    },
    {
      icon: TrendingUp,
      title: "Analytics",
      description:
        "Get insights into your productivity patterns and celebrate your streaks.",
    },
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section — Grade 2 paper background */}
      <section className="min-h-screen flex items-center justify-center relative pt-20 bg-bgLight overflow-hidden">
        {/* Horizontal ruled lines */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="absolute w-full h-px bg-blue-300/40"
              style={{ top: `${i * 32 + 64}px` }}
            />
          ))}
          <div className="absolute top-0 bottom-0 left-24 w-px bg-red-400/50" />
          <div className="absolute top-20 left-0 right-0 h-px bg-blue-300/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bgLight/80" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h1
            className="font-logo text-5xl md:text-7xl lg:text-8xl mb-6 tracking-wide"
            style={{ fontWeight: 700 }}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-secondary">Track Your</span>
            <span className="text-primary block">Daily Progress</span>
          </motion.h1>
          <motion.p
            className="text-gray-700 text-lg md:text-xl max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Build custom task lists, check in every day, and stay consistent
            with DoTrack's simple tracking system.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button variant="primary" icon={Play}>
              Start Tracking
            </Button>
            <Button variant="outline" icon={Download}>
              Download App
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section — Green Blackboard with Chalk Residue Effect */}
      <section className="py-16 px-8 bg-white">
        {/* Wooden frame — layered borders to mimic thick wood */}
        <div className="border-[16px] border-amber-700 rounded-sm shadow-2xl mx-auto max-w-6xl">
          <div className="border-[6px] border-amber-900 rounded-sm">
            {/* Blackboard surface */}
            <div className="bg-emerald-900 px-10 py-16 relative overflow-hidden rounded-sm">
              {/* Chalk residue / erased effect — white smudges like chalk left behind */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Main erased chalk streaks */}
                <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(ellipse_at_20%_30%,_white_0%,_transparent_50%),_radial-gradient(ellipse_at_80%_70%,_white_0%,_transparent_50%),_radial-gradient(ellipse_at_40%_85%,_white_0%,_transparent_60%),_radial-gradient(ellipse_at_60%_15%,_white_0%,_transparent_50%)]" />

                {/* Horizontal chalk swipe marks */}
                <div className="absolute top-1/4 left-0 w-full h-12 bg-gradient-to-r from-transparent via-white/15 to-transparent blur-sm rotate-3" />
                <div className="absolute top-2/3 left-0 w-full h-8 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-sm -rotate-2" />
                <div className="absolute top-3/4 left-0 w-3/4 h-6 bg-gradient-to-r from-white/5 via-white/12 to-transparent blur-md rotate-1" />

                {/* Vertical chalk drips / residue spots */}
                <div className="absolute top-10 left-1/4 w-px h-20 bg-white/20 blur-[1px] rotate-12" />
                <div className="absolute top-20 left-2/3 w-px h-32 bg-white/15 blur-[1px] -rotate-6" />
                <div className="absolute top-40 right-1/3 w-px h-24 bg-white/10 blur-[1px] rotate-6" />

                {/* Chalk dust clusters */}
                <div className="absolute top-32 left-16 w-24 h-16 bg-white/5 rounded-full blur-xl" />
                <div className="absolute bottom-20 right-12 w-32 h-20 bg-white/6 rounded-full blur-xl" />
                <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-white/5 rounded-full blur-xl" />
                <div className="absolute bottom-32 left-1/4 w-28 h-14 bg-white/4 rounded-full blur-xl" />

                {/* Erased text ghost marks — faint white horizontal lines */}
                <div className="absolute top-28 left-8 right-8 h-3 bg-white/8 rounded-full blur-sm" />
                <div className="absolute top-40 left-12 right-12 h-2 bg-white/6 rounded-full blur-sm" />
                <div className="absolute top-52 left-10 right-24 h-2.5 bg-white/7 rounded-full blur-sm" />
                <div className="absolute top-64 left-20 right-16 h-2 bg-white/5 rounded-full blur-sm" />

                {/* Corner chalk buildup (where eraser leaves more residue) */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-white/12 via-white/5 to-transparent rounded-bl-full" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-white/10 via-white/3 to-transparent rounded-tr-full" />

                {/* Random chalk speckles */}
                {[...Array(30)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute bg-white rounded-full opacity-[0.03-0.12]"
                    style={{
                      width: `${Math.random() * 4 + 1}px`,
                      height: `${Math.random() * 4 + 1}px`,
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      opacity: Math.random() * 0.1 + 0.02,
                    }}
                  />
                ))}
              </div>

              {/* Faint chalk smudge spots (original) */}
              <div className="absolute top-8 left-12 w-40 h-20 bg-white/[0.03] rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-16 right-16 w-56 h-28 bg-white/[0.03] rounded-full blur-3xl pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-36 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                {/* Section header */}
                <motion.div
                  className="text-center mb-16"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-4xl md:text-5xl mb-4 tracking-wide font-bold text-white">
                    How <span className="text-green-400">DoTrack</span> Works?
                  </h2>
                  <p className="text-lg text-white/70 max-w-2xl mx-auto">
                    Simple, effective, and designed to keep you on track
                  </p>
                </motion.div>

                {/* Sticky notes grid */}
                <motion.div
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-80px" }}
                >
                  {features.map((feature, index) => (
                    <motion.div key={index} variants={fadeInUp}>
                      <StickyNotesCard
                        icon={feature.icon}
                        title={feature.title}
                        description={feature.description}
                        index={index}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.h2
            className="font-logo text-4xl md:text-5xl text-white mb-4 tracking-wide"
            style={{ fontWeight: 700 }}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Ready to Start Your Journey?
          </motion.h2>
          <motion.p
            className="text-white/90 text-lg mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Join thousands of users building better habits with DoTrack's
            flexible tracking system.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button
              variant="outline"
              icon={ArrowRight}
              className="bg-white text-primary hover:bg-gray-100 mx-auto"
            >
              Create Your First List
            </Button>
          </motion.div>
          <motion.p
            className="text-white/80 text-sm mt-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Free forever • No credit card required
          </motion.p>
        </div>
      </section>
    </div>
  );
};

export default Index;
