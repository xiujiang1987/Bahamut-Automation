const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const example_root = path.resolve(__dirname, "../example");
const dist_root = path.resolve(__dirname, "../dist");

copy_dir(example_root, dist_root);

execSync("npm run build", { stdio: "inherit" });

function copy_dir(src_dir, dest_dir) {
    if (!fs.existsSync(src_dir)) {
        console.error(`${src_dir} does not exist`);
        return;
    }

    if (!fs.existsSync(dest_dir)) {
        fs.mkdirSync(dest_dir, { recursive: true });
    }

    const files = fs.readdirSync(src_dir);
    for (const file of files) {
        const src_file = path.resolve(src_dir, file);
        const dest_file = path.resolve(dest_dir, file);

        if (fs.statSync(src_file).isDirectory()) {
            copy_dir(src_file, dest_file);
        } else {
            fs.copyFileSync(src_file, dest_file);
        }
    }
}
