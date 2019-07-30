#!/usr/bin/env node
/*
 * zipcode.js -- part of bsball
 * 
 * Copyright (C) 2019 Paul Ciarlo <paul.ciarlo@gmail.com>
 * 
 * See LICENSE file for terms of copyright use.
 */

'use strict';

const fs = require('fs');

function coroutine_for_nodelib(module, fun) {
  return async function() {
    const args = [...arguments];
    return new Promise((resolve, reject) => {
      const cb = (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      };
      fun.apply(module, [args, cb].flat());
    });
  };
}

function test_coroutine_for_nodelib() {
  const coro = coroutine_for_nodelib(fs, fs.readFile);
  coro('zipcode.js').then(text => console.log(new String(text)));
}

function ZipcodeData(dataObj) {
  this.data = dataObj;
}

module.exports = ZipcodeData;

ZipcodeData.prototype.getStats = function () {
  return {
    zipCount: Object.keys(this.data).length
  };
};

ZipcodeData.loadFromJsonFile = async function (filename) {
  const jsonData = await coroutine_for_nodelib(fs, fs.readFile)(filename);
  return new ZipcodeData(JSON.parse(jsonData));
};

async function main() {
  try {
    const data = await ZipcodeData.loadFromJsonFile('data/zipcodes.json');
    const stats = data.getStats();
    console.log('Got bsball zipcode data; count:', stats.zipCount);
  } catch (e) {
    console.error('Top-level exception handler caught:', e);
  }
}

if (require.main === module) {
  main().finally();
}
