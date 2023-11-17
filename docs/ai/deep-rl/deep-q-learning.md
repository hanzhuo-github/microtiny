---
lang: zh-CN
title: Deep Q-learning
description:
article: false
date: 2023-11-06
order: 3
---

Q-Learning 是 *tabular method*，It is not scalable. 当 state space 比较小时，我们可以使用之前的 Q-learning，训练 Q Table 来实现目标。当 state space 很大时（玩 Atari 游戏时，可能达到 $10^9$ 到 $10^{11}$ 种状态之多），Q Table 就会很低效。在这种情况下，我们不再使用 Q 表，而是使用 Neural Network 来获取状态、根据该状态为每一个 action 估计 Q-value，这种方式就是 Deep Q-Learning。

![](/images/ml/drl/deep-q-learning.jpeg =600x)


<!-- 我们将使用 [RL-Zoo](https://github.com/DLR-RM/rl-baselines3-zoo) 来训练 agent 玩 Space Invaders 和其他 Atari 游戏。 -->

## 1. The Deep Q-Network (DQN)

Deep Q-Learning Network 的架构如下：

![](/images/ml/drl/deep-q-network.jpg =600x)

我们输入 state（a stack of 4 frames），输出在该状态下每个可能的 action 的 Q-value 向量。这样，我们就可以像 Q-Learning 一样，使用 epsilon-greedy policy 来决定采取哪种行动。

### DQN 的过程

为了降低 state 的复杂性，我们对输入进行降维（84 * 84）并灰度化（grayscale），将 3 通道 GRB（`160*210*3`）降低到 1 维（`84*84*1`）。

> 能这么做是因为 Atari environments 中的颜色并没有很重要的信息。同样，我们也可以截掉屏幕的一部分，如果它没有什么重要信息。

我们将 4 帧信息堆叠在一起（这样可以捕捉到 temporal information，解决 temporal limitation 的问题）作为输入。

然后经过 3 层 convolutional layers。卷积层可以捕捉并利用图像的空间的关系。由于我们使用了 4 个帧，它还能利用这些帧之间的一些 temporal properties。

最后，经过几个 fully connected layers，为该状态下每个可能的 action 输出对应的 Q-value。


## 2. The Deep Q-Learning Algorithm

Deep Q-Learning 和 Q-Learning 的主要不同之处在于：Q-Learning 直接对 Q-value 进行更新
$$
Q(S_t, A_t) \leftarrow Q(S_t, A_t) + \alpha[R_{t+1} + \gamma \mathop{max}\limits_{a} Q(S_{t+1, A_t}) - Q(S_t, A_t)]
$$

而 Deep Q-Learning 创建 loss function（比较 Q-value prediction 和 Q-target），利用 gradient descent 来更新 Deep Q-Network 的权重来估计 Q-value。

![](/images/ml/drl/Q-target.jpg =600x)

Deep Q-Learning 算法有两个阶段：
- Sampling：执行动作，将观察到的 experience tuples 存到 replay memory 中。
- Training：随机选择一小批 tuples，利用 gradient descent 从这批 tuples 中学习

![](/images/ml/drl/sampling-training.jpg =700x)

由于使用了非线性 Q-value function（Neural Network）和 bootstrapping（利用现有估计更新目标，而不是实际的完整的回报），Deep Q-Learning 的训练可能不稳定。

为了使得训练更稳定，我们采取了下面的措施：
1. *Experience Replay* to make more **efficient use of experiences**.
2. *Fixed Q-Target* **to stabilize the training**.
3. *Double Deep Q-Learning*, to **handle the problem of the overestimation of Q-values**.

### 2.1 Experience Replay

创建 replay memory 有两个作用：

1. 在训练过程中高效利用 experiences。

    一般来说，在 online reinforcement learning 中，agent 和环境进行交互，获得 experiences（state, action, reward, next state），从中学习（updates the neural network），然后就 discard 了这些 experiences。

    使用 replay buffer 存储 Experience samples，我们可以在训练过程中重复使用，这样更加高效。

    它也能够让 agent 多次学习相同的 experiences。

2. 避免忘记以前的 experiences，减少了 experiences 之间的 correlation。

    如果我们给神经网络提供 sequential samples of experiences，当它获得新 experiences 时，往往会忘记以前的 experiences。比如，agent 玩了第一关，然后玩了第二关，它可能会忘记第一关怎么玩了。

    解决的办法就是，当 agent 与环境进行交互时，将 experience tuples 存到 replay buffer 中，之后取样一批 tuples。这样就避免了网络只学它刚刚做的事情了。

    通过随机抽样，消除了 observation sequences 中的相关性，避免 action values 振荡以及灾难性的偏离。

我们初始化了 replay buffer D，其 capacity N 是一个超参。在训练过程中，存储 experiences，并取样一个批次喂给 Deep Q-Network。

![](/images/ml/drl/experience-replay.jpg =600x)

### 2.2 Fixed Q-Target

TD error（或称 loss）：TD target（Q-Target）和当前 Q-value（estimation of Q）的差。

但是我们不知道实际的 TD target 是多少。我们需要对其进行估计。使用 Bellman equation，TD target 就是在该状态下采取该行动获得的 reward 加上下一状态的最高 Q value 的折扣值。

![](/images/ml/drl/Q-target.jpg =600x)

问题在于，我们用于估计 TD Target 和 Q-value 的参数（神经网络权重）是一样的。于是，TD  和 Q-value 之间存在显著的相关性。在训练的每一步，权重的更新既会使 Q-value 更接近 TD Target，但也会导致目标值本身发生变化。这就像是在追逐一个不断移动的目标。这个问题会导致在训练过程中出现显著的振荡。因为 Q-value 和 TD Target 在不断相互影响，它们可能在每次训练迭代中都在变化，这会导致训练的不稳定性，使得 agent 难以稳定地学习。

在伪代码中可以看到：
- 使用的单独的参数固定的网络来估计 TD Target
- 每 C 个 step 从 Deep Q-Network 中复制参数来更新 target network

![](/images/ml/drl/fixed-q-target-pseudocode.jpg =600x)

### 2.3 Double Deep Q-Learning

Double DQNs (或 Double Deep Q-Learning neural networks) 是为了解决 overestimation of Q-values。

计算 TD 目标时，我们如何确定执行哪个行动会得到最高的 Q-value。尤其是训练开始的时候，没有足够多的信息，以最大的 Q-value 来确定最优 action 可能会导致 false positive。如果非最优的 actions 规律性地高于最优 actions 的Q值，学习将变得复杂。

解决的方案是，使用两个网络来计算 Q target：
- 使用 DQN network 选择最佳 action (有最高 Q-value 的 action)
- 使用 Target network 计算执行该行动后的目标 Q-value
