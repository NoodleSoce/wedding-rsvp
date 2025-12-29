// @ts-check
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
    output: 'server',
    adapter: cloudflare({
        platformProxy: {
            enabled: true
        }
    }),
    integrations: [
        svelte(),
        tailwind()
    ],
    devToolbar: {
        enabled: false
    },
    prefetch: {
        prefetchAll: true,
        defaultStrategy: 'viewport'
    },
    compressHTML: true,
    build: {
        inlineStylesheets: 'always',
        assets: '_assets'
    },
    vite: {
        build: {
            chunkSizeWarningLimit: 1000,
            rollupOptions: {
                output: {
                    manualChunks: {
                        confetti: ['canvas-confetti']
                    }
                }
            },
            minify: 'esbuild',
            target: 'es2022',
            cssCodeSplit: true
        },
        esbuild: {
            drop: ['console', 'debugger'],
            target: 'es2022',
            minifyIdentifiers: true,
            minifySyntax: true,
            minifyWhitespace: true
        },
        optimizeDeps: {
            include: ['canvas-confetti']
        }
    },
    image: {
        // Use sharp for AVIF conversion
        service: {
            entrypoint: 'astro/assets/services/sharp'
        }
    }
});
