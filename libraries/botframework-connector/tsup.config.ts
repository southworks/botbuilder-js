import { defineConfig } from 'tsup';
import { polyfillNode } from 'esbuild-plugin-polyfill-node';
import packageJson from './package.json';

export default defineConfig({
    name: 'browser',
    platform: 'browser',
    entry: ['./src/index.ts'],
    format: ['esm', 'cjs'],
    outDir: './lib/browser',
    minify: true,
    treeshake: true,
    bundle: true,
    splitting: false,
    sourcemap: true,
    outExtension({ format }) {
        const ext =
            {
                esm: 'mjs',
            }[format] ?? format;
        return {
            js: `.${ext}`,
        };
    },
    noExternal: Object.keys(packageJson.dependencies).filter((packageName) => {
        return packageName;
    }),
    esbuildPlugins: [
        polyfillNode({
            polyfills: {
                buffer: false,
                child_process: true,
                crypto: false,
                http: false,
                https: false,
                net: true,
                stream: false,
                tls: true,
            },
        }),
    ],
    esbuildOptions(options) {
        options.inject = ['./esbuild.inject.js'];
        options.define = {
            global: 'globalThis',
        };
        options.alias = {
            stream: 'stream-browserify',
            http: 'stream-http',
            https: 'https-browserify',
            crypto: 'crypto-browserify',
        };
    },
});
