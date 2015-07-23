#!/usr/bin/env node


// Usage:
// ./check-web.js | xargs open


var exec = require("child_process").exec;


exec("aws ec2 describe-instances", {maxBuffer: 1024*500}, function(error, stdout, stderr) {
  if (error) {
    console.log(error);
    process.exit(1);
  }

  var data = JSON.parse(stdout);
  var reservations = data.Reservations;

  for (var i=0; i<reservations.length; i++) {
    var instances = reservations[i].Instances;

    for (var j=0; j<instances.length; j++) {
      var tags = instances[j].Tags;
      if (!tags) { continue }

      var match = false;
      for (var k=0; k<tags.length; k++) {
        if (tags[k].Key === "Name" && tags[k].Value === "web-production") {
          match = true;
        }
      }

      if (match) {
        console.log("http://" + instances[j].PublicDnsName + "/signin");
      }
    }
  }
});
