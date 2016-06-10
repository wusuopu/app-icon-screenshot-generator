'use strict';

const gm = require('gm').subClass({imageMagick: true});
const _ = require('lodash');
const fs = require('fs');
const os = require('os');
const mkdirp = require('mkdirp');
const child_process = require('child_process');


const OUT_DIR = os.tmpDir() + '/app-icon/output';

const androidIconSize = {
  // 'web': { w: 512, h: 512 },
  'ldpi': { w: 36, h: 36 },
  'mdpi': { w: 48, h: 48 },
  'hdpi': { w: 72, h: 72 },
  'xhdpi': { w: 96, h: 96 },
  'xxhdpi': { w: 144, h: 144 },
  'xxxhdpi': { w: 192, h: 192 }
};

const iosImagesIsze = {
  'Icon-60.png': { w: 60, h: 60 },
  'Icon-72.png': { w: 72, h: 72 },
  'Icon-72@2x.png': { w: 144, h: 144 },
  'Icon-Small-50.png': { w: 50, h: 50 },
  'Icon-Small-50@2x.png': { w: 100, h: 100 },
  'Icon.png': { w: 57, h: 57 },
  'Icon@2x.png': { w: 114, h: 114 },
  'iTunesArtwork.png': { w: 512, h: 512 },
  'iTunesArtwork@2x.png': { w: 1024, h: 1024 }
}
const iphoneIconSize = {
  'Icon-40.png': { w: 40, h: 40 },
  'Icon-40@2x.png': { w: 80, h: 80 },
  'Icon-40@3x.png': { w: 120, h: 120 },
  'Icon-60@2x.png': { w: 120, h: 120 },
  'Icon-60@3x.png': { w: 180, h: 180 },
  'Icon-76.png': { w: 76, h: 76 },
  'Icon-76@2x.png': { w: 152, h: 152 },
  'Icon-83.5@2x.png': { w: 167, h: 167 },
  'Icon-Small.png': { w: 29, h: 29 },
  'Icon-Small@2x.png': { w: 58, h: 58 },
  'Icon-Small@3x.png': { w: 87, h: 87 }
};
const appleWatchIconSize = {
  'Icon-24@2x.png': { w: 48, h: 48 },
  'Icon-27.5@2x.png': { w: 55, h: 55 },
  'Icon-29@2x.png': { w: 58, h: 58 },
  'Icon-29@3x.png': { w: 87, h: 87 },
  'Icon-40@2x.png': { w: 80, h: 80 },
  'Icon-44@2x.png': { w: 88, h: 88 },
  'Icon-86@2x.png': { w: 172, h: 172 },
  'Icon-98@2x.png': { w: 196, h: 196 }
};
const iphoneContents = `
{
  "images" : [
    {
      "idiom" : "iphone",
      "size" : "29x29",
      "scale" : "2x",
      "filename" : "Icon-Small@2x.png"
    },
    {
      "idiom" : "iphone",
      "size" : "29x29",
      "scale" : "3x",
      "filename" : "Icon-Small@3x.png"
    },
    {
      "idiom" : "iphone",
      "size" : "40x40",
      "scale" : "2x",
      "filename" : "Icon-40@2x.png"
    },
    {
      "idiom" : "iphone",
      "size" : "40x40",
      "scale" : "3x",
      "filename" : "Icon-40@3x.png"
    },
    {
      "idiom" : "iphone",
      "size" : "60x60",
      "scale" : "2x",
      "filename" : "Icon-60@2x.png"
    },
    {
      "idiom" : "iphone",
      "size" : "60x60",
      "scale" : "3x",
      "filename" : "Icon-60@3x.png"
    },
    {
      "idiom" : "ipad",
      "size" : "29x29",
      "scale" : "1x",
      "filename" : "Icon-Small.png"
    },
    {
      "idiom" : "ipad",
      "size" : "29x29",
      "scale" : "2x",
      "filename" : "Icon-Small@2x.png"
    },
    {
      "idiom" : "ipad",
      "size" : "40x40",
      "scale" : "1x",
      "filename" : "Icon-40.png"
    },
    {
      "idiom" : "ipad",
      "size" : "40x40",
      "scale" : "2x",
      "filename" : "Icon-40@2x.png"
    },
    {
      "idiom" : "ipad",
      "size" : "76x76",
      "scale" : "1x",
      "filename" : "Icon-76.png"
    },
    {
      "idiom" : "ipad",
      "size" : "76x76",
      "scale" : "2x",
      "filename" : "Icon-76@2x.png"
    },
    {
      "idiom" : "ipad",
      "size" : "83.5x83.5",
      "scale" : "2x",
      "filename" : "Icon-83.5@2x.png"
    }
  ],
  "info" : {
    "version" : 1,
    "author" : "lcj"
  }
}
`;
const watchContents = `
{
  "images" : [
    {
      "size" : "24x24",
      "idiom" : "watch",
      "scale" : "2x",
      "filename" : "Icon-24@2x.png",
      "role" : "notificationCenter",
      "subtype" : "38mm"
    },
    {
      "size" : "27.5x27.5",
      "idiom" : "watch",
      "scale" : "2x",
      "filename" : "Icon-27.5@2x.png",
      "role" : "notificationCenter",
      "subtype" : "42mm"
    },
    {
      "size" : "29x29",
      "idiom" : "watch",
      "filename" : "Icon-29@2x.png",
      "role" : "companionSettings",
      "scale" : "2x"
    },
    {
      "size" : "29x29",
      "idiom" : "watch",
      "filename" : "Icon-29@3x.png",
      "role" : "companionSettings",
      "scale" : "3x"
    },
    {
      "size" : "40x40",
      "idiom" : "watch",
      "scale" : "2x",
      "filename" : "Icon-40@2x.png",
      "role" : "appLauncher",
      "subtype" : "38mm"
    },
    {
      "size" : "44x44",
      "idiom" : "watch",
      "scale" : "2x",
      "filename" : "Icon-44@2x.png",
      "role" : "longLook",
      "subtype" : "42mm"
    },
    {
      "size" : "86x86",
      "idiom" : "watch",
      "scale" : "2x",
      "filename" : "Icon-86@2x.png",
      "role" : "quickLook",
      "subtype" : "38mm"
    },
    {
      "size" : "98x98",
      "idiom" : "watch",
      "scale" : "2x",
      "filename" : "Icon-98@2x.png",
      "role" : "quickLook",
      "subtype" : "42mm"
    }
  ],
  "info" : {
    "version" : 1,
    "author" : "lcj"
  }
}
`;

function generateAndroid(inputFile, surround) {
  mkdirp.sync(`${OUT_DIR}/android`);
  _.each(androidIconSize, (size, name) => {
    let tmpFile = `${os.tmpdir()}/android-${size.w}x${size.h}-${Date.now()}.png`;
    gm(inputFile).resize(size.w, size.h).write(tmpFile, (err) => {
      if (err) {
        console.log(`generate android's icon err[${name}]:`, err);
        return;
      }
      let output = `${OUT_DIR}/android/mipmap-${name}`;
      let maskFile = `${__dirname}/../assets/android-mask/mask-${name}.png`;
      mkdirp.sync(output);

      if (surround) {
        let cmd = `convert "${tmpFile}" -alpha set -gravity center -extent ${size.w}x${size.h} "${maskFile}" -compose DstIn -composite "${output}/ic_launcher.png"`;
        child_process.execSync(cmd);
      } else {
        fs.writeFileSync(`${output}/ic_launcher.png`, fs.readFileSync(tmpFile));
      }
      fs.unlinkSync(tmpFile);
    });
  });
  // generate a icon used in web
  gm(inputFile).resize(512, 512).write(`${OUT_DIR}/android/playstore-icon.png`, (err) => {
      if (err) {
        console.log(`generate android's icon err[playstore]:`, err);
        return;
      }
  });
}

function generateIOS(inputFile) {
  let imageDir = `${OUT_DIR}/ios`;
  let iphoneIconDir = `${imageDir}/AppIcon.appiconset`;
  let watchIconDir = `${OUT_DIR}/watchkit/AppIcon.appiconset`;
  mkdirp.sync(imageDir);
  mkdirp.sync(iphoneIconDir);
  mkdirp.sync(watchIconDir);

  _.each(iosImagesIsze, (size, name) => {
    gm(inputFile).resize(size.w, size.h).write(`${imageDir}/${name}`, (err) => {
      if (err) {
        console.log(`generate ios's icon err[${name}]:`, err);
        return;
      }
    });
  });
  _.each(iphoneIconSize, (size, name) => {
    gm(inputFile).resize(size.w, size.h).write(`${iphoneIconDir}/${name}`, (err) => {
      if (err) {
        console.log(`generate iphone's icon err[${name}]:`, err);
        return;
      }
    });
  });
  _.each(appleWatchIconSize, (size, name) => {
    gm(inputFile).resize(size.w, size.h).write(`${watchIconDir}/${name}`, (err) => {
      if (err) {
        console.log(`generate apple watch's icon err[${name}]:`, err);
        return;
      }
    });
  });

  fs.writeFileSync(`${iphoneIconDir}/Contents.json`, iphoneContents);
  fs.writeFileSync(`${watchIconDir}/Contents.json`, watchContents);
}

if (process.argv[1] === __filename) {
  if (process.argv.length < 3) {
    console.log('Usage: node icon.js <filename>');
    process.exit(1);
  }

  const filename = process.argv[2];
  if (!fs.existsSync(filename)) {
    console.log(`${filename} is not exist!`);
    process.exit(1);
  }
  if (!fs.statSync(filename).isFile()) {
    console.log(`${filename} is not a normal file`);
    process.exit(1);
  }
  generateAndroid(filename, true);
  generateIOS(filename);
}

module.exports = {
  generateIOS,
  generateAndroid,
  OUT_DIR
};
