import daisyui from 'daisyui'
import themes from 'daisyui/src/theming/themes'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        maturdark: {
          ...themes['[data-theme=dark]'],
          primary: '#6EE7B7',
          secondary: '#93C5FD',
          accent: '#F472B6',
          neutral: '#1F2937',
          'base-100': '#0B1220',
          info: '#22D3EE',
          success: '#34D399',
          warning: '#FBBF24',
          error: '#F87171',
        },
      },
    ],
    darkTheme: 'maturdark',
  },
}
