# 笔记

1. 为何 game.onLoad 用 property.Component 覆盖了 property
2. 为何 不实用 cc.NodePool， 反而使用自写的 NodePool 模块
3. 代码逻辑
    1. 在代码里很少看到不同组件之间的调用
    2. 初步体验是大部分调用与事件都是在 ccc 上进行绑定的?
4. 看完了 UI 部分的 JS 代码, 感觉代码量很少, 但在突然间代码里的逻辑就被绑定起来了
    1. 游戏开发的思想, 数据驱动的绑定逻辑还不熟
    2. 简单扫了几眼 render 与 actor 的代码, 感觉也是不多
5. 疑问:
    1. 为什么没有全局管理器
    2. dark-slash 的 demo 代码应该是用的旧的版本
6. 未能掌握的:
    1. lerp 是什么
    2. 为什么 PoolMng 要用 return 做为方法名称
    3. AnimHelper 里的 finishHandler 是什么鬼
7. 初步了解的
    1. eventManager 对于按钮时间的暂停监听
    2. 通过 schedule 进行 callback 的调用
    3. 组件的显示与隐藏通过 .active 属性来控制
    4. 一些 ccc 的最佳实践
    5. particle 的 resetSystem
    6. node.active 可以从逻辑上设置一个节点为隐藏
    7. cc.hide() 则是返回一个动作, 用于 runAction 的动作中

# 插件历程

1. 遇到的问题
    1. 插件内的 vue 有bug，带 component 的 vue 实例 init 和 ready 的方法不会被调用
    2. component 里的 ready 方法不会被调用
2. 插件的名称命名为 Binding Tree
3. 全称为 Abos Binding Tree
4. 插件完成之后应该做到的事情
    > /main.js 一般不修改，除非要加新功能
    > /panel/index.js 一般不修改，除非要加新功能
    > /tools/plugin.js 类是底层类， 不做任何修改
    > /panel/plugin-panel.js 里进行根页面的逻辑编写
    > /panel/plugin-panel.html 样式一般写在这里， 首页的样式也写在这里
    > 各种数据的初始化， 可以直接在组件的 data 方法里获取
    > Vue 的组件逻辑， html 可以自由放， 一般推荐 /panel/components, /panel/html
    > 而且 Vue 的 组件会自动注册， 只需要在 package.json 里配置就好
        > aplugin._pkg.abosPlugin.vue.resources = {
        >     name: 'compo-name',
        >     html: 'html-path-rooted-from-package',
        >     js: 'js-path-rooted-from-package',
        > }


### 测试 es6 的一些写法

1. Promise.all
> 在带有contenxt的情景下
> 直接使用 .then 即可
> 不需要在后续获取每个索引再每个循环去处理

```JS
p.push(this.import(path.html).then((html) => {
    compo.html = data
}))
```

2. Promise.all 的深入测试， 区别两种用法
```JS
// 用法1
p.push(this.import(path.html).then((html) => {
    compo.html = data
}))
p.push(this.import(path.js).then((js) => {
    compo.js = data
}))

// 用法2
p.push(
    this.import(path.js)
    .then((js) => {
        compo.js = js
        return this.import(path.html)
    })
    .then((html) => {
        compo.js.template = compo.html
        return Vue.component(compo.name, compo)
    })
)

// 用法3 疯狂版
() => Promise.all(this._pkg.abosPlugin.vue.resources.map((path, index) => this.log('begin loading:', path.name)
    .import(path.js)
    .then((js) => {
        path.compo = js
        return this.import(path.html)
    })
    .then((html) => {
        path.compo.template = html
        return Vue.component(path.name, path.compo)
    })
))
```



# 应该怎么总结

> 这些天断断续续都有看代码, 每次都是看一下下, 每天都有一点点感觉, 不过还是不知道该怎么去记录
>

# 代码阅读的总结

> 图片也许不能直接看( processon 可能有 bug)
> 不能直接看图片的时候可以看下链接地址 [code mind][review mind link]

![code review mind map][review mind map]


[review mind map]: https://on-img.com/chart_image/thumb/58324beee4b05594f51bc996.png "代码阅读导图"
[review mind link]: http://www.processon.com/view/link/58319f03e4b06bc83a32584a
