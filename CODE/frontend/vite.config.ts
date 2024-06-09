import {defineConfig} from 'vite'
import path from 'node:path'
import electron from 'vite-plugin-electron/simple'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import {join} from "path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tsconfigPaths(),
        electron({
            main: {
                // Shortcut of `build.lib.entry`.
                entry: 'electron/main.ts',
            },
            preload: {
                // Shortcut of `build.rollupOptions.input`.
                // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
                input: path.join(__dirname, 'electron/preload.ts'),
            },
            // Ployfill the Electron and Node.js API for Renderer process.
            // If you want use Node.js in Renderer process, the `nodeIntegration` needs to be enabled in the Main process.
            // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
            renderer: {},
        }),
    ],
    base: './',
    build: {
        target: "ESNext",
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: join(__dirname, 'index.html'),
            },
        }
    },
    esbuild: {
        target: "ESNext"
    },
})
