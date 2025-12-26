"use client";

import { Code2, Github, Instagram, Globe, Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/5 bg-[#09090b] pt-16 pb-8 mt-20">
      {/* Decorative Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-500/20 rounded border border-indigo-500/30">
                <Code2 className="w-5 h-5 text-indigo-400" />
              </div>
              <span className="text-sm font-mono text-indigo-400 tracking-wider uppercase">
                Class Companion
              </span>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
              Empowering students with seamless attendance tracking and learning
              resource management. Built for the modern coding classroom.
            </p>
          </div>

          {/* Legal / Social */}
          <div>
            <h3 className="text-white font-bold mb-4 text-sm">Connect</h3>
            <ul className="space-y-3 text-sm text-zinc-500">
              <li>
                <a
                  href="https://github.com/rayhansoeangkupon/class-companion-fe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-indigo-400 transition-colors flex items-center gap-2"
                >
                  <Github className="w-4 h-4" /> GitHub Project
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/rayhannlubis"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-indigo-400 transition-colors flex items-center gap-2"
                >
                  <Instagram className="w-4 h-4" /> Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://kexterr-v1.netlify.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-indigo-400 transition-colors flex items-center gap-2"
                >
                  <Globe className="w-4 h-4" /> Website
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-zinc-600 font-mono">
            © {currentYear} Class Companion Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-xs text-zinc-600">
            <span>Built with passion by</span>
            <span className="font-semibold">Ray</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
