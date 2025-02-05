import { Link, useLocation, useNavigate } from "react-router-dom";
import { BookHeadphones, BookText, LibraryBig } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminNav() {
  const location = useLocation(); // Access location object
  const pathname = location.pathname; // Get the current pathname

  const adminLinks = [
    {
      label: "Alla titlar",
      path: "/admin",
      icon: <LibraryBig size={28} />,
    },
    {
      label: "Lägg till bok",
      path: "/admin/add-book",
      icon: <BookText size={28} />,
    },
    {
      label: "Lägg till ljudbok",
      path: "/admin/add-audiobook",
      icon: <BookHeadphones size={28} />,
    },
  ];

  return (
    <nav className="mb-6">
      <ul className="flex gap-6 mb-2 justify-center">
        <AnimatePresence>
          {adminLinks.map((link) => (
            <motion.li whileTap={{ scale: 0.95 }} key={link.path}>
              <Link
                to={link.path}
                className="flex flex-col justify-center items-center gap-1 relative"
              >
                {link.icon}

                {pathname === link.path ? (
                  <motion.div
                    className="h-[2px] w-full rounded-full absolute bg-primary z-0 left-0 -bottom-1"
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    layoutId="underline"
                    transition={{ type: "string", stiffness: 35 }}
                  />
                ) : null}
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </nav>
  );
}
