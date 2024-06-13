import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import prismjs from 'vite-plugin-prismjs';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        prismjs({
            languages: 'all',
        }),
    ],
})
