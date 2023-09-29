#! /usr/bin/env node

const { Command } = require("commander");
const fs = require("fs");
const path = require("path");

const program = new Command();

program.option(
  "-o, --output <filename>",
  "Output filename",
  "strapi-api-schema.json"
);

console.log("Generating Strapi API schema...");
const schemas = [];

// get the path to the server src directory
let rootDirectory = process.cwd();
let apiFolderPath = path.join(rootDirectory, "src", "api");

if (!fs.existsSync(apiFolderPath)) {
    console.log(`Server src directory not found at ${apiFolderPath}.  \nThis script must be run from the root directory of a Strapi project.`);
    process.exit(1);
}

// for each folder in the server src directory, read the schema file
fs.readdirSync(apiFolderPath).forEach((folder) => {

  const schemaFilePath = path.join(
    apiFolderPath,
    folder,
    "content-types",
    folder,
    "schema.json"
  );

  if (fs.existsSync(schemaFilePath)) {
    const schema = JSON.parse(fs.readFileSync(schemaFilePath, "utf8"));
    schemas.push(schema);
  } else {
    console.log(`Schema file not found at ${schemaFilePath}`);
  }
});

// write the merged schemas to the output file
const outputFilePath = path.join(rootDirectory, program.opts().output)
fs.writeFileSync(outputFilePath, JSON.stringify(schemas, null, '\t'));

console.log(`Parsed schema written to ${outputFilePath}`);

program.exitOverride((err) => {
  if (err) console.error(err);
  process.exit(1);
});

module.exports = program;
