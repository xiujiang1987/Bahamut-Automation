const fs = require("fs");
const path = require("path");

// copy "../src" to "../action/src"
const src_root = path.resolve(__dirname, "../src");
const action_root = path.resolve(__dirname, "../action/src");

copy_dir(src_root, action_root);

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
