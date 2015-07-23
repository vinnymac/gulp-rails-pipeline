#!/usr/bin/env node


// Usage:
// ./list-amis.js


var exec = require("child_process").exec;


exec("aws ec2 describe-images --owners 828859047020", {maxBuffer: 1024*500}, function(error, stdout, stderr) {
  if (error) {
    console.log(error);
    process.exit(1);
  }

  var data   = JSON.parse(stdout);
  var images = data.Images;

  var maxLength = 0;
  for (var i=0; i<images.length; i++) {
    var image = images[i];
    if (image.Name.length > maxLength) {
      maxLength = image.Name.length;
    }
  }

  images.sort(function(a, b) {
    if (a.CreationDate < b.CreationDate) {
      return -1;
    } else if (a.CreationDate > b.CreationDate) {
      return 1;
    } else {
      return 0;
    }
  });

  for (var i=0; i<images.length; i++) {
    var image = images[i];
    var output = image.Name;
    for (var j=0; j<(maxLength - image.Name.length); j++) {
      output += ' ';
    }
    output += " - " + image.ImageId;
    console.log(output);
  }
});
