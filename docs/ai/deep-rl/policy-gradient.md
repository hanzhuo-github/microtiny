---
lang: zh-CN
title: Policy Gradient with PyTorch
description:
article: false
date: 2023-11-14
order: 4
---

之前介绍的 Q-Learning 是 value-based 方法，我们训练 value function 作为确定最优 policy 的中间媒介。这一章将介绍一种 policy-based 方法：policy gradient，然后使用 PyTorch 实现 Monte Carlo Reinforcement (policy gradient 的一种)。

先回顾一下 policy-based methods，我们直接训练 $\pi ^ {*}$，parameterize the policy。

![](/images/ml/drl/stochastic_policy.png =600x)

我们使用 gradient ascent 改变 $\theta$ 以最大化 parameterized policy，目标函数 $J(\theta)$ 是 expected cumulative reward。

![](/images/ml/drl/policy_based.png =600x)

Policy-gradient methods 是 policy-based methods 中的一种。Policy-based method 通过最大化 local approximation of the objective function（hill climbing, simulated annealing, or evolution strategies）来**间接**优化参数 $\theta$。Policy-gradient methods 在 objective function 上使用 gradient ascent 来**直接**优化参数 $\theta$。

## 1. Policy-gradient methods 的优劣

### 1.1 优点

- The simplicity of integration
    不必额外存其他数据（action values），直接 estimate the policy

- Policy-gradient methods can learn a stochastic policy
    可以学随机策略，这是 value function 做不到的

    使用随机策略：
    1. 我们不用手动实现 exploration/exploitation trade-off。因为我们输出的是动作上的概率分布，agent 在探索时会根据概率分布随机选择动作。
    2. 避免了感知别名的问题（perceptual aliasing）。perceptual aliasing 指的是两个或多个 states 看起来相同或者实际上相同，但对于达到最优性能而言，这些状态需要不同的动作相应。

- Policy-gradient methods 在高维 action spaces 和 continuous actions spaces 中更高效。

- Policy-gradient methods have better convergence properties
    value-based 方法中，以 Deep Q-Learning 为例，我们通过最大化 Q 值来更新 value function。那么即使估计的 action values 只有一点点变化（如果这种变化导致其他的动作有更大的 Q value），也会引起 action probabilities 的剧烈变化。

    相比之下，policy-gradient 学习一个概率分布，这个分布决定了在给定状态下采取每个动作的概率。这种方法使得 action preferences（即选择特定动作的概率）随时间平稳变化。

    这种平滑的调整机制为 policy-gradient 提供了更好的手链特性。由于策略的变化不会因为价值估计的小幅度变动而剧烈波动，这使得学习过程更加稳定，降低了在探索最佳策略时出现大的振荡或不稳定的风险。

### 1.2 缺点

- 很多情况下，policy-gradient 方法收敛到 local maximum 而不是 global optimum。
- Policy-gradient 很慢，需要更长时间训练。
- Policy-gradient 有 high variance。

## 2. Policy-gradient 算法

![](/images/ml/drl/policy_based.png =600x)

如何优化权重呢？

方法就是 let the agent interact during an episode. 如果赢了，就认为每个 action 都是应该在后续中被更多地被选择。也就是说，对于每一个 state-action pair，要么增加要么减少 `P(a∣s)`（在状态 s 时采取行动 a 的概率）。

![](/images/ml/drl/pg_bigpicture.jpg =600x)

Stochastic Policy: a probability distribution over actions at that state
$$
\pi_{\theta}(s) = \mathbb{P}[A|s;\theta]
$$

### 2.1 损失函数

损失函数给出了 agent 在给定一个轨迹（trajectory, state action sequence，不考虑奖励（contrary to an episode））下的性能，输出是 expected cumulative reward。
$$
J(\theta) = E_{\tau \sim \pi}[R(\tau)]\\

R(\tau) = r_{t+1} + \gamma r_{t+2} + \gamma ^2 r_{t+3} + \gamma ^3 r_{t+4} + ...
$$

expected return (或称 expected cumulative reward)，每个行动轨迹 $\tau$ 在执行策略 $\pi(\theta)$ 时都有一个出现的概率 $P(\tau ; \theta)$
$$
J(\theta) = \sum_{\gamma}P(\tau ; \theta)[R(\tau)] \\

P(\tau ; \theta) = [ \prod_{t=0}P(s_{t+1}|s_t,a_t)\pi _{\theta}(a_t|s_t) ]
$$

- $P(s_{t+1}|s_t,a_t)$: Environment dynamics (state distribution)
- $\pi _{\theta}(a_t|s_t)$: Probability of taking that action $a_t$ at $s_t$

我们的目标就是找到让 $J()\theta$ 最大的 $\theta$:
$$
\underset{\theta}{max}J(\theta) = \mathbb{E}_{\tau \sim \pi_{\theta}}[R(\tau)]\\
$$

### 2.2 Gradient Ascent，Policy-gradient Theorem

Policy-gradient 是 optimization problem，需要用 gradient-ascent 找到使得 $J(\theta)$ 最大的 $\theta$。

更新步骤是：$\theta \leftarrow \theta + \alpha * \delta _{\theta} J(\theta)$

求导的时候有两方面问题：
- 计算量的问题：
    - 计算 $J(\theta)$ 的梯度需要计算每个可能轨迹的概率，计算量很大
    - 一种解决方式是使用基于样本的梯度估计方法，通过采集一些轨迹样本来估计梯度。这些样本可以用来近似计算梯度，而不需要显式计算所有可能的轨迹。
- 对损失函数进行微分的时候，需要对 state distribution 进行微分，这个叫做 Markov Decision Process dynamics