import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";

const departments = [
  { code: "AIML", name: "Artificial Intelligence & Machine Learning", color: "from-cyan-500 to-blue-500" },
  { code: "CS", name: "Computer Science", color: "from-violet-500 to-purple-500" },
  { code: "CT", name: "Computer Technology", color: "from-pink-500 to-rose-500" },
  { code: "IT", name: "Information Technology", color: "from-green-500 to-emerald-500" },
  { code: "BCA", name: "Bachelor of Computer Applications", color: "from-orange-500 to-amber-500" },
  { code: "DCFS", name: "Digital and Cyber Forensic Science", color: "from-red-500 to-rose-500" },
  { code: "CSDA", name: "Computer Science with Data Analytics", color: "from-indigo-500 to-blue-500" },
];

const DepartmentsSection = () => {
  return (
    <section className="section-container bg-muted/20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="section-title">
          Eligible <span className="gradient-text">Departments</span>
        </h2>
        <p className="section-subtitle">
          Students from the following departments are invited to participate in this exciting hackathon
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-6xl mx-auto">
        {departments.map((dept, index) => (
          <motion.div
            key={dept.code}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="glass-card p-4 rounded-lg border border-primary/20 hover:border-primary/50 transition-all cursor-pointer flex items-center gap-4"
          >
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${dept.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-display font-bold text-lg text-foreground">{dept.code}</p>
              <p className="text-xs text-muted-foreground">{dept.name}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default DepartmentsSection;
