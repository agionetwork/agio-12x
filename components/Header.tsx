'use client'

import { motion } from 'framer-motion'
import { Wallet, Zap } from 'lucide-react'
import Link from 'next/link'

export default function Header() {

  return (
    <header className="bg-white/10 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-2">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-4"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="bg-gradient-to-r from-blue-600 to-blue-800 p-3 rounded-2xl shadow-glow"
            >
              <Wallet className="text-white" size={28} />
            </motion.div>
                    <div>
                      <h1 className="text-2xl font-black text-gradient">12x</h1>
                      <p className="text-sm text-slate-600 font-medium">Powered by Agio Network</p>
                    </div>
          </motion.div>


                  {/* CTA Button */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="hidden md:block"
                  >
                    <Link href="/comprar">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-primary flex items-center gap-2"
                      >
                        <Zap className="w-5 h-5" />
                        Começar Agora
                      </motion.button>
                    </Link>
                  </motion.div>

        </div>

      </div>
    </header>
  )
}
