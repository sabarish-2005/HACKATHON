import { Link } from "react-router-dom";
import { Cpu, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/30">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Cpu className="w-5 h-5 text-primary" />
            </div>
            <span className="font-display font-bold gradient-text">
              Hackathon 2026
            </span>
          </Link>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <Link to="/register" className="hover:text-primary transition-colors">Register</Link>
            <Link to="/admin" className="hover:text-primary transition-colors">Admin</Link>
          </div>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Website created by Sabarish V, III B.Sc. AIML
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
