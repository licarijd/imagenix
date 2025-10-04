import { minify } from "terser";
import { readdirSync, statSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

function walk(dir) {
  for (const f of readdirSync(dir)) {
    const full = join(dir, f);
    if (statSync(full).isDirectory()) walk(full);
    else if (f.endsWith(".js")) {
      const code = readFileSync(full, "utf8");
      minify(code, { compress: true, mangle: true }).then(result => {
        writeFileSync(full, result.code);
        console.log("Minified:", full);
      });
    }
  }
}

walk("dist");
