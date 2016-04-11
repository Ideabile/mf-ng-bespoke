#!/usr/bin/env node

  var cp = require('child_process'),
      fs = require('fs'),
      _bin = cp.execSync('npm bin'),
      gulpPath = fs.existsSync(_bin+'/gulp') ? _bin+'/gulp' : __dirname +  '/node_modules/.bin/gulp',
      spawn = cp.spawn,
      args = [
        '--gulpfile',
        __dirname+'/Gulpfile.js',
        '--cwd',
        process.env.PWD
      ];

  args = args.concat(process.argv.slice(2));
  spawn(gulpPath, args, { stdio: 'inherit' });
