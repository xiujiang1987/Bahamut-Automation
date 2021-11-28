import fs from "fs";
import { resolve } from "path";
import { execSync } from "child_process";

const root = resolve(__dirname, "..");

main();

async function main(): Promise<void> {
    process.stdout.write("Clear old files... ");
    execSync(`rm -rf ${resolve(root, "dist", "binary")}`);
    console.log("Done");

    const lib = resolve(root, "dist", "lib");

    if (!fs.existsSync(lib)) {
        console.log("\nNo Lib Found, Running build:package");
        execSync("npm run build:package --silent", { stdio: "inherit" });
        console.log("Lib Built\n");
    }

    process.stdout.write("Compiling Binaries... ");
    execSync("npx pkg .", { stdio: "inherit" });
    console.log("Done");
}

function copy_dir(src_dir: string, dest_dir: string) {
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
