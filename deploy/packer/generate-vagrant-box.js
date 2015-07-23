#!/usr/bin/env node


var exec           = require("child_process").exec;
var fs             = require("fs");
var execute        = require("./helpers").execute;
var getNextVersion = require("./helpers").getNextVersion;


var dataFilePath = __dirname + "/../lua-vagrant.json";
var data = JSON.parse(fs.readFileSync(dataFilePath));

var lastVersion = null;
if (data.versions.length > 0) {
  lastVersion = data.versions[data.versions.length-1].version;
}

var nextVersion   = getNextVersion(lastVersion);
var bucketName    = "lua-vagrant";
var sourceBoxName = "packer_virtualbox-iso_virtualbox.box";
var targetBoxName = "ubuntu-14.04_" + nextVersion + ".box";


execute([
  "packer validate vagrant/template.json",
  "packer build vagrant/template.json",
  "aws s3 cp " + sourceBoxName +
    " s3://" + bucketName + "/" + targetBoxName +
    " --acl public-read",
], function() {
  // Generate box checksum and write new version info to data file
  exec("openssl sha1 " + sourceBoxName , function(error, stdout, stderr) {
    data.versions.push({
      version: nextVersion,
      providers: [
        {
          name: "virtualbox",
          url: "https://s3.amazonaws.com/" + bucketName + "/" + targetBoxName,
          checksum_type: "sha1",
          checksum: stdout.split(" ")[1].trim(),
        }
      ]
    });

    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    exec("rm " + sourceBoxName, function(error, stdout, stderr) {});
  });
});
