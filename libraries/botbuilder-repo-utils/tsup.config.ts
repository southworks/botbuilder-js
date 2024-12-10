import { defineConfig } from "tsup";
import { resolve } from "path";
import { readFileSync } from "fs";

const dir = "recognizers/recognizers-text-suite";

const packageJson = JSON.parse(
    readFileSync(
      resolve(process.cwd(), dir, "package.json"),
      "utf-8"
    )
  );
  const external = Object.keys(packageJson.dependencies || {});

export default defineConfig({
  platform: "node",
  bundle: true,
  outDir: `vendor/${dir}`,
  format: ["cjs"],
  target: "es6",
  treeshake: true,
  entry: [`${dir}/src/recognizers-text*.ts`],
  splitting: false,
  sourcemap: false,
  clean: true,
//   dts: true,
  external: [...external, "xregexp"],
  
  esbuildOptions(options) {

    console.log(options);
  }
});
