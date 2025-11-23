import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'

export default defineConfig(({ mode }) => ({
  plugins: [react(), svgr()],
  // base: './',
  resolve: {
    alias: [
      {
        find: '~',
        replacement: '/src',
      },
    ],
  },
  define: {
    'process.env.BUILD_MODE': JSON.stringify(mode === 'development' ? 'dev' : 'production'),
  },
  esbuild: {
    drop: mode === 'production' ? ['console', 'debugger'] : [],
  },
}))
