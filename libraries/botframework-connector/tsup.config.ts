import { defineConfig } from 'tsup';
import { polyfillNode } from 'esbuild-plugin-polyfill-node';
import packageJson from './package.json';

export default defineConfig({
    // minify: true,
    treeshake: true,
    name: 'browser',
    platform: 'browser',
    entry: ['./src/index.ts'],
    //   external: [mswCore, ecosystemDependencies],
    format: ['esm', 'cjs'],
    outDir: './dist',
    bundle: true,
    splitting: false,
    sourcemap: true,
    cjsInterop: true,
    // dts: true,
    // outExtension({ format }) {
    //     return {
    //       js: `index.${format}.js`,
    //     }
    //   },
    noExternal: Object.keys(packageJson.dependencies).filter((packageName) => {
        return packageName;
    }),
    /**
     * @note Use a proxy TypeScript configuration where the "compilerOptions.composite"
     * option is set to false.
     * @see https://github.com/egoist/tsup/issues/571
     */
    //   tsconfig: path.resolve(__dirname, 'src/browser/tsconfig.browser.build.json'),
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
    esbuildOptions(options, context) {
        options.define = {
            global: 'globalThis',
        };

        options.alias = {
            buffer: 'Buffer',
            stream: 'stream-browserify',
            http: 'stream-http',
            https: 'https-browserify',
            crypto: 'crypto-browserify',
        };
    },
});
