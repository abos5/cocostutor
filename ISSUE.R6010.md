如题

![image](https://cloud.githubusercontent.com/assets/5197118/19831157/b2d25172-9e35-11e6-99c8-2bc64290f340.png)

CCC 1.3.0 console 信息:
![image](https://cloud.githubusercontent.com/assets/5197118/19831173/26065a80-9e36-11e6-9729-bd0f89cb65bb.png)


代码如下:
(在谷歌浏览器下工作正常)
plugin:
```js
(function (root) {
    // 绑定 dragon planet 的全局库
    let dp = {
        remote: {
            single: null,
            init: function (host) {
                if (cc.sys.isNative) {
                    this.single = root.io.connect(host)
                } else {
                    this.single = root.io(host)
                }
            }
        }
    }
    root.dp = dp
    if (cc.sys.isNative) {
        root.io = SocketIO
    } else if (typeof io === 'undefined') {
        root.io = require('socket.io-client')
    } else {
        root.io = io
    }
    
})(this)
```
Game.js

```js
   dp.remote.init('ws://xxx:3000/star');
```
