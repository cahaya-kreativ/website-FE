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
      className={`${id === open ? "rotate-180" : ""} h-5 w-5 transition-transform`}
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

  return (
    <div className="flex h-[60%] flex-col items-start justify-between bg-zinc-800 px-4 py-8 text-white md:flex-row md:px-6 lg:px-32">
      <div className="mb-4 w-full p-4 md:mb-0 md:w-1/2">
        <h2 className="mb-6 text-center font-serif text-xl font-bold md:text-left md:text-3xl lg:text-left lg:text-4xl">
          Frequently Asked Question
        </h2>
        <p className="text-center text-base text-gray-300 md:text-left md:text-lg lg:text-left">
          Di sini Anda dapat menemukan jawaban untuk pertanyaan yang sering
          diajukan mengenai layanan kami.
        </p>
      </div>
      <div className="w-full p-4 md:w-1/2">
        <Accordion
          open={open === 1}
          icon={<Icon id={1} open={open} />}
          className="mb-4"
        >
          <AccordionHeader
            onClick={() => handleOpen(1)}
            className={`mb-2 cursor-pointer rounded-md border-2 px-4 text-2xl transition-transform ${open === 1 ? "bg-gray-700" : ""} hover:scale-105 hover:bg-gray-700`}
          >
            Bagaimana cara memesan layanan?
          </AccordionHeader>
          <AccordionBody className="rounded-md border-2 border-white px-4 text-lg text-white">
            Pastikan anda sudah memiliki akun di website kami, jika belum
            silahkan membuat akun terlebih dahulu. Setelah itu, silahkan login
            ke akun anda dan pilih layanan yang anda inginkan.
          </AccordionBody>
        </Accordion>
        <Accordion
          open={open === 3}
          icon={<Icon id={3} open={open} />}
          className="mb-4"
        >
          <AccordionHeader
            onClick={() => handleOpen(3)}
            className={`mb-2 cursor-pointer rounded-md border-2 px-4 text-2xl transition-transform ${open === 3 ? "bg-gray-700" : ""} hover:scale-105 hover:bg-gray-700`}
          >
            Bagaimana proses konsultasi sebelum memulai proyek?
          </AccordionHeader>
          <AccordionBody className="rounded-md border-2 border-white px-4 text-lg text-white">
            Konsultasi dapat dilakukan melalui fitur chat di website kami,
            silahkan klik tombol chat di bagian kontak kami. Namun, dipastikan
            anda sudah memiliki akun di website kami, jika belum silahkan
            membuat akun terlebih dahulu.
          </AccordionBody>
        </Accordion>
        <Accordion
          open={open === 4}
          icon={<Icon id={4} open={open} />}
          className="mb-4"
        >
          <AccordionHeader
            onClick={() => handleOpen(4)}
            className={`mb-2 cursor-pointer rounded-md border-2 px-4 text-2xl transition-transform ${open === 4 ? "bg-gray-700" : ""} hover:scale-105 hover:bg-gray-700`}
          >
            Bagaimana cara proses pembayaran?
          </AccordionHeader>
          <AccordionBody className="rounded-md border-2 border-white px-4 text-lg text-white">
            Pembayaran sementara dapat dilakukan melalui website kami, silahkan
            pilih metode pembayaran yang anda inginkan. Namun, pesanan yang anda
            pilih harus menunggu konfirmasi dari admin kami.
          </AccordionBody>
        </Accordion>
        <Accordion
          open={open === 2}
          icon={<Icon id={2} open={open} />}
          className="mb-4"
        >
          <AccordionHeader
            onClick={() => handleOpen(2)}
            className={`mb-2 cursor-pointer rounded-md border-2 px-4 text-2xl transition-transform ${open === 2 ? "bg-gray-700" : ""} hover:scale-105 hover:bg-gray-700`}
          >
            Apakah saya bisa melakukan revisi setelah proyek selesai?
          </AccordionHeader>
          <AccordionBody className="rounded-md border-2 border-white px-4 text-lg text-white">
            Ya, Anda dapat melakukan revisi setelah proyek selesai, asalkan
            masih dalam masa garansi. Revisi yang dilakukan hanya maksimal 3
            kali perbaikan
          </AccordionBody>
        </Accordion>
        {/* <Accordion
          open={open === 5}
          icon={<Icon id={5} open={open} />}
          className="mb-4"
        >
          <AccordionHeader
            onClick={() => handleOpen(5)}
            className={`mb-2 cursor-pointer rounded-md border-2 px-4 text-2xl transition-transform ${open === 5 ? "bg-gray-700" : ""} hover:scale-105 hover:bg-gray-700`}
          >
            What can I do with Material Tailwind?
          </AccordionHeader>
          <AccordionBody className="rounded-md border-2 border-white px-4 text-lg text-white">
            We&apos;re not always in the position that we want to be at.
            We&apos;re constantly growing. We&apos;re constantly making
            mistakes. We&apos;re constantly trying to express ourselves and
            actualize our dreams.
          </AccordionBody>
        </Accordion> */}
      </div>
    </div>
  );
}
