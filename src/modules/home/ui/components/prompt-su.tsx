"use client";

import { motion } from "framer-motion";
import { FaAws } from "react-icons/fa6";
import {
  SiClerk,
  SiCloudflare,
  SiDocker,
  SiFirebase,
  SiNextdotjs,
  SiOpenai,
  SiPostman,
  SiReact,
  SiTailwindcss,
  SiTrpc,
  SiPrisma,
} from "react-icons/si";
import { FiCodesandbox } from "react-icons/fi";
import ShinyText from "@/components/ShinyText";

const poweredBy = [
  { name: "React", tooltip: "React — UI Library", icon: <SiReact /> },
  { name: "Next.js", tooltip: "Next.js — React Framework", icon: <SiNextdotjs /> },
  { name: "Clerk", tooltip: "Clerk — Auth", icon: <SiClerk /> },
  { name: "OpenAI", tooltip: "OpenAI — GPT 5", icon: <SiOpenai /> },
  { name: "AWS", tooltip: "AWS — Cloud Platform", icon: <FaAws /> },
  { name: "tRPC", tooltip: "tRPC — Type-safe APIs", icon: <SiTrpc /> },
  { name: "Cloudflare", tooltip: "Cloudflare — CDN & Security", icon: <SiCloudflare /> },
  { name: "Docker", tooltip: "Docker — Containers", icon: <SiDocker /> },
  { name: "e2b", tooltip: "e2b — Code Hosting", icon: <FiCodesandbox /> },
  { name: "TailwindCSS", tooltip: "Tailwind CSS — Styling", icon: <SiTailwindcss /> },
  { name: "Postman", tooltip: "Postman — API Testing", icon: <SiPostman /> },
  { name: "Prisma", tooltip: "Prisma — Database ORM", icon: <SiPrisma /> },
  { name: "Firebase", tooltip: "Firebase — Backend Platform", icon: <SiFirebase /> },
];

export const PoweredBy = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="inline-flex flex-col items-start bg-white/10 border border-white/20 backdrop-blur-md rounded-xl px-6 py-4 shadow-md gap-4 mt-13"
    >
      {/* Title */}
      <ShinyText text="Powered by" className="font-semibold" />

      {/* Icons */}
      <div className="flex flex-wrap gap-4">
        {poweredBy.map((tool, i) => (
          <motion.div
            key={tool.name}
            title={tool.tooltip}
            className="w-6 h-6 flex items-center justify-center text-2xl cursor-pointer text-foreground hover:text-primary"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 * i, type: "spring", stiffness: 300, damping: 20 }}
            whileHover={{ scale: 1.3, opacity: 1, transition: { type: "spring", stiffness: 400 } }}
            whileTap={{ scale: 0.95 }}
          >
            {tool.icon}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
