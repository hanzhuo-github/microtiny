---
lang: zh-CN
title: Q-learning
description:
article: false
date: 2023-10-31
order: 2
---

**Q-learning** 是一种 value-based Reinforcement Learning method。

在 value-based 方法中，我们训练 value function，然后基于自定义的 policy，根据 value function 选择 actions（例如使用贪心策略，总选择能够让 value function 最大的 action）。

有两种 value-based functions:

- state-value function
    $$
    V_\pi (s) = E_\pi [G_t|S_t = s]
    $$
    从该状态开始，Agent 总是按照 policy 行动的 expected return

- action-value function
    $$
    Q_\pi (s,a) = E_\pi [G_t|S_t=s, A_t=a]
    $$
    对于每一个 (state, action) 对，即在该状态下，选择某个 action a，agent 总是按照 policy 行动能够得到的 expected return

不管采用上面的哪种方法（计算一个状态或状态-动作对的价值），都需要考虑 Agent 在该状态下采取各种可能的动作，并计算从每个可能的动作开始后，智能体可能获得的所有奖励的累积。这就要求进行大量的模拟和计算，特别是在状态空间较大且奖励函数复杂的情况下，这一过程会变得计算上昂贵和困难。为了解决这个问题，我们将介绍贝尔曼方程（Bellman equation）。

## 1. Bellman equation

贝尔曼方程是一个递归式，当前状态下的 value 为：**当前的 reward $R_{t+1}$ + 下一状态下的价值 * 折扣因子**。

$$
V_\pi (s) = E_\pi [R_{t+1} + \gamma * V_\pi (S_{t+1})|S_t=s]
$$

## 2. 蒙特卡洛学习和时序差分学习

Monte Carlo 和 Temporal Difference Learning 是训练 value function 或 policy function 的两种策略，它们都是用经验（experience）来解决 RL 问题。

蒙特卡洛学习是基于完整回合（episode）的学习方法，而时序差分学习是一种基于单步 $(S_t, A_t, R_{t+1}, S_{t+1})$ 的学习方法。

### 2.1 Monte Carlo：回合结束后学习

直到回合结束，才会计算 $G_t$（return）。计算得到的回报（$G_t$）被用作目标值（target），以更新当前状态的值函数（V($S_t$)）。

$$
V(S_t) \leftarrow V(S_t) + \alpha[G_t - V(S_t)]
$$

### 2.2 Temporal Difference Learning：每个 step 进行学习

TD 学习不必等到整个回合结束，而是在每次交互（1 step）后得到 $S_{t+1}$ 来形成 TD 目标（TD target），使用当前时间获得的奖励 $R_{t+1}$ 和下一个状态的估值函数 $\gamma * V(S_{t+1})$ 来更新 $V(S_t)$。

由于 TD 学习不需要等待整个回合的结束，它无法计算完整回合的期望回报（$G_t$）。于是我们通过将当前时间步的奖励（$R_{t+1}$）与下一个状态的折扣估值（$γ*V(S_{t+1})$）相结合来计算。这种基于部分样本的估计方式被称为“bootstrapping”，因为 TD 的更新部分依赖于对下一个状态的估计（$V(S_{t+1})$），而不是完整回合的观测数据（$G_t$）。

$$
V(S_t) \leftarrow V(S_t) + \alpha[R_{t+1} + \gamma V(S_{t+1}) - V(S_t)]
$$

- $R_{t+1} + \gamma V(S_{t+1})$ 为 **TD Target**

这种方法叫 **TD(0)** 或者 **one-step TD**


## 3. Q-Learning

Q-Learning 是一种 **off-policy**、**value-based** 方法，它基于 **TD 方法**训练来训练 **action-value function**（称为 **Q-function**）:
- Off-policy: 在 acting (inference) 和 updating (training) 时使用不同的 policy。
    - Epsilon-greedy policy (acting policy)
    - Greedy policy：用于选择最好的 next state-action value 来更新 Q-value 的 updating policy
- Q-Learning 是训练 Q-function 的算法，Q 来自于 Quality。

:::details On-policy
acting 和 updating 用相同的 policy。例如 Sarsa（也是一种 value-based algorithm）的 acting 和 updating 都是用 epsilon-greedy policy。
![](/images/ml/drl/Sarsa.jpeg)

![](/images/ml/drl/off-on.jpg)
:::

:::details 复习：value v.s. reward
- The value of a state, or a state-action pair is the expected cumulative reward our agent gets if it starts at this state (or state-action pair) and then acts accordingly to its policy.
- The reward is the **feedback I get from the environment** after performing an action at a state.
:::

在 Q-Learning 中，Q 函数通常被编码为一个 Q 表（Q-table），这是一个二维表格，其中的每个单元格对应一个状态-动作对（state-action pair）的值。Q 表可以被看作是 Q 函数的内部表示，它充当了 Q 函数的内存或备忘录，用于存储每个状态-动作对的估值。

Q 表的结构如下所示：

- 行表示不同的状态（States）。
- 列表示可以采取的不同动作（Actions）。
- 每个单元格包含了相应状态-动作对的 Q 值，即在特定状态下采取特定动作的预期长期累积奖励值。

当我们训练得到 optimal Q-function 后，我们就有了 optimal policy。即：

$$
\pi^*(s) = arg\mathop{max}\limits_{a} Q^*(s, a)
$$

### 3.1 Q-Learning 算法

![](/images/ml/drl/Q-learning-algorithm.jpg)

:::details Q-learning 算法的步骤
- Step 1: Initialize Q arbitrarily

初始化 Q-table，一般情况下初始化为 0
![](/images/ml/drl/Q-learning-algorithm-1.jpg)

- Step 2: Choose an action using the epsilon-greedy strategy

刚开始将 $\epsilon$ 初始化为 1.0。在 training 前期，主要是 exploration（$\epsilon$ 比较大）。随着训练的进行，Q-table 的质量也来越高，我们逐渐减小 $\epsilon$ 的值。

![](/images/ml/drl/Q-learning-algorithm-2.jpg)

- Step 3: Perform action $A_t$, get reward $R_{t+1}$ and next state $S_{t+1}$

- Step 4: Update $Q(S_t, A_t)$
    $$
    V(S_t) \leftarrow V(S_t) + \alpha[R_{t+1} + \gamma V(S_{t+1}) - V(S_t)]
    $$
    于是 $Q(S_t, A_t)$ 为：
    $$
    Q(S_t, A_t) \leftarrow Q(S_t, A_t) + \alpha[R_{t+1} + \gamma \mathop{max}\limits_{a} Q(S_{t+1, A_t}) - Q(S_t, A_t)]
    $$
    > 注意这里用的不是 epsilon-greedy 策略，这里取最优的。当 Q-value 更新之后，我们从新的 state 开始，再次使用 epsilon-greedy 策略开始循环。这就是为什么我们说 Q-Learning 是 off-policy algorithm 的原因。
:::

:::info 
[这是一个 Q-Learning algorithm 的例子](https://huggingface.co/learn/deep-rl-course/unit2/q-learning-example)
:::