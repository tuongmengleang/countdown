import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import webfontDownload from 'vite-plugin-webfont-dl'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tailwindcss(),
      webfontDownload([
          // 'https://fonts.googleapis.com/css2?family=Bayon&display=swap',
          'https://fonts.googleapis.com/css2?family=Suwannaphum:wght@100;300;400;700;900&display=swap'
          // 'https://fonts.googleapis.com/css2?family=Kantumruy+Pro:ital,wght@0,100..700;1,100..700&display=swap'
      ]),
  ],
})
