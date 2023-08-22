---
lang: zh-CN
title: 通信协议综述
description:
article: false
---

专栏「[趣谈网络协议](https://time.geekbang.org/column/intro/100007101?tab=catalog)」学习记录

## 1. 协议三要素：语法、语义、顺序


## 2. IP 和 CIDR
- IP 分类

    |Class|前缀位|网络地址位数|剩余的位数|网络数|每个网络的主机数|IP 地址范围|私有 IP 地址范围|
    |:--|:--|:--|:--|:--|:--|:--|:--|
    |A类地址|0|8|24|128|16,777,214|0.0.0.0~127.255.255.255|10.0.0.0~10.255.255.255|
    |B类地址|10|16|16|16,384|65,534|128.0.0.0~191.255.255.255|172.16.0.0~172.31.255.255|
    |C类地址|110|24|8|2,097,152|254|192.0.0.0~223.255.255.255|192.168.0.0~192.168.255.255|
    |D类地址（群播）|1110|未定义|未定义|未定义|未定义|224.0.0.0~239.255.255.255||
    |E类地址（保留）|1111|未定义|未定义|未定义|未定义|240.0.0.0~255.255.255.255||

- 无类型域间选路（CIDR）

    - 打破原来设计的几类地址的做法，将 IP 地址分为两部分：网络号 + 主机号。如 IP 为 10.0.24.16/22，22 指的是前22位是网络号，后 10 位是主机号。
    - 广播地址：10.0.27.255。当发出一个目的地址为 10.0.27.255 的分组时，它将被分发给该网段上的所有计算机。
    - 子网掩码：255.255.252.0。
    - 子网掩码 & IP 地址 = 网路号

- 公有 IP 地址、私有 IP 地址

- 组播地址（之后 VXLAN 协议会涉及到）


## 3. `ip addr`/`ifconfig`

- 查看 IP 地址：Windows -> `ipconfig`, Linux -> `ifconfig` 或者 `ip addr`

    - 如果在一个被剪裁的很小的 Linux 系统中没有 `ifconfig` 或者 `ip addr`，可以自行安装 net-tools 和 iproute2 这两个工具。

    > net-tools 起源于 BSD，自 2001 年起，Linux 社区已经对其停止维护，而 iproute2 旨在取代 net-tools，并提供了一些新功能。一些 Linux 发行版已经停止支持 net-tools，只支持 iproute2。
    > net-tools 通过 procfs(/proc) 和 ioctl 系统调用去访问和改变内核网络配置，而 iproute2 则通过 netlink 套接字接口与内核通讯。
    > net-tools 中工具的名字比较杂乱，而 iproute2 则相对整齐和直观，基本是 ip 命令加后面的子命令。

    -  ip 后面的 `scope global eth0` 指的是 eth0 这张网卡是 global，是可以对外的，能够接收来自各个地方的包。而`scope host lo` 这张网卡仅仅可以供本机星湖通信。
    
        lo -> loopback(环回接口)，往往会被分配到 127.0.0.1 这个地址。这个地址用于本机通信，经过内核处理后直接返回，不会在任何网络中出现。

    - 在 IP 地址的上一行是 link/ether fa:16:3e:c7:79:75 brd ff:ff:ff:ff:ff:ff，这个被称为 MAC 地址，是一个网卡的物理地址，用十六进制，6 个 byte 表示。

    :::tip MAC 地址全局全局唯一，为什么还要用 IP 呢？
    MAC 地址是唯一的标识，但是要将一个网络包从一个地方传到另一个地方，除了需要确定的地址，还需要定位功能，而 IP 地址次具有远程定位功能（类比身份证 & 地址）。
    MAC 地址具有一定定位功能，但是通信范围比较小，局限在一个子网里。一旦跨网，MAC 地址就不行了。
    :::

    - 网络设备的状态标识（net_device flags）：`<BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP group default qlen 1000`
        - UP: 网卡处于启动状态
        - BROADCAST: 该网卡有广播地址，可以发送广播包
        - MULTICAST: 网卡可以发送多播包
        - LOWER_UP: 表示 L1 是启动的，即网线插着
        - MTU500: 最大传输单元 MTU 为 1500，以太网的默认值
            MTU 是 MAC 层的概念。以太网规定正文部分不允许超过 1500 字节。正文里有 IP 的头、TCP 的头、HTTP的头。如果放不下，就要分片传输。
        - qdisc mq:  qdisc(queueing discipline)，排队规则。如果需要通过某个网络接口发送数据包，它都需要按照为这个接口配置的 qdisc（排队规则）把数据包加入队列。
            - 最简单的 qdisc 是 pfifo，不对进入的数据包做任何处理，数据包采用先进先出的方式通过队列
            - pfifo_fast 稍微复杂一点，他的队列包括三个波段（band），在每个波段里使用先进先出。
                - band 0 的优先级最高。
                - 数据包按照服务类型（Type of Service, TOS）被分配到三个 band 里。TOS 是 IP 头中的一个字段，表示当前的包的优先级。
            - mq 是多队列。


## 4. IP 地址配置

:::code-tabs
@tab net-tools

```shell
$ sudo ifconfig eth1 10.0.0.1/24
$ sudo ifconfig eth1 up
```

@tab iproute2

```shell
$ sudo ip addr add 10.0.0.1/24 dev eth1
$ sudo ip link set up eth1
```
:::

当配置的地址不在同一个网段时，包就无法发送出去了。

例如，周围的机器都是 192.168.1.x，但是配置的 IP 是 192.2.2.4。现在来 ping 192.168.1.6，在把包发出去之前要先把 MAC 层填好，源 MAC 直接填入，但是目的 MAC 需要费一番功夫。

Linux 首先会判断，目的 IP 和源 IP 是否在同一网段，或者和我的一个网卡是否在同一个网段。只有是一个网段的，他才会发送 ARP 请求，获取 MAC 地址。

如果不是一个网段的，那么它会企图把包发送到网关。

如果你配置了网关，Linux 会获取网关的 MAC 地址，然后将包发出去。对于 192.168.1.6 来说，虽然路过它的这个包 IP 是它，但是 MAC 地址不是它的，所以它的网卡不会把包收进去。

如果没配网关，那么包完全发不出去。

如果直接将网关配置成 192.168.1.6 呢？完全不可能，Linux 不会允许配置成功。网关需要和当前的网络至少一个网卡是同一个网段的，192.2.2.4 的网关不可能是 192.168.1.6。

实际分配的时候，一般都是网络管理员分配 IP 地址，且不会直接用命令，而是放在一个配置文件里面。不同系统的配置文件格式不同，但是无非就是 CIDR、子网掩码、广播地址和网关地址。


## 5. 动态主机配置协议（DHCP, Dynamic Host Configuration Protocol）

我们需要自动配置的协议。使用 DHCP，网络管理员只需要配置一段共享的 IP 地址。每一台新接入的机器都通过 DHCP 协议，来这个 IP 地址里申请，然后自动配置好。等人走了或者用完了，还回去，这样其他的机器也能用。

所以，如果是数据中心里面的服务器，IP 一旦配置好，基本不会变，这就相当于买房自己装修。

### DHCP 的工作方式

共 4 次广播，使用 UDP 协议。

#### Step 1: DHCP Discover

当一台机器新加入一个网络时，只知道自己的 MAC 地址。这时的沟通基本靠“吼”，我来啦，有人吗？这一步称为 **DHCP Discover**。

新来的机器使用 IP 地址 0.0.0.0 发送了一个广播包，目的 IP 是 255.255.255.255。广播包封装了 UDP，UDP 封装了 BOOTP。DHCP 是 BOOTP 的增强版，但是抓包后可能看到的名称还是 BOOTP 协议。

广播包内容如下：我是新来的（boot request），我的 MAC 地址是这个，我没 IP，谁能租给我个 IP 地址！

<div align=center>
    <img src=/images/basic/network/dhcp_broadcast.png width=50%/>
</div>

#### Step 2: DHCP Offer

如果一个网络管理员在网络里配置了 DHCP Server，它就相当于这些 IP 的管理员。由于 MAC 是唯一的，所以 DHCP Server 知道来了个“新人”，需要租给它一个 IP 地址。这个过程称为 **DHCP Offer**。DHCP Server 会为此客户保留为它提供的 IP 地址，不会为其他客户分配同一个 IP 地址。

DHCP Offer 的格式如下，里面有给新人分配的地址：

<div align=center>
    <img src=/images/basic/network/DHCP_offer.png width=50%/>
</div>

DHCP Server 仍然使用广播地址作为目的地址，因为此时请求分配 IP 的新人还没有自己的 IP。DHCP Server 为它分配了一个可以用的 IP，并发送了子网掩码、网关和 IP 地址租用期等信息。

#### Step 3: DHCP Request

如果有多个 DHCP Server，这台机器会收到多个 IP 地址。他会选择其中一个 DHCP Offer，一般是最先到达的那个，并向网络发送一个 DHCP Request 广播数据包，包中包含客户端的 MAC 地址、接受的租约中的 IP 地址、提供此租约的 DHCP 服务器地址等，并且告诉所有的 DHCP Server 它将接受哪一台服务器提供的 IP 地址，告诉其他 DHCP 服务器，谢谢你们的接纳，并撤销他们提供的 IP 地址，以便提供给下一个 IP 租用请求者。

<div align=center>
    <img src=/images/basic/network/dhcp_request.png width=50%/>
</div>

此时，由于还没有得到 DHCP Server 的最后确认，客户端仍然使用 0.0.0.0 为源 IP 地址、255.255.255.255 为目标地址进行广播。在 BOOTP 里面，接受某个 DHCP Server 分配的 IP。

#### Step 4: DHCP ACK

最终租约达成的时候，还是需要广播一下，让大家都知道。

当 DHCP Server 收到客户机的 DHCP request 之后，会广播返回给客户机一个 DHCP ACK 消息包，表明已经接受客户机的选择，并将这一 IP 地址的合法租用信息和其他的配置信息都放入该广播包，发给客户机，欢迎它加入网络大家庭。

<div align=center>
    <img src=/images/basic/network/dhcp_ack.png width=50%/>
</div>

## 6. IP 地址回收和续租

客户机在租期过去 50% 的时候，直接向为其提供 IP 的 DHCP Server 发送 DHCP request 消息包。客户机接收到该服务器回应的 DHCP ACK 消息包，会根据包中提供的新租期以及其他更新的 TCP/IP 参数，更新自己的配置。这样，IP 租用期更新就完成了。

## 7. 预启动执行环境（PXE, Pre-boot Execution Environment）

DHCP 协议中还有个细节。网络管理员不仅能自动分配 IP 地址，还能帮你自动安装操作系统！

数据中心的管理员肯呢个一下子拿到几百台控的机器，所以他希望的不仅仅是自动分配 IP 地址，还要自动安装系统。装好系统之后自动分配 IP 地址，直接启动就能用了。

BIOS 启动之后才能安装操作系统，但是在没安装操作系统之前，是没有启动扇区的，所以这个过程叫[预启动执行环境（PXE）](http://www.360doc.com/content/23/0513/05/1080483684_1080483684.shtml)。

PXE 协议分为客户端和服务器端，由于没有操作系统，只能先把客户端放在 BIOS 里面。计算机启动是，BIOS 把 PXE 客户端调入内存里，就可以连接到服务器做一些操作了。

> PXE 客户端（通常也称为 PXE 固件）是网卡固件的一部分，被网卡厂商固化在了网卡的 ROM 中。

PXE 客户端自己需要有 IP 地址。PEX 客户端启动的时候，啥都没有。但是可以发送 DHCP 请求，让 DHCP Server 给它分配一个地址。

PXE 客户端有了自己的地址，那它怎么知道 PXE 服务器在哪呢？

DHCP Server 除了分配 IP 地址以外，还可以做一些其他的事情。下面是一个 DHCP Server 的样例配置：

```
ddns-update-style interim;
ignore client-updates;
allow booting;
allow bootp;
subnet 192.168.1.0 netmask 255.255.255.0
{
option routers 192.168.1.1;
option subnet-mask 255.255.255.0;
option time-offset -18000;
default-lease-time 21600;
max-lease-time 43200;
range dynamic-bootp 192.168.1.240 192.168.1.250;
filename "pxelinux.0";
next-server 192.168.1.180;
}
```

如果想使用 PXE，需要配置 `next-server`，指向 PXE 服务器的地址，还要配置初始启动文件 `filename`。

这样 PXE 客户端启动后，发送 DHCP，除了能得到 IP 地址，还能知道 PXE 服务器在哪。也可以知道如何从 PXE 服务器上下载某个文件，去初始化操作系统。

### PXE 的工作过程

1. PXE 客户端启动。通过 DHCP 协议告诉 DHCP Server 我是“新人”，我来了。DHCP Server 租给他一个 IP 地址，同时也给它 PXE 服务器的地址、启动文件 `pxelinux.0`。

2. PXE 客户端去 PXE 服务器下载启动文件。系在启动文件使用的是 TFTP 协议，所以 PXE 服务器上，还需要有一个 TFTP 服务器。PXE 客户端向 TFTP 服务器请求下载这个文件，TFTP 服务器将文件传给它。

3. PXE 收到了这个文件，开始执行该文件。这个文件会指示 PXE 客户端，向 TFTP 服务器请求计算机的配置信息 `pxelinux.cfg`。TFTP 服务器会给 PXE 客户端一个配置文件，里面会指明内核在哪里、initramfs 在哪里。PXE 客户端会请求这些文件。

4. 启动 Linux 内核。

<div align=center>
    <img src=/images/basic/network/pxe.png width=50%/>
</div>


