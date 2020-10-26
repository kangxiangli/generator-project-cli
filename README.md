# generator-project-cli

## 项目描述
基于yeoman-generator脚手架搭建的项目模板

### 使用说明
```
npm install -g yo
npm install -g generator-generator
```
### 安装好依赖后执行
> yoeaman的generator是一个全局npm module，我们在本地开发的generator可以通过软连接的方式在本地生成它的全局npm包。在工程的根目录下运行
```
npm link
```
它会在本地的全局npm目录下安装我们新建的generator

### 运行
> 在你需要初始化项目的地方运行
```
yo [generator-name] //比如你的项目叫generator-project-cli，我们运行时 yo project-cli 即可
```
**注意执行命令是要在你的目标文件夹下，比如项目generator-project-cli在你的c盘，但是你项新建一个项目在d盘/testSite，你就需要在d盘的/testSite文件夹下打开cmd 执行yo project-cli 命令**