/**
 * Executes a series of commands in sequence, followed by a callback
 * function. Streams output from child processes, dies gracefully,
 * and stops execution if any commands return non-zero exit values.
 *
 * @param {string|string[]} commands - Command(s) to execute.
 * @param {function} [cb] - A function to run after all commands.
 */
function execute(commands, cb) {
  var spawn = require("child_process").spawn;

  if (Object.prototype.toString.call(commands) !== '[object Array]') {
    commands = [commands];
  }

  var child = spawn("sh", ["-c", commands[0]]);

  process.stdout.write("==> Executing command '" + commands[0] + "':\n");

  // Catch ctrl-c and wait for children to clean up before exiting
  process.on("SIGINT", function() {
    child.on("close", function(code) {
      process.exit(1);
    })
  });

  child.stdout.on("data", function(data) { process.stdout.write(data); });
  child.stderr.on("data", function(data) { process.stderr.write(data); });
  child.on("close", function(code) {
    process.removeAllListeners("SIGINT");

    if (code === 0) {
      var newCommands = commands.slice(1);

      if (newCommands.length > 0) {
        execute(newCommands, cb);
      } else {
        if (cb) { cb(); }
      }
    } else {
      process.stderr.write("Command '" + commands[0] + "' exited with code: " + code + "\n");
    }
  });
};


/**
 * Gets the next version, based on the current date and the previous version.
 *
 * @param {string} [lastVersion] - The previous version string.
 */
function getNextVersion(lastVersion) {
  var d = new Date();

  var yearPart  = d.getFullYear().toString().substring(2);
  var monthPart = d.getMonth() + 1;
  var dayPart   = d.getDate();

  var nextVersion = yearPart + "." + monthPart + "." + dayPart;

  // Patch logic
  if (lastVersion && lastVersion.split(".").slice(0, 3).join(".") === nextVersion) {
    var lastPatchVersion = lastVersion.split(".").slice(3, 4);

    if (lastPatchVersion.length > 0) {
      nextVersion += "." + (parseInt(lastPatchVersion[0]) + 1)
    } else {
      nextVersion += ".1";
    }
  }

  return nextVersion;
};


module.exports = {
  execute        : execute,
  getNextVersion : getNextVersion,
};
