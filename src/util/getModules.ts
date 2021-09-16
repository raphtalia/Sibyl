import fs from "fs";
import path from "path";

export = function getModules(dir: string) {
  return fs
    .readdirSync(dir)
    .filter(
      (file) =>
        file.endsWith(".js") || fs.lstatSync(`${dir}/${file}`).isDirectory()
    )
    .map((directory) => {
      if (fs.lstatSync(`${dir}/${directory}`).isDirectory()) {
        if (fs.existsSync(`${dir}/${directory}/index.js`)) {
          return {
            name: directory,
            path: `${path.basename(directory)}/index.js`,
          };
        }
      } else {
        return {
          name: path.basename(directory, ".js"),
          path: directory,
        };
      }
    });
};
