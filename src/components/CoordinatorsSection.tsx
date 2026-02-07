import { motion } from "framer-motion";
import staff1Image from "@/assets/staff-1.jpeg";
import staff2Image from "@/assets/staff-2.jpeg";
import staff3Image from "@/assets/staff-3.jpeg";
import staff4Image from "@/assets/staff-4.jpeg";
import student1Image from "@/assets/student-1.jpeg";
import student2Image from "@/assets/student-2.jpeg";

const coordinators = [
  {
    role: "Head of the Department",
    name: "Dr. S. Vinodkumar",
    qualification: "M.Sc. (CS), MCA, M.Phil., Ph.D.",
    email: "",
    phone: "+91 99422 57187",
    avatar: "S1",
    image: staff4Image,
  },
  {
    role: "Assistant Professor",
    name: "Mrs.A. Manjurekha",
    qualification: "M.Sc. (CS), M.Phil.",
    email: "",
    phone: "+91 90427 72666",
    avatar: "S3",
    image: staff3Image,
  },
  {
    role: "Assistant Professor",
    name: "Dr. M. Prakash",
    qualification: "MCA, Ph.D.",
    email: "",
    phone: "+91 95851 33177",
    avatar: "S2",
    image: staff2Image,
  },
  {
    role: "Assistant Professor",
    name: "Mrs. P. Christina",
    qualification: "M.Sc. (CS)",
    email: "",
    phone: "+91 89033 94981",
    avatar: "S4",
    image: staff1Image,
  },
  {
    role: "Student Coordinator",
    name: "SABARISH V",
    email: "sabarishv36@gmail.com",
    phone: "+91 9043695759",
    avatar: "AA",
    image: "/publicstudent.jpg1.jpeg",
  },
  {
    role: "Student Coordinator",
    name: "AKASH AK",
    email: "akashaiml07@gmail.com",
    phone: "+91 9087501009",
    avatar: "SV",
    image: student1Image,
  },
];

const CoordinatorsSection = () => {
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
          Event <span className="gradient-text">Coordinators</span>
        </h2>
        <p className="section-subtitle">
          Get in touch with our coordinators for any queries or assistance
        </p>
      </motion.div>

      <div className="cards">
        {coordinators.map((coordinator, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="coordinator-card">
              {coordinator.image ? (
                <img src={coordinator.image} alt={coordinator.name} />
              ) : (
                <div className="w-[90px] h-[90px] rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto">
                  <span className="text-2xl font-display font-bold text-primary-foreground">
                    {coordinator.avatar}
                  </span>
                </div>
              )}

              <div className="designation">{coordinator.role}</div>

              <div className="name">{coordinator.name}</div>

              <div className="qualification">{coordinator.qualification ?? ""}</div>

              {coordinator.email ? (
                <a href={`mailto:${coordinator.email}`} className="contact">
                  <span className="icon">📧</span>
                  {coordinator.email}
                </a>
              ) : null}
              <a href={`tel:${coordinator.phone}`} className="contact">
                <span className="icon">📞</span>
                {coordinator.phone}
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CoordinatorsSection;
