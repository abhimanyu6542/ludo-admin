/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
// const plugin = require('tailwindcss/plugin');

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        title: ['Inter'],
        poppins: ['Poppins', 'sans-serif'],
      },
      maxWidth:{
        w1: '15%',
        w2: '85%',
      },
      minWidth:{
        w1: '15%',
        w2: '85%',
      },
      width:{
        w2: '85%',
      },
      
      colors: {
        primary: '#000000',
        secondary: '#FFFFFF',
        tertiary: {
          t2: '#e2e8f0',
          t3: '#cbd5e1',
          t4: '#94a3b8',
          t5: '#64748b',
          t6: '#475569',
        },
        background: '#E4E5E7',
        sidebarText: "#2b7747",
      }
    },
  },
  plugins: [],
};