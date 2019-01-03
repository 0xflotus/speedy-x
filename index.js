#!/usr/bin/env node

const spdxLicenseList = require("spdx-license-list");
const fs = require("fs");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const pkgJSON = "package.json";
const pkg = JSON.parse(fs.readFileSync(pkgJSON));

console.log("Your current License is: " + pkg.license);
Object.keys(spdxLicenseList).forEach((license, idx) =>
  console.log(idx + 1 + ". " + license)
);

rl.question("Which License would you like to apply? ", answer => {
  if (
    (!spdxLicenseList.hasOwnProperty(answer) && isNaN(parseInt(answer))) ||
    parseInt(answer) > Object.keys(spdxLicenseList).length
  ) {
    console.error("License not found. Process abort.");
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
