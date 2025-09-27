"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { 
  FaGithub, 
  FaLinkedin, 
  FaXTwitter, 
  FaYoutube, 
  FaSpotify 
} from "react-icons/fa6";

export const Footer = () => {
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);

  const socialLinks = [
    {
      name: "GitHub",
      icon: FaGithub,
      href: "https://github.com/vedant",
      color: "hover:text-gray-900 dark:hover:text-gray-100"
    },
    {
      name: "LinkedIn",
      icon: FaLinkedin,
      href: "https://linkedin.com/in/vedant",
      color: "hover:text-blue-600"
    },
    {
      name: "X",
      icon: FaXTwitter,
      href: "https://x.com/vedant",
      color: "hover:text-gray-900 dark:hover:text-gray-100"
    },
    {
      name: "YouTube",
      icon: FaYoutube,
      href: "https://youtube.com/@vedant",
      color: "hover:text-red-600"
    },
    {
      name: "Spotify",
      icon: FaSpotify,
      href: "https://spotify.com/vedant",
      color: "hover:text-green-500"
    }
  ];

  return (
    <footer className="bg-background border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-8 py-10">
        {/* Main Content */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Brand & Links */}
          <div className="flex flex-col sm:flex-row items-center gap-8">
            {/* Simple Logo */}
            <div className="flex items-center gap-3">
              <Image 
                src="/logo.svg" 
                alt="Nextly" 
                width={28} 
                height={28}
                className="w-7 h-7"
              />
              <h3 className="text-xl font-bold text-foreground">Nextly</h3>
            </div>

            {/* Enhanced Legal Links */}
            <div className="flex items-center gap-8">
              <Link 
                href="/terms" 
                className="group relative text-foreground font-medium hover:text-primary transition-colors duration-200 hover:translate-x-1 transform"
              >
                Terms
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300 ease-out"></span>
              </Link>
              <Link 
                href="/privacy" 
                className="group relative text-foreground font-medium hover:text-primary transition-colors duration-200 hover:translate-x-1 transform"
              >
                Privacy
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300 ease-out"></span>
              </Link>
            </div>
          </div>

          {/* Email */}
          <div>
            <a 
              href="mailto:vedant@nextly.live"
              className="group relative inline-block"
            >
              <span className="text-xl lg:text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                vedant@nextly.live
              </span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-500 ease-out"></span>
            </a>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-8 pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground">
            © 2025 Nextly. All rights reserved.
          </p>
          
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => {
              const IconComponent = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`relative p-2.5 rounded-xl text-muted-foreground ${social.color} transition-all duration-300 hover:bg-muted hover:-translate-y-1 hover:shadow-lg hover:shadow-black/10`}
                  onMouseEnter={() => setHoveredSocial(social.name)}
                  onMouseLeave={() => setHoveredSocial(null)}
                  aria-label={`Follow on ${social.name}`}
                >
                  <IconComponent className="w-6 h-6" />
                  
                  {/* Tooltip */}
                  <span 
                    className={`absolute -top-10 left-1/2 transform -translate-x-1/2 px-4 py-2 text-md font-medium text-primary-foreground bg-foreground rounded-lg opacity-0 pointer-events-none transition-all duration-200 whitespace-nowrap ${
                      hoveredSocial === social.name 
                        ? 'opacity-100 -translate-y-1 dark:bg-primary dark:text-primary-foreground' 
                        : 'opacity-0 translate-y-0 dark:bg-primary dark:text-primary-foreground'
                    }`}
                  >
                    {social.name}
                    <span className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-foreground rotate-45"></span>
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};
