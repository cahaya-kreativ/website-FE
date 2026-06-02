import React from "react";
import PropTypes from "prop-types";
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
      question: "Bagaimana cara memesan layanan?",
      answer: "Pastikan anda sudah memiliki akun di website kami, jika belum silahkan membuat akun terlebih dahulu. Setelah itu, silahkan login ke akun anda dan pilih layanan yang anda inginkan."
    },
    {
      id: 2,
      question: "Apakah saya bisa melakukan revisi setelah proyek selesai?",
      answer: "Ya, Anda dapat melakukan revisi setelah proyek selesai, asalkan masih dalam masa garansi. Revisi yang dilakukan hanya maksimal 3 kali perbaikan."
    },
    {
      id: 3,
      question: "Bagaimana proses konsultasi sebelum memulai proyek?",
      answer: "Konsultasi dapat dilakukan melalui fitur chat di website kami, silahkan klik tombol chat di bagian kontak kami. Namun, dipastikan anda sudah memiliki akun di website kami."
    },
    {
      id: 4,
      question: "Bagaimana cara proses pembayaran?",
      answer: "Pembayaran sementara dapat dilakukan melalui website kami, silahkan pilih metode pembayaran yang anda inginkan. Namun, pesanan yang anda pilih harus menunggu konfirmasi dari admin kami."
    }
  ];

  return (
    <div className="flex flex-col items-start justify-between bg-zinc-950 px-4 py-20 text-white md:flex-row md:px-8 lg:px-24">
      <div className="mb-10 w-full p-4 md:mb-0 md:w-5/12 lg:pr-12">
        <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-sm font-semibold tracking-wider uppercase">
          Tanya Jawab
        </span>
        <h2 className="mb-6 font-serif text-3xl font-bold md:text-4xl lg:text-5xl">
          Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">Questions</span>
        </h2>
        <p className="text-base text-gray-400 md:text-lg leading-relaxed">
          Temukan jawaban cepat untuk pertanyaan yang paling sering diajukan seputar layanan, pemesanan, hingga proses pengerjaan proyek kami.
        </p>
      </div>
      <div className="w-full md:w-7/12 space-y-4">
        {faqs.map((faq) => (
          <Accordion
            key={faq.id}
            open={open === faq.id}
            icon={<Icon id={faq.id} open={open} />}
            className="mb-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 px-6 backdrop-blur-sm transition-all hover:border-zinc-700"
          >
            <AccordionHeader
              onClick={() => handleOpen(faq.id)}
              className={`border-b-0 py-5 font-sans text-lg md:text-xl font-semibold transition-colors ${
                open === faq.id ? "text-amber-500" : "text-white hover:text-amber-400"
              }`}
            >
              {faq.question}
            </AccordionHeader>
            <AccordionBody className="pt-0 pb-5 text-base font-normal text-gray-400 leading-relaxed">
              {faq.answer}
            </AccordionBody>
          </Accordion>
        ))}
      </div>
    </div>
  );
}
