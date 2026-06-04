import { motion } from "framer-motion";
import { UserCircle2, Quote, Star } from "lucide-react";

const testimonials = [
  { id: 1, name: "Ali K.", role: "Premium Üye", story: "Impact sayesinde postürüm düzeldi, bilgisayar başındaki bel ağrılarım tamamen geçti!" },
  { id: 2, name: "Zeynep Y.", role: "Ücretsiz Üye", story: "Disiplin modu gerçekten harika çalışıyor. Yapay zeka beni bizzat izlediği için kaytaramıyorum." },
  { id: 3, name: "Burak T.", role: "Premium Üye", story: "Beslenme modülündeki çeşitlilik algoritması sayesinde her gün aynı şeyleri yemekten kurtuldum." },
  { id: 4, name: "Cemre S.", role: "Ücretsiz Üye", story: "Verilen antrenman desteleri tam seviyeme göre. Başaramadığımda sistemin otomatik uyum sağlaması mükemmel." },
  { id: 5, name: "Mert A.", role: "Premium Üye", story: "Kamera analizi ile şınav formumu düzelttim. Önceden yanlış yaptığım için omuzlarım ağrıyormuş." },
  { id: 6, name: "Elif B.", role: "Premium Üye", story: "Günlük streak takibi ve aldığım momentum rozetleri beni her gün motive ediyor!" }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 20 } }
};

export default function Testimonials() {
  return (
    <section className="py-8">
      <div className="flex items-center gap-2 mb-6">
        <Quote className="w-6 h-6 text-impact-primary" />
        <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Topluluk <span className="text-impact-primary">Hikayeleri</span></h2>
      </div>
      
      <motion.div 
        variants={containerVariants} 
        initial="hidden" 
        animate="show" 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {testimonials.map((t) => (
          <motion.div key={t.id} variants={itemVariants} className="bg-white dark:bg-impact-surface p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group hover:border-impact-primary/40 transition-colors duration-300">
            <div className="flex items-center gap-3 mb-4">
              <UserCircle2 className="w-10 h-10 text-zinc-300 dark:text-zinc-600 group-hover:text-impact-primary transition-colors duration-300" />
              <div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-white">{t.name}</h4>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-impact-primary fill-current" />
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t.role}</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 italic leading-relaxed">"{t.story}"</p>
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Quote className="w-16 h-16 text-zinc-900 dark:text-white" />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
