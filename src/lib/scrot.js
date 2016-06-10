'use strict';

const gm = require('gm').subClass({imageMagick: true});
const _ = require('lodash');
const fs = require('fs');
const os = require('os');
const mkdirp = require('mkdirp');
const async = require('async');

const OUT_DIR = os.tmpDir() + '/app-scrennshot/output';
const deviceSize = {
  '4S': {h: 960, w: 640},
  '5': {h: 1136, w: 640},
  '6': {h: 1334, w: 750},
  '6Plus': {h: 2208, w: 1242},
  // 'iPad': {h: 1024, w: 768},      // 2048 * 1536
  // 'iPad Pro': {h: 2732, w: 2048}
};

function generateIOS(inputFiles, done) {
  let result = {};
  async.eachSeries(inputFiles, (input, next) => {
    gm(input).size((err, size) => {
      if (err) {
        return next(err);
      }
      const isLandscape = size.width > size.height;

      async.forEachOfSeries(deviceSize, (value, key, cb) => {
        if (!result[key]) {
          result[key] = [];
        }
        mkdirp.sync(`${OUT_DIR}/${key}`);
        let {w, h} = value;
        if (isLandscape) {
          w = value.h;
          h = value.w;
        }

        let filename = `${OUT_DIR}/${key}/${Date.now()}.png`;
        result[key].push(filename);
        gm(input).resizeExact(w, h).write(filename, cb);
      }, next);

    });
  }, (err) => {
    done(err, result);
  });
}

module.exports = {
  generateIOS,
  OUT_DIR
};
