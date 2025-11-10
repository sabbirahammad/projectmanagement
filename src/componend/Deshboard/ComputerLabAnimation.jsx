import React from 'react';
import { motion } from 'framer-motion';

const ComputerLabAnimation = () => {
  return (
    <div className="flex justify-center items-center py-8">
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Lab Background */}
        <motion.div
          className="bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg p-8 shadow-lg"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Table and Chairs Setup */}
          <motion.div
            className="relative"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Table */}
            <div className="bg-amber-600 rounded-lg p-4 relative">
              {/* Table surface */}
              <div className="bg-amber-700 h-3 rounded"></div>

              {/* Table legs */}
              <div className="absolute -bottom-4 left-4 w-1 h-4 bg-amber-800 rounded"></div>
              <div className="absolute -bottom-4 right-4 w-1 h-4 bg-amber-800 rounded"></div>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-1 h-4 bg-amber-800 rounded"></div>
            </div>

            {/* Chairs and Computer Stations */}
            <div className="grid grid-cols-2 gap-12 mt-6">
              {[1, 2, 3, 4].map((station, index) => (
                <motion.div
                  key={station}
                  className="flex flex-col items-center relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 + 0.6 }}
                >
                  {/* Chair */}
                  <motion.div
                    className="relative mb-2"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 + 0.8 }}
                  >
                    {/* Chair seat */}
                    <div className="w-12 h-3 bg-blue-600 rounded-sm relative">
                      {/* Chair back */}
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-8 h-6 bg-blue-700 rounded-t-lg"></div>
                      {/* Chair legs */}
                      <div className="absolute -bottom-2 left-1 w-0.5 h-2 bg-blue-800"></div>
                      <div className="absolute -bottom-2 right-1 w-0.5 h-2 bg-blue-800"></div>
                    </div>
                  </motion.div>

                  {/* Student sitting on chair */}
                  <motion.div
                    className="flex flex-col items-center absolute -top-8"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.3 + 1.2 }}
                  >
                    {/* Head */}
                    <motion.div
                      className="w-6 h-6 bg-yellow-400 rounded-full relative z-10"
                      animate={{ y: [0, -0.5, 0] }}
                      transition={{ duration: 3, repeat: Infinity, delay: index * 0.4 }}
                    >
                      {/* Eyes */}
                      <div className="absolute top-1.5 left-1 w-1 h-1 bg-black rounded-full"></div>
                      <div className="absolute top-1.5 right-1 w-1 h-1 bg-black rounded-full"></div>
                      {/* Mouth */}
                      <div className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-1.5 h-0.5 bg-black rounded-full"></div>
                    </motion.div>

                    {/* Body (upper) */}
                    <div className="w-5 h-6 bg-blue-500 rounded-t-lg relative z-10">
                      {/* Arms typing on keyboard */}
                      <motion.div
                        className="absolute -left-1.5 top-1"
                        animate={{ rotate: [-5, 5, -5] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.6 }}
                      >
                        <div className="w-1 h-4 bg-yellow-400 rounded-full"></div>
                        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full -mt-0.5"></div>
                      </motion.div>
                      <motion.div
                        className="absolute -right-1.5 top-1"
                        animate={{ rotate: [5, -5, 5] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.6 + 0.3 }}
                      >
                        <div className="w-1 h-4 bg-yellow-400 rounded-full"></div>
                        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full -mt-0.5"></div>
                      </motion.div>
                    </div>

                    {/* Legs (visible part) */}
                    <div className="w-4 h-3 bg-blue-600 rounded-b-lg z-10"></div>
                  </motion.div>

                  {/* Computer Setup on table */}
                  <div className="flex items-end space-x-1 absolute -top-12 left-1/2 transform -translate-x-1/2">
                    {/* Monitor */}
                    <motion.div
                      className="relative z-20"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="w-12 h-8 bg-gray-800 rounded-t-lg relative">
                        <div className="w-8 h-5 bg-blue-500 rounded-sm absolute top-0.5 left-2 flex items-center justify-center">
                          <motion.div
                            className="w-1.5 h-1.5 bg-white rounded-full"
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                          />
                        </div>
                        {/* Monitor stand */}
                        <div className="w-1.5 h-2 bg-gray-700 absolute -bottom-0.5 left-1/2 transform -translate-x-1/2"></div>
                      </div>
                    </motion.div>

                    {/* Keyboard */}
                    <motion.div
                      className="w-8 h-1.5 bg-gray-600 rounded-sm z-20"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.2 + 1 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Floating Code Particles */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-sm text-blue-600 font-mono font-bold"
              initial={{
                x: Math.random() * 400 - 200,
                y: Math.random() * 250 - 125,
                opacity: 0,
                scale: 0.5
              }}
              animate={{
                y: [null, -30],
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "easeOut"
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            >
              {['{', '}', '<', '>', '()', '[]', '//', '&&', '||', '===', '!=', '++'][i % 12]}
            </motion.div>
          ))}
        </motion.div>

        {/* Title */}
        <motion.h2
          className="text-center text-xl font-bold text-gray-800 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.5 }}
        >
          Computer Lab Class
        </motion.h2>
      </motion.div>
    </div>
  );
};

export default ComputerLabAnimation;