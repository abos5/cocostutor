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
    4. particle 的 resetSystem



# 应该怎么总结

> 这些天断断续续都有看代码, 每次都是看一下下, 每天都有一点点感觉, 不过还是不知道该怎么去记录
>

# 代码阅读的总结

> 图片也许不能直接看( processon 可能有 bug)
> 不能直接看图片的时候可以看下链接地址 [code mind][review mind link]

![code review mind map][review mind map]


[review mind map]: http://www.processon.com/chart_image/58319f75e4b06bc83a325ca9.png "代码阅读导图"
[review mind link]: http://www.processon.com/view/link/58319f03e4b06bc83a32584a
