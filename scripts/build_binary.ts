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
