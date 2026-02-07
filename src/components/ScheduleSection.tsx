import { motion } from "framer-motion";
import { Clock, Award, Code2, Mic, Trophy } from "lucide-react";

const schedule = [
  {
    time: "9:00 – 9:30",
    event: "Inauguration",
    description: "Welcome address and event kickoff",
    icon: Mic,
    color: "from-cyan-500 to-blue-500",
  },
  {
    time: "9:30 – 1:30",
    event: "Hackathon Session",
    description: "Intensive coding and development phase",
    icon: Code2,
    color: "from-violet-500 to-purple-500",
  },
  {
    time: "1:30 – 2:30",
    event: "Project Evaluation",
    description: "Judging panel reviews all submissions",
    icon: Award,
    color: "from-pink-500 to-rose-500",
  },
  {
    time: "2:30 – 3:00",
    event: "Results & Valedictory",
    description: "Winner announcements and closing ceremony",
    icon: Trophy,
    color: "from-amber-500 to-orange-500",
  },
];

const ScheduleSection = () => {
  return (
    <section className="section-container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="section-title">
          Event <span className="gradient-text">Schedule</span>
        </h2>
        <p className="section-subtitle">
          A carefully planned timeline to maximize your hackathon experience
        </p>
      </motion.div>

      <div className="max-w-4xl mx-auto">
        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-[27px] md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-primary/20" />

          {schedule.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative flex items-center gap-4 md:gap-8 mb-8 ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Timeline Node */}
              <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 z-10">
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center neon-glow`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Content Card */}
              <div className={`ml-20 md:ml-0 md:w-[calc(50%-40px)] ${index % 2 === 0 ? "md:pr-8 md:text-right" : "md:pl-8"}`}>
                <div className="glass-card-hover p-5">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-primary font-mono font-semibold">{item.time}</span>
                  </div>
                  <h3 className="font-display font-bold text-xl mb-1">{item.event}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScheduleSection;
