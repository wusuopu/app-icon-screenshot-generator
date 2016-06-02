'use strict';

const gm = require('gm').subClass({imageMagick: true});
const _ = require('lodash');
const fs = require('fs');
const os = require('os');
const mkdirp = require('mkdirp');
const child_process = require('child_process');

if (process.argv.length < 3) {
  console.log('Usage: node icon.js <filename>');
  process.exit(1);
}
const filename = process.argv[2];
if (!fs.existsSync(filename)) {
  console.log(`${filename} is not exist!`);
  process.exit(1);
}

const deviceSize = {
  '4S': {w: 960, h: 640},
  '5': {w: 1136, h: 640},
  //'6': {w: 1334, h: 750},
  '6P': {w: 2208, h: 1242},
  'iPad': {w: 1024, h: 768},      // 2048 * 1536
  'iPad Pro': {w: 2732, h: 2048}
};

const OUT_DIR = __dirname + '/output';

const androidIconSize = {
  'web': { w: 512, h: 512 },
  'ldpi': { w: 36, h: 36 },
  'mdpi': { w: 48, h: 48 },
  'hdpi': { w: 72, h: 72 },
  'xhdpi': { w: 96, h: 96 },
  'xxhdpi': { w: 144, h: 144 },
  'xxxhdpi': { w: 192, h: 192 }
};

const iosIconSize = {

};

function generateAndroid() {
  _.each(androidIconSize, (size, name) => {
    let tmpFile = `${os.tmpdir()}/android-${size.w}x${size.h}-${Date.now()}.png`;
    gm(filename).resize(size.w, size.h).write(tmpFile, (err) => {
      if (err) {
        console.log(err, name);
        return;
      }
      let output = `${OUT_DIR}/android/mipmap-${name}`;
      let maskFile = `${__dirname}/android-mask/mask-${name}.png`;
      mkdirp.sync(output);

      let cmd = `convert "${tmpFile}" -alpha set -gravity center -extent ${size.w}x${size.h} "${maskFile}" -compose DstIn -composite "${output}/ic_launcher.png"`;
      console.log('cmd: ', cmd);
      child_process.execSync(cmd);
      fs.unlinkSync(tmpFile);
    });
  });
  
}

function generateIOS() {
  
}

generateAndroid();
