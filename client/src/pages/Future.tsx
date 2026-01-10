import { Sparkles, Rocket, Zap, Star } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Future Page - Coming Soon placeholder
 * A colorful, engaging page indicating something big is coming
 */
export default function Future() {
  const floatingIcons = [
    { icon: Sparkles, delay: 0, x: -50, y: -30 },
    { icon: Rocket, delay: 0.2, x: 50, y: -50 },
    { icon: Zap, delay: 0.4, x: -80, y: 30 },
    { icon: Star, delay: 0.6, x: 70, y: 40 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 pb-20 flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl">
        {/* Floating animated icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {floatingIcons.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                className="absolute text-white/20"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0.2, 0.4, 0.2],
                  scale: [1, 1.2, 1],
                  x: [item.x, item.x + 20, item.x],
                  y: [item.y, item.y + 20, item.y],
                }}
                transition={{
                  duration: 4,
                  delay: item.delay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{
                  left: '50%',
                  top: '50%',
                }}
              >
                <Icon className="h-16 w-16 sm:h-24 sm:w-24" />
              </motion.div>
            );
          })}
        </div>

        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center"
        >
          {/* Glowing background circle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="absolute w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-white/10 blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>

          {/* Content card */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="relative bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 sm:p-12 shadow-2xl"
          >
            {/* Main icon */}
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="flex justify-center mb-6"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-white/30 rounded-full blur-xl animate-pulse" />
                <Sparkles className="relative h-16 w-16 sm:h-20 sm:w-20 text-white" />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-4xl sm:text-6xl font-bold text-white mb-4 drop-shadow-lg"
            >
              Something Big
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-2xl sm:text-4xl font-bold text-white/90 mb-6 drop-shadow-md"
            >
              is Coming
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-lg sm:text-xl text-white/80 mb-8 max-w-md mx-auto leading-relaxed"
            >
              We're working on something amazing. Stay tuned for updates!
            </motion.p>

            {/* Animated dots */}
            <motion.div
              className="flex justify-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  className="w-3 h-3 rounded-full bg-white/80"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: index * 0.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </motion.div>
          </motion.div>

          {/* Decorative elements */}
          <motion.div
            className="mt-8 flex flex-wrap justify-center gap-4 text-white/60 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
          >
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span>Innovation</span>
            </div>
            <div className="flex items-center gap-2">
              <Rocket className="h-4 w-4" />
              <span>Speed</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              <span>Excellence</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
