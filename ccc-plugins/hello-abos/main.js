'use strict';

const Fs = require('fs')


module.exports = {
  load () {
    // 当 package 被正确加载的时候执行
  },

  unload () {
    // 当 package 被正确卸载的时候执行
  },

  messages: {
    sayHello () {
      Editor.log("Hello Abos, aren't u awesome!");
    },
    logging (msg) {
      Editor.log(msg);
    },
    openBindingTreeView () {
      Editor.Panel.open('hello-abos')
    },
    parseFire(path) {
      if (! Fs.existsSync(path)) {
          Editor.warning('Invalid fire file')
      }
      let fire = Fs.readFileSync(path)
      fire = JSON.parse(fire)
      if (! fire) {
          Editor.log(fire, path)
      }
      return fire
    }
  },
};