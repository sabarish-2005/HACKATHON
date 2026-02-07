import { motion } from "framer-motion";
import { Play, Video } from "lucide-react";

interface VideoSectionProps {
  title: string;
  subtitle?: string;
  videoPlaceholder?: string;
}

const VideoSection = ({ title, subtitle, videoPlaceholder }: VideoSectionProps) => {
  return (
    <section className="section-container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="section-title gradient-text">{title}</h2>
        {subtitle ? <p className="section-subtitle">{subtitle}</p> : null}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-4xl mx-auto"
      >
        <div className="glass-card-hover p-2 rounded-2xl">
          <div className="relative aspect-video bg-muted rounded-xl overflow-hidden group cursor-pointer">
            {/* Video Placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-background flex items-center justify-center">
              <div className="text-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-20 h-20 rounded-full bg-primary/20 backdrop-blur-xl border border-primary/30 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/30 transition-colors neon-glow"
                >
                  <Play className="w-8 h-8 text-primary ml-1" />
                </motion.div>
                <p className="text-muted-foreground">
                  {videoPlaceholder || "Video will be embedded here"}
                </p>
              </div>
            </div>

            {/* Video Icon Badge */}
            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full glass-card">
              <Video className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-muted-foreground">Video</span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default VideoSection;
