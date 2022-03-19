import { execSync } from "node:child_process";
import fs from "node:fs";
import { resolve } from "node:path";
import ora from "ora";

main();

async function main(): Promise<void> {
    const root = process.cwd();

    const state = ora("Clear old files...").start();
    if (fs.existsSync(resolve(root, "dist", "lib"))) {
        fs.rmSync(resolve(root, "dist", "lib"), { recursive: true });
    }

    state.text = "Compiling Core... ";
    await new Promise((r) => setTimeout(r, 50));
    build(resolve(root, "src", "core"), resolve(root, "dist", "lib", "core"));

    state.text = "Compiling Modules... ";
    await new Promise((r) => setTimeout(r, 50));
    build(resolve(root, "src", "modules"), resolve(root, "dist", "lib", "modules"));

    state.succeed("Package Built");
}

function build(src: string, output: string) {
    const cmd = `pnpx -y tsup --silent --target esnext --format esm --no-splitting --loader ".md=text" -d ${output} ${src}`;
    return execSync(cmd, { stdio: "inherit" });
}
