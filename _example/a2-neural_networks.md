# Neural Networks
This section is a review of artificial neural networks (ANN) and technical details as it relates to this work.
## Feed-forward Neural Networks
A feed-forward neural network (FFNN) is a parametric function that transforms vectors $i  o$ non-linearly in an organized fashion.
The inspiration for the organization is introduced in .
For a number $N$ of hidden layers $h^i$, FFNN is the repeated linear transformation coupled with a non-linear activation functions.
<EQN HERE>
(Einstein notation of implied summation over repeated indices when they appear only on one side of equalities is used throughout this section when applicable.)
The set of parameters of this function, $( ^i, ^i )$ are called weights, $$ sometimes also referred to as bias.
This structure defines a computational graph that transforms inputs sequentially into the activation of the hidden layers $h^i$, and then to the output $o$.
## Terminology
A list of terms, symbols used to denote them, and explanation is as follows.
{}{ l | X }
\\
 Notation   &  Definition \\

 Notation   &  Definition \\


$N$                 & Number of hidden layers                               \\
$i$           & Input vector to neural network                        \\
${h}^n$ & Input vector to the n'th hidden layer                 \\
$h^n$         & Vector of activation of the n'th hidden layer         \\
$f^n$               & Activation function for the n'th hidden layer         \\
$f'^{n}$            & Derivative of activation function                     \\
$^n$          & Weight matrix used to calculate the n'th hidden layer \\
$^n$     & Bias vector used to calculate the n'th hidden layer   \\
${o}$   & Vector of the input to the output layer               \\
$o$           & Vector of activation of the output layer              \\
$f^{N+1}$           & Activation function for the output layer              \\
$^{N+1}$      & Weight matrix used to calculate the output layer      \\
$^{N+1}$ & Bias vector used to calculate the output layer        \\
$F$                 & The neural network (function from input to output)    \\
$X$                 & Set of input vectors                                  \\
$Y$                 & Set of desired outputs of the input vectors           \\
$x^a$         & a'th input vector belonging to $X$                    \\
$y^a$         & Desired output vector of $x^a$                  \\
$h^{a,n}$     & Activation vector of the n'th hidden layer when the input is $x^a$ \\
$C$        & Cost function of network, $X$ and $Y$                 \\
$o$    & Gradient of cost wrt. input to output                 \\
$h^n$  & Gradient of cost wrt. input to n'th hidden layer      \\
$i$    & Gradient of cost wrt. input vector                    \\
$^n$   & Gradient of cost wrt. n'th weight matrix              \\
$^n$    & Gradient of cost wrt. n'th bias vector

## Backpropagation
The input-output relation of the FFNN is dependent on the network weights.
A choice of weights that gives a desired input-output pairing is usually of interest.
A set of inputs $X = \{ x \}$ and matching outputs $Y = \{ y \}$ is denoted as the binary relation $( x^a, y^a )$.
A cost function $C$ is a function of the output of the neural network on the set of inputs $F(x^a) = o^a$ and $y^a$.
The cost function should satisfy a few conditions.
It must be separable, meaning that $C = _a C_a$ and $C_a$ is the cost function on $F(x^a)$ and $y^a$.
And the cost function must have a global minimum when $F(x^a) == y^a  a$.
If the minimum of $C( F(X), Y)$ occurs when $F(x^a = y^a$, then minimizing the cost function with respect to the weights of the neural network would result in a set of weights that most accurately approximates the desired input-output relation.
If the activation functions $f^n$ are differentiable, the partial gradient of $C$ with respect to layer inputs can be calculated via traversing the computational graph backwards.
Here, the indices $i$ refer to the hidden layer number, greek indices $(,,...)$ refer to the indices of the vectors, and latin indices $(a,b,...)$ refer to the index of the input output pairs.
<EQN HERE>
Due to the computational graph, the partial derivate of the cost function with respect to the input to one hidden layer ${h}^i$ depends on the partial derivative of the above layer.
For layers with activation functions acting element-wise, ($h^n_ = f^n(h^n_)$) the expression for $h^{i,a}_$ simplifies;
<EQN HERE>
By traversing the computational graph in the reverse order, all the layer gradients $h$ can be calculated.
To compute the gradient of the cost function with respect to the matrix weights, we use partial differentiation.
<EQN HERE>
Likewise for the biases, the gradients are.
<EQN HERE>
For $n=1$ and $n=N+1$, we use the input and output respectively when needed.
<EQN HERE>
Backpropagation algorithm allows the calculation of the gradient of the cost with respect to the parameters of the neural network.
Reducing the cost function can be done iteratively by using gradient descent methods, which allows the network to learn the weights that best approximates the function with the input output relationship ascribed in $(X, Y)$.
Backpropagation is the computational algorithm used to calculate the weight gradients in a FFNN, but does not concern to how exactly the weights are updated.
To fit the FFNN function to the annotated dataset $(X, Y)$, the gradients can be used to update values of the weights to reduce the cost function.
This is the goal of supervised learning; given a labelled dataset (like $X$ with annotated $Y$) finding the function that calculates a good estimate of $Y$.
These methods are a combination of iterative weight update rules derived from the weight gradients, and manipulating the dataset used to do each iteration.
Many algorithms exist, but an overview of all the methods are out of scope for this text.
The following sections outline and explain the methods used in this work to perform the supervised learning tasks.
## Gradient Descent
Gradient descent is the simplest algorithm for iterative weight updates.
The formulation comes from the definition of gradient.
The value of a differentiable function $f$ at a point $x$ increases fastest along the direction of it's gradient $$,
and decreases fastest along the negative direction of it's gradient.
Then if $x$ is not an extrema of the function $f$, for sufficiently small $$; the following expression holds.
<EQN HERE>
Gradient descent comes from the observation that given a dataset $(X, Y)$ the value of the cost function $C$ is a function of the parameters of the functional approximation.
Denoting all the parameters used to approximate the desired function and $$, updating the parameters in the negative direction of the gradient will result in a new functional approximation that reduces the value of $C$.
<EQN HERE>
The index $t$ denotes the iteration number.
Iterating over this algorithm will cause the value of $C$ to move towards a local minimum.
In the case of FFNN, this update rule results in the following weight update rules;
<EQN HERE>
The simple gradient descent can eventually find a local minimum of $C$.
In practice, this might take a long time to converge, or may not converge due to reasons.
Many algorithms to use gradients for weight updates exist, and throughout this work, the Adam algorithm is used.
Adam algorithm is a name derived from Adaptive Moment Estimation, and is built upon two other gradient descent algorithms.
### Momentum
One failure mode of  is when the gradients are small, it takes many iterations to reach towards a local minima.
Gradient may be vanishingly small near an extrema.
A way to mitigate this is to update the weights by an intermediary momentum term $m_t$ instead of the gradient, and allow gradients to update this momentum term.
<EQN HERE>
This formulation allows the update term to not be the gradient itself, but a moving exponential average of the gradient over updates.
This method allows converging to a local minima at a faster pace.
Momentum here is used as a term, borrowing from an analogy of a boulder rolling down a hill.
A rolling boulder does not move just with the speed proportional to the gradient of the height map.
It has built speed after it starts tumbling, and even upon reaching a low level slope it keeps going because of momentum buildup.
Here, $_1  (0,1]$ is a new hyperparameter of the system, like learning rate $$, and referred to in this work as the momentum term.
### Root Mean Square Propagation
Another failure mode of  is when the gradients vary a lot in between iterations.
Usually this happens when iterations are done on different subsets of data.
A way to mitigate this is to modulate each weight update such they are more similar in magnitude.
Root mean square propagation (RMSprop) is a technique where the parameter updates are scaled with a moving exponential average of the magnitudes of past updates.
<EQN HERE>
(All the operations are done element-wise in this formula.)
Here, $_2  (0,1]$ is a new hyperparameter of the system, called the moving average parameter.
In this work, it is also referenced as the inertia term, to parallel the naming of the momentum term.
The $$ term is a hyperparameter to ensure that there is no division by 0; and is usually just a very small number.
### Adam Optimizer
Combining momentum and RMSprop algorithm along with the initial values $m_0 = 0$ and $v_0 = 0$, we get the main steps of the Adam algorithm.
Both $m$ and $v$ start off from 0 and slowly reach their values over iterations, which empirically slowls down learning in the initial iterations.
Adam also proposes a correction of the decay rates with a factor of $1 / (1 - ^{t})$ to bypass this delay in learning.
The update rules to parameters using Adam is as follows.
<EQN HERE>
This algorithm is the one used to do weight updates for all neural networks used in this work.
## Recurrent Neural Networks
FFNN are widely used, but they can only apply on one input at a time.
Certain models of problems involve processing sequence of inputs, and the output may depend on the order of the input sequence, and the length of the sequence may be arbitrary.
To process sequences of inputs, recurrent neural networks (RNNs) can be used.
A RNN is a neural network with delayed recurrent connections.
While there are multiple ways to achieve this structure, only the structure used in this work will be described.
This is achieved by linking the output of the hidden layer to the input of that same layer when the next input in the sequence is processed.
can be modified to describe a RNN that takes a sequence of inputs $i_t$ (where $t$ index stands for the sequence order)
<EQN HERE>
This network is modelled to output at every input in the sequence, but other structures can be modelled.
Activation of the hidden layers not only depend on the activation of the inferior hidden layer on the computational diagram, but also the activation of the same hidden layer on the previous calculation of the sequence.
This links the computations on a discrete time axis; hidden layer activations are dependent not only on the current input, but on the history of all the inputs processed in the network sequence.
### Backpropagation Through Time
The backpropagation algorithm cannot be used as is on RNNs and need to be modified for the new terms in the hidden layer inputs.
For the form of the RNN described, the cost function needs to be a function on the sequences of inputs and outputs.
For a sequence of $T$ inputs, traversing the computational graph top to bottom, then from end to beginning of the sequence, cost gradients can be calculated in the same manner.
While mostly unchanged,  needs to be modified to take account of the new terms.
(The dataset index $a$ is dropped for brevity, but is implied in the case of multiple input-output sequences within the labeled dataset.)
<EQN HERE>
$$ is used to denote element-wise multiplication of vectors; $(a  b)_ = a_ b_$
The formulation for the gradients are mostly unchanged, but now include contributions from each sequence step.
By partial differentiation rules, each sequence step contribution is added to get the full gradient.
<EQN HERE>
## Using ANN for Reinforcement Learning
So far, ANNs are discussed in terms of supervised learning; weight updates to reduce a cost function.
RL tasks don't have an associated cost function, so there is no gradient to backpropagate.
So an appropriate cost function needs to be formulated to optimize RL tasks using ANNs as value function approximations.
In this section, $t$ will be the index used to denote the sequence step of the RL task,
greek letters ($$, $$, etc.) will be used to denote vector indices,
and $n$ as an index will be used to denote ANN gradient descent iteration index.
We limit the discussion to a single hidden layer ANNs, but the formulation here is generalizable to multiple hidden layers.
We will interpret the output of the network as the Q-function estimate.
RL formulation used in this work only uses discrete and finite action sets, therefore we will interpret the components of the vector output of ANN as Q-function estimates for each possible action.
The environment state $s_t$ is used as the input vector $i_t$ to the ANN.
<EQN HERE>
In this work, identity is used as the output activation function.
Since the derivative of the identity function ($f^{N+1}(x) = x$) is trivial, this implies that $o_t$ is immediately equivalent to the gradient of the cost function with respect to the Q-function estimate at the $t$'th RL step.
We note that the cost function is not yet formulated, however if $o_t$ is known, the unknown cost function can still be reduced.
The iterative Bellman equation of  can be rearranged to resemble the simple gradient descent update .
<EQN HERE>
Then for an agent doing an RL task equipped with an ANN to do Q-function estimation, after navigating a sequence of states by taking a sequence of actions; we can define the following output gradient that will correspond to some cost function.
<EQN HERE>
Doing gradient descent using this set of $o_t$ is equivalent to updating the Q-function estimate using the Bellman equation.
Since the gradient term for the $t$'th time step involves network output from the $t+1$'th time step; the empirical form of $C$ is not separable between RL steps, and requires the entire sequence.
<EQN HERE>
However the empirical form is not necessary; only the equivalence of choosing $C$ with the property given in  and RL optimization is required.
For RL tasks using ANN for functional approximation given the paradigm described this section, weight gradient can be calculated using backpropagation (and BPTT) by utilizing .
## Activation functions
If not for the non-linear activation functions $f^n$, the neural network becomes equivalent to a single linear transformation.
Non-linearity of the activation function accounts for the non-linear nature of ANN.
Several commonly used activation functions exist, and several are listed in .
For the neural networks used in this work, hyperbolic tangent is chosen as the activation function for hidden layers.
The output activation function is usually chosen to reflect the task wanted for the functional form.
Since the cost function uses the output layer, the activation function choice usually determines which cost function can be used.
In case of function approximation, the last activation function $f^{N+1}$ can be left as the identity function, in which case a suitable cost function is the L2 norm between network output and the labels in the dataset.
<EQN HERE>
For a different task, such as a classifier where the output clamped between 0 and 1 would be interpreted as classification percentage, different cost function can be used.
For classifiers, a common output activation function is the softmax function.
Softmax function depends on the whole vector, and is the normalized exponential vector.
<EQN HERE>
The softmax function clamps the sum of the output vector components to unity, and every component is positive.
This is useful in interpreting the output components as classification probabilities for each class.
The calculation of $o$ in this formulation necessitates the use of the Jacobian matrix.
<EQN HERE>
In classification, usually the cross-entropy loss is used as the cost function.
This cost function is minimized if the inputs are classified, that is $o^a_ = 1$ for the $$ corresponding to the correct class, and 0 in the other components.
The labels of the dataset, $y^a$, are formulated to be one-hot encoded label vectors.
One-hot vectors are vectors with a single 1 component, and all other components being 0.
The encoded label vectors have 1 on the index that corresponds to the correct class of the $a$'th sample.
The cross entropy loss on this encoding is defined with the following expression.
<EQN HERE>
Using this formulation, and denoting the index that $y^a$ is non-zero as $I^a$, the gradient can be calculated as follows.
<EQN HERE>
For this choice of activation function, and cost function; the output gradient is similar to the L2 norm case.
<EQN HERE>