import { Link } from "react-router-dom";
import { FiGithub, FiLinkedin } from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-neutral text-neutral-content">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-[#38909D] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">CS</span>
              </div>
              <span className="text-xl font-bold">
                Club<span className="text-[#F6851F]">Sphere</span>
              </span>
            </div>
            <p className="text-base-content/120 max-w-md">
              Connect with local clubs, manage memberships, and discover
              exciting events in your community. Join the sphere of
              possibilities.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/clubs"
                  className="hover:text-primary transition-colors"
                >
                  Browse Clubs
                </Link>
              </li>
              <li>
                <Link
                  to="/events"
                  className="hover:text-primary transition-colors"
                >
                  Upcoming Events
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="hover:text-primary transition-colors"
                >
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Connect</h3>
            <div className="flex gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-circle"
              >
                <FiGithub size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-circle"
              >
                <FiLinkedin size={20} />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-circle"
              >
                <FaXTwitter size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="divider my-8"></div>

        <div className="text-center text-base-content/60 text-sm">
          <p className="text-gray-500">
            &copy; {new Date().getFullYear()} ClubSphere. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
