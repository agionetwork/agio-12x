'use client'

import { motion } from 'framer-motion'
import { Shield, Zap, CreditCard, Smartphone, FileText, Globe, Award, Users } from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: 'Segurança Máxima',
    description: 'Transações protegidas com criptografia de ponta e auditoria de segurança.',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Zap,
    title: 'PIX Instantâneo',
    description: 'Receba USDC instantaneamente após pagamento via PIX.',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: CreditCard,
    title: 'Cartão Parcelado',
    description: 'Pague em até 12x no cartão de crédito com juros competitivos.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: FileText,
    title: 'Boleto',
    description: 'Pague com boleto bancário e receba USDC após compensação.',
    color: 'from-orange-500 to-orange-700'
  },
  {
    icon: Smartphone,
    title: 'Mobile First',
    description: 'Interface otimizada para dispositivos móveis e tablets.',
    color: 'from-blue-500 to-blue-700'
  },
  {
    icon: Globe,
    title: 'Rede Global',
    description: 'Acesso global com transações rápidas e seguras.',
    color: 'from-blue-600 to-blue-800'
  },
  {
    icon: Award,
    title: 'Taxas Baixas',
    description: 'Menores taxas do mercado para compra de USDC.',
    color: 'from-blue-400 to-blue-600'
  },
  {
    icon: Users,
    title: 'Suporte 24/7',
    description: 'Atendimento especializado em português brasileiro.',
    color: 'from-blue-600 to-blue-800'
  }
]

export default function Features() {
  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
        >
          Por que escolher nossa plataforma?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-xl text-gray-600 max-w-3xl mx-auto"
        >
          A forma mais segura e conveniente de comprar USDC no Brasil
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="card hover:shadow-xl transition-all duration-300"
            >
              <div className="text-center">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center shadow-lg`}
                >
                  <Icon className="text-white" size={32} />
                </motion.div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
