#!/usr/bin/env node


var fs      = require("fs");
var execute = require("./helpers").execute;
var path    = require("path");


var ENVS = [
  "production",
  "staging",
];

var ROLES = [
  "elasticsearch",
  "jubjub",
  "web",
  "worker",
];


// Check number of arguments
var args = process.argv.slice(2);
if (args.length != 2) {
  console.log("Usage: ./" + path.basename(process.argv[1]) + " <roles> <environment>");
  console.log("\nRoles: " + ROLES.join(", "));
  console.log("Environments: " + ENVS.join(", "));
  process.exit(1);
}

// Check roles arg
if (args[0] === "all") {
  roles = ROLES;
} else {
  var roles = args[0].split(",");
  for (var i=0; i<roles.length; i++) {
    var role = roles[i].trim();

    if (ROLES.indexOf(role) < 0) {
      console.log("Invalid role: " + role);
      console.log("Valid options include: all, " + ROLES.join(", "));
      process.exit(1);
    }
  }
}

// Check environment arg
var env = args[1];
if (ENVS.indexOf(env) < 0) {
  console.log("Invalid environment: " + env);
  console.log("Valid options include: " + ENVS.join(", "));
  process.exit(1);
}


var varsFilePath = process.env.HOME + "/.lua/packer-variables.json";
var packerArgs = "-var-file=" + varsFilePath + " -var 'deploy_env=" + env + "'";

for (var i=0; i<ROLES.length; i++) {
  packerArgs += " -var '" + ROLES[i] + "_deploy_key=" +
                process.env.HOME + "/.lua/" + ROLES[i] +".pem'";
}

packerArgs += " -only=" + roles.join(",");
packerArgs += " ./ami-template.json";


execute([
  "packer validate " + packerArgs,
  "packer build " + packerArgs,
]);
