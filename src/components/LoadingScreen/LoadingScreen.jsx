import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const LoadingScreen = ({ message = 'Loading...' }) => {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, rgba(2,6,23,0.96), rgba(2,6,23,0.92))',
        color: 'white'
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ marginBottom: 12, fontWeight: 800, fontSize: 20 }}>s&box</div>

        <div style={{ width: 200, height: 80, margin: '0 auto 12px', position: 'relative' }}>
          <svg viewBox="0 0 220 100" width="200" height="80" style={{ display: 'block', margin: '0 auto' }}>
            <defs>
              <linearGradient id="snakeGrad" x1="0%" x2="100%">
                <stop offset="0%" stopColor="#34d399">
                  <animate attributeName="offset" values="0;1;0" dur="2.6s" repeatCount="indefinite" />
                </stop>
                <stop offset="50%" stopColor="#16a34a">
                  <animate attributeName="offset" values="0.25;0.75;0.25" dur="2.6s" repeatCount="indefinite" />
                </stop>
                <stop offset="100%" stopColor="#059669">
                  <animate attributeName="offset" values="1;0;1" dur="2.6s" repeatCount="indefinite" />
                </stop>
              </linearGradient>
            </defs>
            <motion.path
              d="M10 50 C40 20, 80 20, 110 50 C140 80, 180 80, 210 50"
              fill="none"
              stroke="url(#snakeGrad)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={prefersReduced ? '0' : '18 12'}
              animate={prefersReduced ? undefined : { strokeDashoffset: [0, -140] }}
              transition={prefersReduced ? undefined : { repeat: Infinity, duration: 1.8, ease: 'linear' }}
              style={{ filter: 'drop-shadow(0 6px 8px rgba(0,0,0,0.45))' }}
            />
            {/* snake head */}
            <motion.circle
              r="7"
              fill="#065f46"
              cx="10"
              cy="50"
              animate={prefersReduced ? undefined : { cx: [10, 110, 210], transform: ['translateY(0px)', 'translateY(-3px)', 'translateY(0px)'] }}
              transition={prefersReduced ? undefined : { repeat: Infinity, duration: 1.8, times: [0, 0.5, 1], ease: 'linear' }}
            />
            {/* head glint */}
            <circle cx="10" cy="47" r="2" fill="#9ae6b4" opacity="0.9">
              <animate attributeName="cx" values="10;110;210" dur="1.8s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.2;0.9;0.2" dur="1.8s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>

        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)', display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <div>{message}</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {[0,1,2].map(i => (
              <motion.span key={i}
                style={{ width: 8, height: 8, borderRadius: 8, background: '#34d399', display: 'inline-block' }}
                animate={prefersReduced ? undefined : { y: [0, -6, 0], opacity: [0.6, 1, 0.6] }}
                transition={prefersReduced ? undefined : { delay: i * 0.12, repeat: Infinity, duration: 0.9, ease: 'easeInOut' }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
