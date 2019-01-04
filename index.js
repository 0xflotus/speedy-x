#!/usr/bin/env node

const spdxLicenseList = require("spdx-license-list");
const fs = require("fs");
const chalk = require("chalk");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const pkgJSON = process.argv[2] || "package.json";

try {
  var pkg = JSON.parse(fs.readFileSync(pkgJSON));
} catch (e) {
  console.error(
    chalk.red(
      "An error occured while reading the",
      chalk.yellow("package.json")
    )
  );
  process.exit(-1);
}
console.log("Your current License is: " + pkg.license);
Object.keys(spdxLicenseList).forEach((license, idx) =>
  console.log(idx + 1 + ". " + license)
);

rl.question("Which License would you like to apply? ", answer => {
  if (
    (!spdxLicenseList.hasOwnProperty(answer) && isNaN(parseInt(answer))) ||
    parseInt(answer) > Object.keys(spdxLicenseList).length
  ) {
    console.error(chalk.red("License not found. Process abort."));
    process.exit(-1);
  }
  fs.writeFileSync(
    pkgJSON,
    JSON.stringify(
      {
        ...pkg,
        license: isNaN(parseInt(answer))
          ? answer
          : Object.keys(spdxLicenseList)[parseInt(answer) - 1]
      },
      null,
      2
    )
  );
  rl.close();
});
