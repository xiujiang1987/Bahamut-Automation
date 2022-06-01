import { execSync } from "node:child_process";
import fs from "node:fs";
import { resolve } from "node:path";
import ora from "ora";

main();

async function main(): Promise<void> {
    const root = process.cwd();
    const lib = resolve(root, "dist", "lib");

    let state = ora("Clear old files...").start();
    if (fs.existsSync(resolve(root, "dist", "action"))) {
        fs.rmSync(resolve(root, "dist", "action"), { recursive: true });
    }

    if (!fs.existsSync(lib)) {
        state.info("No lib found. Running build:package");
        await new Promise((r) => setTimeout(r, 50));
        execSync("pnpm build:package -s", { stdio: "inherit" });
        state = ora().start();
    }

    state.start("Copying Lib... ");
    await new Promise((r) => setTimeout(r, 50));
    copy_dir(resolve(root, "dist", "lib"), resolve(root, "dist", "action", "lib"));

    state.text = "Copying Configs... ";
    await new Promise((r) => setTimeout(r, 50));
    fs.copyFileSync(resolve(root, "package.json"), resolve(root, "dist", "action", "package.json"));
    fs.copyFileSync(
        resolve(root, "pnpm-lock.yaml"),
        resolve(root, "dist", "action", "pnpm-lock.yaml"),
    );
    fs.copyFileSync(resolve(root, "action.yml"), resolve(root, "dist", "action", "action.yml"));

    state.text = "Compiling action.ts... ";
    await new Promise((r) => setTimeout(r, 50));
    build(resolve(root, "src", "action", "action.ts"), resolve(root, "dist", "action"));

    state.succeed("Action Built");
}

function copy_dir(src_dir: string, dest_dir: string): void {
    if (!fs.existsSync(src_dir)) {
        console.error(`${src_dir} does not exist`);
        return;
    }

    if (!fs.existsSync(dest_dir)) {
        fs.mkdirSync(dest_dir, { recursive: true });
    }

    const files = fs.readdirSync(src_dir);
    for (const file of files) {
        const src_file = resolve(src_dir, file);
        const dest_file = resolve(dest_dir, file);

        if (fs.statSync(src_file).isDirectory()) {
            copy_dir(src_file, dest_file);
        } else {
            fs.copyFileSync(src_file, dest_file);
        }
    }
}

function build(src: string, output: string) {
    const cmd = `pnpm tsup --silent --target esnext --format esm --no-splitting --loader ".md=text" --shims -d ${output} ${src}`;
    return execSync(cmd, { stdio: "inherit" });
}
