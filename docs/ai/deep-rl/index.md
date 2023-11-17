---
lang: zh-CN
title: Introduction
description:
article: false
date: 2023-10-31
order: 1
---

深度强化学习（Deep Reinforcement Learning）是机器学习的一种，用于训练智能代理（Agent）在未知环境中通过试错学习来采取最佳行动以实现特定目标。

深度学习背后的思想是，一个代理（一种人工智能）通过与环境的互动（通过试错）并根据执行动作后获得的奖励（正面或负面的反馈）来学习。

:::info
[Reinforcement Learning: An Introduction, Richard Sutton and Andrew G. Barto](http://incompleteideas.net/book/RLbook2020.pdf)
:::

下面将介绍强化学习相关的概念，而深度强化学习就是将 deep neural networks 应用于强化学习问题中。


## 1. RL Process

![](/images/ml/drl/RL_process.jpg =600x)

RL 循环输出一系列的 **state**, **action**, **reward** 和 **next state**。

- **Reward Hypothesis**: Agent 的目标是最大化累积奖励，即 **expected return**。
- **Markov Decision Process (MDP)**：Agent **只需要当前的状态**来决定采取什么行动，而不需要考虑之前所有状态和行动的历史
- **Observations/States Space**：这是 Agent 从环境中获取的信息。在视频游戏中，可以是一帧图片。
    - State s: 对世界状态的完整描述。比如象棋游戏中我们可以获得整个棋盘信息。
    - Observation o: 是状态的部分描述。比如超级玛丽中，我们只能看到玩家附近的地图。
- **Action Space**：环境中所有可能的 actions 的集合
    - Discrete space: 可能的 actions 的数量有限。比如超级玛丽中，actions 只有 ↑↓←→
    - Continuous space: 可能的 actions 的数量无限。比如自动驾驶
- **Reward & discounting**：奖励在 RL 中至关重要，它是 Agent 的卫衣反馈，通过奖励可以知道采取的行动是好是坏。
    $$
    R(\tau) = r_{t+1} + r_{t+2} + r_{t+3} + r_{t+4} + ...
            = \sum_{k=0}^\infty r_{r+k+1}
    $$

    但我们通常不会这样直接加和。较早出现的奖励比远期的奖励更有可能发生、更可预测。于是我们定义了 discount（用 $\gamma$ 表示），该值在 0 到 1 之间（大部分时候是0.95 到 0.99）.
    $$
    R(\tau) = r_{t+1} + \gamma r_{t+2} + \gamma ^{2}r_{t+3} + \gamma ^{3}r_{t+4} + ...
            = \sum_{k=0}^\infty \gamma ^{k}r_{r+k+1}
    $$

## 2. 任务类型

#### 类型 1：episodic task

在这种情况下，有初始状态和终止状态。即创建了一个"episode"：一个包含了 States、Actions、Rewards 和 new States 的序列。

#### 类型 2：continuing task

即没有终止状态的情况。Agent 必须学会如何选择最佳的 actions 并同时与环境互动。

## 3. The Exploration/Exploitation trade-off

- Exploration: 通过随机 actions 来探索环境，以获取更多关于环境的信息。
- Exploitation: 利用已知信息最大化奖励。

强化学习中 Agent 的目标是最大化 expected cumulative reward。然而，我们可能会陷入一个常见的陷阱中。

这个陷阱是探索与利用之间的权衡问题。如果智能体过于探索，它可能会错失机会，浪费时间并且无法获得足够的奖励。如果它过于利用，它可能会错过更好的策略，并且无法达到最佳性能。因此，强化学习算法需要智能地决定何时以探索为主，何时以利用为主，以便在学习过程中不断改进其策略。

## 4. RL 问题的两种主要方法

- **The policy $\pi$**: $\pi$ 相当于 Agent 的大脑，它是一个函数，会告诉 Agent 根据现在的 State 应该采取哪种 action，即它确定了某一时刻下 Agent 的行为。

    $$
    State \rightarrow \pi (State) \rightarrow Action
    $$

    policy 是我们要学的函数，我们的目标就是找到最佳的 policy $\pi ^ {*}$，即当 agent 按照它的计算会得到最大的 expected return。

    训练得到 $\pi ^ {*}$ 的方法：
    - Policy-Based（直接）：给定当前的状态，直接告诉 agent 采取哪个 action
    - Value-Based（间接）：让 agent 学哪种 State 更有价值，然后选择能达到更有价值的 states 的 action



#### 方法 1：策略方法（Policy-Based）

核心思想是直接学习一个策略函数（policy function）。策略函数定义了在每个状态下应该采取的最佳行动，或者它可以定义一个在该状态下可能行动的概率分布。

- Deterministic: 对于给定 state 总是返回同一个 action
    $$
    a = \pi (s)
    $$
- Stochastic: 会输出一个关于可能行动的概率分布。在相同的状态下，随机性策略可以选择不同的行动，具有一定的随机性。
    $$
    \pi (a|s) = P[A|s]
    $$

#### 方法 2：Value-Based 方法

不直接学策略函数，而是学一个值函数（value function）。这个值函数将状态（State）映射到在该状态下的期望价值（Expected Value）。这里的价值是指在给定状态下，如果 Agent 按照我们的策略行动，它可以获得的期望折扣回报（Expected Discounted Return）。

$$
v_\pi(s) = E_\pi[R_{t+1} + \gamma R_{t+2} + \gamma ^{2}R_{t+3} + \gamma ^{3}R_{t+4} + ...| S_t=s]
$$

具体来说，价值函数用于衡量在不同状态下的优劣，这有助于代理决定在哪个状态采取行动，以获得最大的长期回报。这种方法的核心思想是：代理通过学习状态的价值来评估每个状态的好坏，然后根据这些值来决定在哪个状态采取行动，即选择具有最高价值的状态作为下一步的目标。


