import fs from "fs";
import { resolve } from "path";
import { execSync } from "child_process";
import UglifyJS from "uglify-js";

const root = resolve(__dirname, "..");

main();

async function main(): Promise<void> {
    process.stdout.write("Clear old files... ");
    execSync(`rm -rf ${resolve(root, "dist", "lib")}`);
    console.log("Done");

    process.stdout.write("Compiling Core... ");
    execSync(`npx tsup --silent --target esnext --minify ${resolve(root, "src", "core")} --out-dir ${resolve(root, "dist", "lib", "core")}`, {
        stdio: "inherit",
    });
    console.log("Done");

    process.stdout.write("Compiling Modules... ");
    execSync(
        `npx tsup --silent --target esnext --minify --loader ".md=text" ${resolve(root, "src", "modules")} --out-dir ${resolve(
            root,
            "dist",
            "lib",
            "modules",
        )}`,
        { stdio: "inherit" },
    );
    console.log("Done");

    // process.stdout.write("Minifying Lib... ");
    // const lib = resolve(root, "dist", "lib");
    // js_in_dir(lib).forEach(minify);
    // console.log("Done");
}

function minify(path: string): void {
    const code = fs.readFileSync(path, "utf8");
    const minified = UglifyJS.minify(code, {
        output: {
            beautify: false,
            preamble: "/* minified */",
        },
    });
    fs.writeFileSync(path, minified.code);
}

function js_in_dir(dir: string): string[] {
    const files: string[] = [];
    const dirs = fs.readdirSync(dir);
    for (const d of dirs) {
        const file = resolve(dir, d);
        if (fs.statSync(file).isDirectory()) {
            files.push(...js_in_dir(file));
        } else {
            files.push(file);
        }
    }
    return files.filter((f) => f.endsWith(".js"));
}
