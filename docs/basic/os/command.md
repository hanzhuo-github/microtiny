---
lang: zh-CN
title: Linux 命令
description:
article: false
date: 2023-08-23
---


## 1. 用户

- 修改密码：`passwd`

- 创建用户：
    - 创建新用户：`useradd user-name`
    - 为新用户设置密码：`passwd user-name`

:::tip
可以使用 `-h` 参数查看帮助。如 `useradd -h`。

如果想看更详细的文档，可以通过 `man useradd` 获得。
:::

通过命令创建的用户，放在 /etc/passwd 文件里。组的信息在 /etc/group 中。我们可以通过 `cat` 命令查看。

我们在 passwd 文件中看到了新创建的用户（用户名为 test）:
```:no-line-numbers
test:x:1003:1003::/home/test:/bin/sh
```

x 的地方是密码。然后是用户 ID 和组 ID。

root 用户的主目录为 `/root`。test 用户的主目录为 `/home/test`。

`/bin/bash` 的位置是用于配置登录后的默认交互命令行的

## 2. 浏览文件

- `cd`: change directory
- `ls`: 列出当前目录下的文件（Windows 中可以用 `dir`）
    - `-l`: 用列表方式列出
        ```:no-line-numbers
        drwxr-xr-x  2 root root  4096 Aug  8 11:10 a/
        -rw-r--r--  1 root root   161 Jul  9  2019 b
        ```
        - 第一个字段的第一个字符是**文件类型**。`-` 表示普通文件，`d` 表示目录。
        - 第一个字段的剩下 9 个字段是**模式**，即**权限位**（access permission bits）。3 个一组，每一组 rwx 分别表示“读（read）”、“写（write）”、“执行（execute）”。每一组分别表示文件所属的用户权限、文件所属的组权限、其他用户的权限。
        - 第二个字段是**硬链接**（hard link）的数目
        - 第三个字段是**所属用户**，第四个字段是**所属组**。第五个字段是文件的大小。第六个字段是文件被修改的日期。最后是文件名。

- `chmod 711 a`: 修改权限
- `chown`: 改变所属用户
- `chgrp`: 改变所属组  
- 该文件所属用户可以使用 `chmod` 修改权限，但是 `chown`、`chgrp` 命令只能由 sudoers（在 /etc/sudoers 内查看） 来做。  


## 3. 安装软件

### 3.1 没有软件管家

- 下载：最安全的方式是到官网下载，对于 Linux 可以下载 `rpm` 或者 `deb`。

> Linux 有两大体系，CentOS 体系使用的是 `rpm`，Ubuntu 体系用的是 `deb`。

- 安装：
::: code-tabs#安装

@tab CentOS

```shell
rpm -i jdk-XXX_linux-x64_bin.rpm
```

@tab Ubuntu

```shell
dpkg -i jdk-XXX_linux-x64_bin.deb
```
:::

- 查看软件列表：
::: code-tabs#查看软件列表

@tab CentOS

```shell
rpm -qa
```
> q 指 query，a 指 all

@tab Ubuntu

```shell
dpkg -l
```
:::

- 使用 grep 搜索工具或 more、less

这个列表很长，很难找到刚安装的软件。如果知道软件有某个关键词，可以使用搜索工具 grep:

::: code-tabs#使用 grep

@tab CentOS

```shell
rpm -qa | grep jdk
```
> q 指 query，a 指 all

@tab Ubuntu

```shell
dpkg -l | grep jdk
```
:::


如果不知道关键词，可以使用 `rpm -qa | more` 和 `rpm -qa | less`（`dpkg -l | more` 和 `dpkg -l | less`），可以将很长的结果分页展示。

    `more` 只能向后翻页，到最后一页自动结束；`less` 前后都能翻，输入 q 可以退出。

- 删除软件：`rpm -e` 或 `dpkg -r`

### 3.2 有软件管家

CentOS 的软件管家是 `yum`，Ubuntu 对应的是 `apt-get`。

- 搜索：可以通过管道 grep、more、less 来进行过滤。

::: code-tabs#搜索

@tab CentOS

```shell
yum search jdk
```
> q 指 query，a 指 all

@tab Ubuntu

```shell
apt-cache search jdk
```
:::

选中对应的版本就可以进行安装了

- 安装：

::: code-tabs#安装

@tab CentOS

```shell
yum install java-11-openjdk.x86_64
```
> q 指 query，a 指 all

@tab Ubuntu

```shell
apt-get install openjdk-19-jdk
```
:::

- 卸载：

::: code-tabs#卸载

@tab CentOS

```shell
yum erase java-11-openjdk.x86_64
```
> q 指 query，a 指 all

@tab Ubuntu

```shell
apt-get purge openjdk-9-jdk
```
:::

- 配置源

Linux 允许我们配置从哪里下载这些软件，CentOS 的配置文件在 `/etc/yum.repos.d/CentOS-Base.repo` 里；Ubuntu 的配置文件在 `/etc/apt/sources.list` 里。

:::details 源配置文件内容示例
::: code-tabs#源

@tab CentOS

```
[base]
name=CentOS-$releasever - Base - 163.com
baseurl=http://mirrors.163.com/centos/$releasever/os/$basearch/
gpgcheck=1
gpgkey=http://mirrors.163.com/centos/RPM-GPG-KEY-CentOS-7

```
> q 指 query，a 指 all

@tab Ubuntu

```
deb http://mirrors.tencentyun.com/ubuntu jammy main restricted
deb http://mirrors.tencentyun.com/ubuntu jammy-updates main restricted
deb http://mirrors.tencentyun.com/ubuntu jammy universe
deb http://mirrors.tencentyun.com/ubuntu jammy-updates universe
```
:::

### 3.3 下载 + 配置环境

无论是哪种下载方式，最终都是下载文件，存放在某路径下，然后再相应的配置文件中进行配置。主执行文件会存放在 /usr/bin 或 /usr/sbin 下面，其他的库文件会在 /var 下面，配置文件在 /etc 下面。

所以还可以用一种简单粗暴的方法。使用 `wget` 将安装好的文件直接下载下来，然后解压缩。例如在 jdk 官网中的安装目录里，Windows 有 jdk-XXX_Windows-x64_bin.zip，这是 Windows 下常用的压缩模式。Linux 有 jdk-XXX_linux-x64_bin.tar.gz，这是 Linux 下常用的压缩模式。

如果要解压 zip，需要先安装 zip 程序：

::: code-tabs#安装 zip

@tab CentOS

```shell
yum install zip.x86_64 unzip.x86_64
```
> q 指 query，a 指 all

@tab Ubuntu

```shell
apt-get install zip unzip
```
:::

如果是 tar.gz，Linux 默认有 tar 程序，使用下面命令就可以解压缩了

```shell
tar xvzf jdk-XXX_linux-x64_bin.tar.gz
```

解压缩之后，需要配置环境变量，可以通过 `export` 命令来配置。

```shell
export JAVA_HOME=/root/jdk-XXX_linux-x64
export PATH=$JAVA_HOME/bin:$PATH
```

export 命令仅在当前命令行的会话中管用，一旦退出重新登录进来，就不管用了。我们需要一个可以永远起作用的配置。

在当前用户的默认工作目录（/root 或 /home/test）下，有 `.bashrc` 文件。每次登录的时候，这个文件都会运行。也可以通过 `source .bashrc` 手动执行。

可以使用 vim 文本编辑器来编辑 `.bashrc` 文件。如果默认没安装，可以使用 `yum install vim` 或 `apt-get install vim` 安装。

在 `.bashrc` 文件中加入 export 的两行，进行保存。

:::tip 几个配置文件的区别
- /etc/profile

    为系统的每个用户设置环境信息，当用户第一次登录时，该文件被执行。并从 /etc/profile.d 目录下的配置文件中收集 shell 的设置。

    修改这个文件需要 source 一下，修改才会生效。此修改对每个用户都生效。

- /etc/bashrc（Ubuntu 中为 /etc/bash.bashrc ）

    为每一个运行 bash shell 的用户执行此文件。当 bash shell 被打开时，该文件被读取。

    修改这个文件不用重启，重新打开一个 bash 即可生效。

- ~/.bash_profile（Ubuntu 中为 ~/.profile）

    用该文件输入专用于自己使用的 shell 信息，当用户登录时，该文件仅执行一次。它设置一些环境变量，执行用户的 ~/.bashrc 文件。

    修改后需要 source。只对当前用户生效。

- .bashrc 是个人的配置信息存储文件，只对单用户有效

    包含专属于自己的 bash shell 的 bash 信息。当登录以及每次打开新的 shell 时，该文件被读取。

    不需要重启、只需要重新打开一个 bash 即可生效。

:::


## 4. 运行程序

### 4.1 通过 shell 在交互命令行里运行

只要文件有 x 执行权限，都可以在该目录下用 `./filename` 执行。如果程序在 PATH 中，那么直接调 `filename` 就可以了。

在命令行中运行的程序，一旦交互命令行退出，程序就停止运行了。

### 4.2 后台运行

`nohup`（no hang up, 不挂起），即交互命令行退出时，程序还要在。

这时程序不能霸占交互命令行，应该在后台运行。最后要加一个 `&`，表示在后台运行。

原本可以利用命令行进行输出，现在可以输出到文件。

最终命令的一般形式是：
```shell
nohup command > out.file 2>&1 &
```

- `1`: 文件描述符 1，表示标准输出
- `2`: 文件描述符 2，表示标准错误输出
- `2>&1`: 表示标准输出和错误输出合并了，合并到 out.file 中


那么如何关闭这个进程呢？

```shell
ps -ef |grep 关键字  |awk '{print $2}'|xargs kill -9
```

- `ps -ef` 可以单独执行，列出所有正在运行的程序，`grep` 做搜索
- `awk` 可以灵活地对文本进行处理，`awk '{print $2}'` 是指第二列的内容，是运行的程序 ID
- `xargs` 命令将前面的输入作为后面命令 `kill -9` 的输入，也就是传左边命令截取的进程号给命令 `kill -9`


### 4.3 以服务的方式运行

Linux 中有服务，比如数据库 MySQL 就可以以服务的方式运行。

Ubuntu 中，我们可以使用 `apt-get install mysql-server` 安装 MySQL，调用命令 `systemctl start mysql` 启动 MySQL，通过 `systemctl enable mysql` 设置开机启动。对应的，在 /lib/systemd/system 目录下会创建一个 XXX.service 的配置文件，里面定义了如何启动、如何关闭。

在 CentOS 中有些特殊，MySQL 被 Oracle 收购后，因为担心授权问题，改为使用 MariaDB，它是 MySQL 的一个分支。安装：`yum install mariadb-server mariadb`。启动：`systemctl start mariadb`。开机启动：`systemctl enable mariadb`。同样，会在 /usr/lib/systemd/system 下创建 XXX.service 的配置文件，从而成为一个服务。

:::info
查看更多 [systemd](http://www.ruanyifeng.com/blog/2016/03/systemd-tutorial-commands.html)
:::

## 5. 关机 & 重启

`shutdown -h now` 现在就关机

`reboot` 重启

## 6. 总结

<iframe
  :src="$withBase('/mind-map/linux-command.html')"
  width="100%"
  height="400"
  frameborder="0"
  scrolling="No"
  leftmargin="0"
  topmargin="0"
/>
