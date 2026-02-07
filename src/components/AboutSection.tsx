import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Users } from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "One-Day Event",
    description: "An intensive single-day hackathon designed to challenge and inspire",
  },
  {
    icon: Clock,
    title: "9:00 AM – 3:00 PM",
    description: "Six hours of non-stop innovation and coding",
  },
  {
    icon: Users,
    title: "Team of 2",
    description: "Collaborate with a partner to build amazing solutions",
  },
  {
    icon: MapPin,
    title: "Department Organized",
    description: "Hosted by the Department of AI & Machine Learning",
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="section-container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="section-title">
          About the <span className="gradient-text">Hackathon</span>
        </h2>
        <p className="section-subtitle">
          A premier technical event where students showcase their problem-solving abilities, 
          creativity, and technical expertise in artificial intelligence and machine learning.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="glass-card-hover h-full p-6 text-center">
              <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default AboutSection;
