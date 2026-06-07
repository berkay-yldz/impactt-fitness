import { motion } from "framer-motion";
import { MessageSquare, Quote, Star } from "lucide-react";

const testimonialsData = [
  {
    id: 1,
    name: "Ahmet Y.",
    role: "Premium Üye",
    text: "Disiplin modu sayesinde 45 günlük serimi bozmadım. Kamera karşısında antrenman yapmak oyunlaştırma hissi veriyor!",
    rating: 5,
    initials: "AY",
  },
  {
    id: 2,
    name: "Ceren K.",
    role: "Ücretsiz Üye",
    text: "Masa başı çalışmaktan kamburum çıkmıştı. Postür modülüyle 2 haftada sırt ağrılarım azaldı. Harika bir yapay zeka sistemi.",
    rating: 5,
    initials: "CK",
  },
  {
    id: 3,
    name: "Burak T.",
    role: "Premium Üye",
    text: "Beslenme çeşitliliği harika. Sürekli tavuk pilav yemekten kurtuldum, AI dolabımdakilere göre enfes menüler çıkarıyor.",
    rating: 4,
    initials: "BT",
  },
  {
    id: 4,
    name: "Selin M.",
    role: "Premium Üye",
    text: "Başarı rozetleri beni çok motive ediyor. Dün 'Demir İrade' rozetini kazandım. Impact tam bir dijital kişisel koç.",
    rating: 5,
    initials: "SM",
  },
  {
    id: 5,
    name: "Oğuzhan D.",
    role: "Ücretsiz Üye",
    text: "Programın otomatik olarak zorluk seviyesini düşürmesi efsane bir özellik. Kendi limitlerime göre, sakatlanmadan ilerliyorum.",
    rating: 5,
    initials: "OD",
  },
  {
    id: 6,
    name: "Zeynep A.",
    role: "Premium Üye",
    text: "Daha önce spor salonuna dünya kadar para verdim ama bu kadar istikrarlı olamamıştım. Uygulamanın akıcılığı mükemmel.",
    rating: 5,
    initials: "ZA",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 20 } },
};

export default function Testimonials() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-impact-primary" />
          <h3 className="text-xl font-black">Topluluk & Başarı Hikayeleri</h3>
        </div>
        <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest border border-zinc-200 dark:border-zinc-800 px-3 py-1 rounded-full bg-zinc-50 dark:bg-zinc-900">
          Gerçek Kullanıcılar
        </span>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
      >
        {testimonialsData.map((item) => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            className="bg-white dark:bg-zinc-900/40 p-5 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 relative overflow-hidden group hover:border-impact-primary/30 transition-colors"
          >
            <Quote className="absolute top-4 right-4 w-10 h-10 text-zinc-100 dark:text-zinc-800/50 group-hover:text-impact-primary/10 transition-colors" />
            
            <div className="flex items-center gap-1 mb-4">
              {[...Array(item.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
              ))}
            </div>

            <p className="text-sm text-zinc-600 dark:text-zinc-300 font-medium mb-6 relative z-10">
              "{item.text}"
            </p>

            <div className="flex items-center gap-3 mt-auto relative z-10">
              <div className="w-10 h-10 rounded-full bg-impact-primary/20 text-impact-primary flex items-center justify-center font-black text-sm">
                {item.initials}
              </div>
              <div>
                <h4 className="font-bold text-sm text-zinc-900 dark:text-white">{item.name}</h4>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">{item.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
