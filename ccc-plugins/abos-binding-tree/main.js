'use strict';

const fs       = require('fs')
const path     = require('path')
const encoding = 'utf8'


module.exports = {
    load () {
        // 当 package 被正确加载的时候执行
    },

    unload () {
        // 当 package 被正确卸载的时候执行
    },

    messages: {
        open () {
            Editor.Panel.open('abos-binding-tree')
        },
    },
};