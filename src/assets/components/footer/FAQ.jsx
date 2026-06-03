import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";

function Icon({ id, open }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`${id === open ? "rotate-180 text-amber-500" : "text-gray-400"} h-5 w-5 transition-transform duration-300`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
}

Icon.propTypes = {
  id: PropTypes.number.isRequired,
  open: PropTypes.number.isRequired,
};

export default function FAQ() {
  const [open, setOpen] = React.useState(0);

  const handleOpen = (value) => setOpen(open === value ? 0 : value);

  const faqs = [
    {
      id: 1,
      question: "Apakah Cahaya Kreativ menerima proyek dari luar kota atau luar negeri?",
      answer: "Tentu saja! Untuk layanan digital seperti Manajemen Media Sosial dan Pengembangan IT, kami melayani klien dari seluruh Indonesia hingga mancanegara secara online tanpa hambatan jarak. Sementara untuk layanan Dokumentasi (Foto & Video) luar kota, tim kami siap berangkat ke lokasi Anda dengan penyesuaian biaya akomodasi yang transparan."
    },
    {
      id: 2,
      question: "Bagaimana sistem pembayaran untuk memulai proyek?",
      answer: "Demi transparansi dan keamanan bersama, kami memberlakukan sistem Down Payment (DP) di awal sebelum proyek dimulai. Sisa pelunasan dapat dilakukan setelah Anda meninjau hasil akhir (preview) atau sebelum penyerahan file final dilakukan."
    },
    {
      id: 3,
      question: "Apakah saya bisa mengajukan revisi jika hasilnya belum sesuai?",
      answer: "Tentu bisa. Setiap paket layanan kami sudah dilengkapi dengan kuota revisi gratis yang jelas. Kami berkomitmen penuh untuk melakukan perbaikan hingga hasil akhirnya benar-benar sesuai dengan visi bisnis Anda."
    },
    {
      id: 4,
      question: "Berapa lama waktu yang dibutuhkan untuk menyelesaikan satu proyek?",
      answer: "Waktu pengerjaan akan disesuaikan dengan skala dan kompleksitas proyek Anda. Di awal kerja sama, kami akan memberikan timeline kerja yang jelas, detail, dan terukur, sehingga Anda bisa memantau perkembangannya dan memastikan proyek selesai tepat waktu."
    },
    {
      id: 5,
      question: "Bagaimana dengan hak cipta dan kepemilikan file setelah proyek selesai?",
      answer: "Setelah seluruh proses administrasi selesai, hak cipta dan kepemilikan penuh atas semua file dokumentasi, aset desain, hingga source code (untuk proyek IT) akan sepenuhnya diserahkan kepada Anda. Kami menjamin keamanan dan kerahasiaan seluruh aset bisnis Anda."
    },
    {
      id: 6,
      question: "Apakah saya bisa memesan layanan kustom di luar paket yang tersedia?",
      answer: "Sangat bisa! Kami memahami bahwa setiap bisnis memiliki kebutuhan dan anggaran yang berbeda. Anda dapat berkonsultasi terlebih dahulu dengan tim kami untuk membuat paket kustom yang dirancang khusus, baik hanya untuk satu jenis jasa maupun gabungan dari berbagai layanan kami."
    },
    {
      id: 7,
      question: "Bagaimana alur kerja sama dengan Cahaya Kreativ dari awal sampai selesai?",
      answer: (
        <div className="flex flex-col gap-3">
          <p>Alur kerja kami dibuat sangat jelas dan terstruktur melalui beberapa tahapan:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong className="text-gray-300">Konsultasi & Briefing:</strong> Diskusi awal untuk memahami kebutuhan, visi, dan goals bisnis Anda.</li>
            <li><strong className="text-gray-300">Perencanaan & Kontrak:</strong> Penyusunan konsep kreatif, kesepakatan timeline, biaya, serta pembayaran DP.</li>
            <li><strong className="text-gray-300">Proses Produksi:</strong> Tim kami mulai mengeksekusi proyek (baik syuting, desain media sosial, atau coding sistem IT).</li>
            <li><strong className="text-gray-300">Review & Revisi:</strong> Kami memberikan hasil awal kepada Anda untuk ditinjau dan direvisi jika ada bagian yang kurang sesuai.</li>
            <li><strong className="text-gray-300">Pelunasan & Handover:</strong> Setelah hasil disetujui dan administrasi dilunasi, seluruh file final atau akses sistem akan diserahkan sepenuhnya kepada Anda.</li>
          </ul>
        </div>
      )
    }
  ];

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="flex flex-col items-start justify-between bg-zinc-950 px-4 py-24 text-white md:flex-row md:px-8 lg:px-24 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-12 w-full p-4 md:mb-0 md:w-5/12 lg:pr-12 sticky top-28"
      >
        <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-sm font-semibold tracking-wider uppercase">
          Tanya Jawab
        </span>
        <h2 className="mb-6 font-serif text-3xl font-bold md:text-4xl lg:text-5xl leading-tight">
          Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">Questions</span>
        </h2>
        <p className="text-base text-gray-400 md:text-lg leading-relaxed">
          Temukan jawaban cepat untuk pertanyaan yang paling sering diajukan seputar layanan kreatif, pemesanan, hingga proses pengerjaan proyek teknologi kami.
        </p>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="w-full md:w-7/12 space-y-4"
      >
        {faqs.map((faq) => (
          <motion.div key={faq.id} variants={itemVariants}>
            <Accordion
              open={open === faq.id}
              icon={<Icon id={faq.id} open={open} />}
              className="mb-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 px-6 backdrop-blur-sm transition-all duration-300 hover:border-amber-500/30 hover:bg-zinc-900/60 hover:shadow-lg hover:shadow-amber-500/5"
            >
              <AccordionHeader
                onClick={() => handleOpen(faq.id)}
                className={`border-b-0 py-5 font-sans text-base md:text-lg lg:text-xl font-semibold transition-colors leading-snug ${
                  open === faq.id ? "text-amber-500" : "text-white hover:text-amber-400"
                }`}
              >
                {faq.question}
              </AccordionHeader>
              <AccordionBody className="pt-0 pb-5 text-sm md:text-base font-normal text-gray-400 leading-relaxed">
                {faq.answer}
              </AccordionBody>
            </Accordion>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
