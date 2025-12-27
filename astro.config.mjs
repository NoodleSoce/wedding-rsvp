// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    devToolbar: {
        enabled: false
    },
    prefetch: {
        prefetchAll: true,
        defaultStrategy: 'viewport'
    },
    compressHTML: true,
    build: {
        // Inline small stylesheets for faster first paint
        inlineStylesheets: 'always',
        // Split CSS for better caching
        assets: '_assets'
    },
    vite: {
        build: {
            // Reduce chunk size warnings
            chunkSizeWarningLimit: 1000,
            // Optimize rollup output
            rollupOptions: {
                output: {
                    // Manual chunk splitting for optimal caching
                    manualChunks: {
                        confetti: ['canvas-confetti']
                    }
                }
            },
            // Use esbuild for minification (built-in, faster than terser)
            minify: 'esbuild',
            // Target modern browsers for smaller output
            target: 'es2020',
            // CSS code splitting
            cssCodeSplit: true
        },
        // Optimize esbuild settings
        esbuild: {
            // Drop console in production
            drop: ['console', 'debugger'],
            // Target modern browsers
            target: 'es2020',
            // Minify identifiers
            minifyIdentifiers: true,
            minifySyntax: true,
            minifyWhitespace: true
        },
        // Optimize dependencies
        optimizeDeps: {
            include: ['canvas-confetti']
        }
    }
});
