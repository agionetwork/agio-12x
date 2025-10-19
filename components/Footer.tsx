'use client'

import { motion } from 'framer-motion'
import { Wallet, Mail, Phone, MapPin, ExternalLink, Github, Twitter, Linkedin } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    {
      name: 'GitHub',
      icon: Github,
      href: '#',
      color: 'hover:text-gray-900'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      href: '#',
      color: 'hover:text-blue-400'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: '#',
      color: 'hover:text-blue-600'
    }
  ]

  const quickLinks = [
    { name: 'Como Funciona', href: '#como-funciona' },
    { name: 'Segurança', href: '#seguranca' },
    { name: 'Taxas', href: '#taxas' },
    { name: 'Suporte', href: '#suporte' }
  ]

  const legalLinks = [
    { name: 'Termos de Uso', href: '#termos' },
    { name: 'Política de Privacidade', href: '#privacidade' },
    { name: 'Política de Cookies', href: '#cookies' },
    { name: 'LGPD', href: '#lgpd' }
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="solana-gradient p-2 rounded-lg">
                <Wallet className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold">Solana USDC</h3>
                <p className="text-sm text-gray-400">Plataforma segura</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              A forma mais segura e conveniente de comprar USDC na rede Solana 
              usando métodos de pagamento brasileiros.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`text-gray-400 ${social.color} transition-colors`}
                    aria-label={social.name}
                  >
                    <Icon size={20} />
                  </motion.a>
                )
              })}
            </div>
          </motion.div>

          {/* Links Rápidos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-lg font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contato */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="text-lg font-semibold mb-4">Contato</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="text-gray-400" size={16} />
                <span className="text-gray-400 text-sm">contato@solana-usdc.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="text-gray-400" size={16} />
                <span className="text-gray-400 text-sm">+55 11 99999-9999</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="text-gray-400" size={16} />
                <span className="text-gray-400 text-sm">São Paulo, SP</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Divisor */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-gray-800 mt-8 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} Solana USDC Platform. Todos os direitos reservados.
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <span className="text-gray-400">Licenciado pela CVM</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400">Sistema Online</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
