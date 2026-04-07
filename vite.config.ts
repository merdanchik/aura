import { defineConfig, Plugin } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// Resolve figma:asset/xxx.png → src/assets/xxx.png
function figmaAssets(): Plugin {
  return {
    name: 'figma-assets',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const file = id.replace('figma:asset/', '');
        return path.resolve(__dirname, 'src/assets', file);
      }
    },
  };
}

export default defineConfig({
  plugins: [
    figmaAssets(),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
