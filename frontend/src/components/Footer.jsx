import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div className="padding-[20px] text-center border-t border-neutral-600">
      <div className="flex flex-wrap justify-around my-[20px]">
        {/* <div className="footer-section">
          <h2>About Us</h2>
          <p>
            We are a company committed to providing excellent service. Lorem ipsum dolor sit amet consectetur
            adipisicing elit.
          </p>
        </div> */}

        <div className="footer-section">
          <h2 className="mb-2">Följ mig</h2>
          <Link
            className="text-black/70 dark:text-white/70 hover:text-primary dark:hover:text-primary duration-200 block text-sm"
            to="https://www.facebook.com/Varingagardet"
            target="_blank"
            rel="noopener noreferrer"
          >
            Facebook
          </Link>
          <Link
            className="text-black/70 dark:text-white/70 hover:text-primary dark:hover:text-primary duration-200 block text-sm"
            to="https://varingasagan.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Varingasagan
          </Link>
          <Link
            className="text-black/70 dark:text-white/70 hover:text-primary dark:hover:text-primary duration-200 block text-sm"
            to="https://www.linkedin.com/in/leif-selander-792b7624/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </Link>
        </div>

        <div className="footer-section">
          <h2 className="mb-2">Kontakt</h2>
          <p className="text-black/70 dark:text-white/70 block text-sm">
            leif.selander@gmail.com
          </p>
        </div>

        <div className="footer-section ">
          <h2 className="mb-2">Länkar</h2>
          <Link
            className="text-black/70 dark:text-white/70 hover:text-primary dark:hover:text-primary duration-200 block text-sm"
            to="/"
          >
            Hem
          </Link>
          <Link
            className="text-black/70 dark:text-white/70 hover:text-primary dark:hover:text-primary duration-200 block text-sm"
            to="/books"
          >
            Böcker
          </Link>
          <Link
            className="text-black/70 dark:text-white/70 hover:text-primary dark:hover:text-primary duration-200 block text-sm"
            to="/audioBooks"
          >
            Ljudböcker
          </Link>
          <Link
            className="text-black/70 dark:text-white/70 hover:text-primary dark:hover:text-primary duration-200 block text-sm"
            to="/about"
          >
            Om
          </Link>
        </div>
      </div>

      <div className="footer-bottom border-t border-neutral-600">
        <p>&copy; 2024 Varingasagan. All rights reserved.</p>
      </div>
    </div>
  );
}
