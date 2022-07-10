import { execSync } from "node:child_process";
import fs from "node:fs";
import { resolve } from "node:path";
import ora from "ora";

main();

async function main(): Promise<void> {
    const root = process.cwd();
    const lib = resolve(root, "dist", "lib");
    const node_version = "18";
    const platforms = ["win", "macos", "linux"];

    let state = ora("Clear old files... ").start();
    if (fs.existsSync(resolve(root, "dist", "binary"))) {
        fs.rmSync(resolve(root, "dist", "binary"), { recursive: true });
    }

    if (!fs.existsSync(lib)) {
        state.info("No lib found. Running build:package");
        await new Promise((r) => setTimeout(r, 50));
        execSync("pnpm build:package -s", { stdio: "inherit" });
        state = ora().start();
    }

    state.text = "Compiling Binaries... ";
    await new Promise((r) => setTimeout(r, 100));
    if (process.arch === "x64") {
        execSync(
            `pnpm pkg . --targets ${platforms
                .map((p) => `node${node_version}-${p}-x64`)
                .join(",")}`,
            { stdio: "ignore" },
        );
    } else {
        execSync(
            `pnpm pkg . --targets ${platforms
                .map((p) => `node${node_version}-${p}-arm64`)
                .join(",")}`,
            { stdio: "ignore" },
        );
    }
    state.succeed("Binaries Built");
}
