## 🖖 v2ex reaction
> 给v2ex增加 `emoji reaciton` 功能



### 效果

![image-20230624161320961](https://cdn.jsdelivr.net/gh/yuyinws/static@master/2023/06/upgit_20230624_1687594401.png)



### 使用

1. [安装脚本](https://greasyfork.org/zh-CN/scripts/469342-v2ex-reaciton)

2. 进入任意一个帖子，拉到帖子内容底部，使用GitHub账号进行登录，即可使用。



### 它是如何工作的

本项目高度受到[giscus](https://github.com/giscus/giscus)的启发，因此工作原理与giscus基本一致。

每个v2ex的帖子会在本仓库的[discussions](https://github.com/yuyinws/v2ex-reaction/discussions/categories/v2ex)中有一个对应的帖子(如果不存在则会由bot自动创建)，所有reaction数据都与discussion保持一致。
