# Learning of Connectivity for Odor Navigation Tasks

{section}
{section}
Chemotaxis is an important task for organisms.
Ranging from seeking food to finding potential mating partners, many organisms depend on chemotaxis to choose where to locomote.
There is a wide variety of strategies to perform chemotaxis, depending on the organism.
Bacteria are known to establish several strategies.
~
One such strategy bacteria employ is the run-and-tumble model.
~
Other organisms, such as fruit fly, perform saccades into turbulent plumes.
~
The salience of the modalities of chemical cues is not obvious.
For example, in certain insects the absolute levels of a certain pheromone is insignificant in chemotaxis, and the insect is only sensitive to the frequency of wafts of the pheromone.
~
In this chapter, I will demonstrate some work regarding modalities of olfactory cues for odor navigation tasks.
Odor navigation will be formulated as a reinforcement learning task.
Organisms will be modelled as agents in a digital environment, receiving what would be different modalities of olfactory cues.

## Formulation of Odor Navigation Task

Odor navigation described in this chapter is a form of chemotaxis that is performed by organisms on volatile chemicals.
The navigation aspect can encompass many behaviors, such as running away from predators or seeking mates.
Chemotaxis is a behavior widely studied in microorganisms.
The media of microorganisms is often liquid, which usually have different mechanics than gaseous media.
Aerodynamic dispersion of odorant concentration is dominated by different effects on different scales.
In this work, odor navigation is taken to be the strategy that aims to navigate towards an odorant source while using only local samples of odorant concentration.

### Emergent Behavior

Almost all terrestrial organisms exhibit certain strategies to locate source of olfactory cues.
Various strategies are employed by different organisms depending on the mechanics of relevant cues.
For example; it is known that different insects employ vastly different navigational strategies to locate pheromone sources, depending on their habitat.
When using pheromone traps to count insects, for example, the numbers of caught insects do not reflect the know population sizes.
If traps do not accurately emulate the odor dispersion dynamics of what the insects are attuned to detect, the efficiency of the traps are affected.
While various strategies of individual species are widely studied, how do certain environmental factors relate to optimal strategies is not widely studied.

### Reinforcement Learning

Reinforcement learning (RL) is a computational paradigm that where an environment-reward mechanism dictates the strategy chosen to interact with the environment.
~.
A detailed explanation of the RL environment and the learning methods used can be found in .
RL has been used to model complex navigation tasks performed by animals, and tested to work in real life situations.
~.
For odor navigation; this work uses the Q-value formulation to learn optimal policies under different conditions.
The goal for the next chapters is to build models of systems representative of odor navigation tasks,
and identify features that are useful for biological networks to compute.

### Agent and Environment

For simulating an agent navigating an odor plume, a model of the agent and environment is required.
In the case of anima navigating an odor landscape; the environment consist of two interacting parts.
The main target stimuli are the odorant concentration within the aerial media, which is a scalar field over the environment.
The odorant has two modes of dispersion; through diffusion by molecular random walk and through advection by the movement of the air.
The hydrodynamic quantities of the medium dictates how the diffusion fully takes spaces, so hydrodynamic quantities are also required.
The model of the environment can either include the fluid velocity field directly, or can interpret the velocity field from scalar fields, such as density, pressure and temperature where applicable.
In the models, only fluid velocity field is taken as the hydrodynamic quantity of interest.
The model of the agent constitutes several components.
The agent has access to a limited state space, which corresponds to information on potential sensory inputs.
For an animal like agent, this information would only be local to its position.
The local information available to the agent would be concentration of odorant and air velocity, both sampled at the agent's physical location in the environment.
This indicates that the agent cannot access the full span of the environment.
Non-local input can be in the forms of visual and auditory cues that are transmitted across the environment in time scales that makes them considerable as non-local information for animals, these inputs are not considered in modelling odor navigation.
While there is great evidence that navigation is multisensory, i.e. moths use sensory cues after coming close to pheromone sources to pinpoint mate locations,~ we are interested in only odorant sensory modality.
Considering the agent can also have memory, the past action (or actions) taken and the differentials of the sensory quantities across time steps can be integrated into the state of the agent.
The agent would have a policy to select actions at every time step.
The policy can be any algorithm that produces deterministic or stochastic action selection.
Finally, the agent needs a reward mechanism in place.
For the rewards; reward scheme based on task completion and current state can be designed.

## Navigating a simple odor distribution using Reinforcement Learning

Depending on the geometry of the navigation task, the seeking algorithm may be simple, or may need to compromise more complex strategies dependent on more complex stimuli.
For example, we will consider the goal of navigating to a large target in laminar flow conditions.
The target size being large (compared to the size of the agent) will cause the odorant to come not from a point source, but from the boundary.
Considering the asymptotic limit; the odorant will be released along a region in space across a linear boundary.
We will also consider the simplest laminar flow condition; constant velocity across the landscape with the wind perpendicular to the odorant boundary.
<EQN HERE>
Application of the advection-diffusion equation for a scalar field $$ () will describe the odor landscape in this scenario.
($D$ is the rate of diffusion, and $R$ is the source-sink terms.)
Under this condition; the system is completely symmetric in the tangent direction of the odorant boundary, and the system dynamics can be described along one dimension.
Choosing the direction that is perpendicular to be the x-axis of the system, the continuity equation of the odor becomes;
<EQN HERE>
In , the assumption are that the odor landscape has reached a steady state ($_t  = 0$) and diffusion is negligible ($D=0$).
In the absence of any sources or sinks, $$ is a constant field.
We can consider the settling rate of odor particles; gravity bringing the particles down and fixing them, acting as a sink term.
While we ignore diffusion in the 2D landscape; diffusion will also leak odorants to the vertical dimension, removing them from the 2D landscape.
We can model these effects as a simple linear sink term $R=-$;
<EQN HERE>
In , $u$ is the wind direction, $r$ the position vector of the agent with respect to a point along the source boundary and $$ a constant decay rate.
is an example of such a plume, where the target boundary is the top (north) edge of a square landscape.

### Navigating to source using a lookup table

Odor navigation in this task can be accomplished by a single rule; move upwind.
Since due to symmetry, $u$ and $$ are always directed at opposite directions.
Thus moving in the direction $-u$ is the same as moving up the gradient of $$.
The optimal policy would result in a strategy that moves upwind.
To test that such a strategy is attainable using RL; a lookup table can be used as the Q-value approximation algorithm.

For the case of our simple odor landscape, the target boundary can be reached by a single rule; move upwind.
The odor is distributed by an unchanging fluid flow; thus going upstream of the fluid flow will always result in increased concentration.
In this case; the only info needed for this regime is the wind direction.
The wind direction contains the same information as the direction in which the concentration increases.
Thus, one minimal state-space for successful navigation in our toy case consists of the wind direction.
Since the states of a lookup table have to be discrete, the wind direction needs to be quantized.
For the following case; the wind direction is binned to the 4 cardinal directions.

In the simulated environment, the agent is able to develop the strategy of going upwind using a lookup table.
One full training trial consists of the agent being placed in a random location in one of the four possible scenarios.
Each scenario corresponding to one edge of the landscape being the odor source, and the wind is directed perpendicular and towards the center.
(The scenario in is the north scenario; since the $y=50$ target boundary corresponds to the north edge.
There are 3 other scenarios that are successive $90^{}$ rotations of this one.)
The agent chooses an according to its' lookup table, with a random action being selected instead with probability $$ to encourage off-policy learning.
After choosing the action, the agent is moved to a new location, and this repeats until trial termination.
Termination can be due to reaching the target, hitting a non-target boundary and timing out.
The agent receives a reward for the time-step where it reaches a target or a negative reward if it hits a non-target boundary.
(There is no punishment for timing out.)
Upon termination of the trial, the weights of the lookup table is updated using the Bellman equation.
The agent is set on another trial, with randomly chosen start position and scenario again.
The results of learning are displayed in , and the hyperparameters used is given in .
While the lookup table is sufficient to converge to an algorithm that successfully navigates to the source, it is unable to capture the dynamics of the state-value function.
The state space of wind direction cannot distinguish between being close or far to the target, which the Q-value depends on.
To demonstrate, in the case of a successful navigation that heads straight to the target boundary, the only reward received by the agent is at the last time step $t_{f}$.
<EQN HERE>
(The magnitude for end reward is an arbitrary choice, and this form is chosen for convenience.)
The Q-value along a successful trajectory is time-step dependent.
For the simple navigation task, the explicit dependence is given by .
The Q-function along a successful trajectory is calculated in , which agrees with the exponential function form.
<EQN HERE>

The choice of reward resulting from success or failure is a simple rewarding scheme, and is sufficient to learn a table that employs the correct strategy of navigation.
However, it is not the only reward scheme that can be employed.
shows how the agent performs over time in the navigation task.
The various rewards schemes are given in

### Navigating to source using neural networks

To expend on the algorithm; instead of using a reward table on discretized state space, a functional approximation of the Q-function can be made.
A natural choice is a neural network algorithm; mirroring organization from biological networks.
In , the results for using a feed-forward neural network as the Q-value approximation is shown.
The network used is a single hidden-layer network.
The input layer is size 3; receiving the wind velocity (2) and odorant concentration (1) at the agents' location.
The odorant concentration being included as an input serves the purpose to feed information regarding the distance from the target.
While the simple strategy of going upstream to reach the reward does not depend on distance from the target; the network does not do any strategy itself.
Rather, it fits a non-linear function to approximate the Q-value among different paths.
Depending on the reward scheme, the actual Q-value will be different for states of different distance to the target; as can be seen in and .
While for a lookup-table, this is not an issue during learning.
The learning update using Bellman equation is linear; and the correct strategy is emulated as long as the time average of total value update to the correct action is higher than the erroneous actions, which is the case.
However, with a neural network, the back-propagation signal updates the weights of the network in a non-linear fashion.
Although not shown, empirically it makes networks substantially harder to learn successful navigation even in the simple task of just choosing the upwind target.
The output layer is of size 5, and interpreted as the Q-value estimate of the current state and each possible action.
The hyperparameters () are kept similar to the lookup table.
The network receives three inputs; the x and y component of the local wind and the concentration of odorant at the grid position.
The network output is directly interpreted as the Q-value estimates, and the agent chooses the action that corresponds to the highest output value of the network.
shows the comparison of the actual Q-value of the agent and what the neural network predicts.
The overall trend of the Q-value provided from the network matches the actual Q-value better than a lookup table as shown in .
An improvement to the feed-forward neural network algorithm in terms of making the model more realistic is to include recurrence into the network.
This is achieved by adding connection weights from the output of the hidden layer to the input of the hidden layer at the next time step.
This establishes information flow through the network between time steps, and is a way to introduce memory to the neural network, as the network can remember the activations from the previous time steps to make calculations.
The same network structure from is used; with the addition of recurrent weight matrices.
The algorithm employed to train the weights is back-propagation through time (BPTT).
The results of success can be seen in ; where it trains to do the task.
It takes much longer (in trial number) to learn to succeed in navigation, however this is mostly attributed to recurrent network output stabilizing over longer time.

## Navigating with a simple plume

The gradient across a single direction is a simple case where the correct navigation strategy requires minimal information.
However, real world cases are usually not as simple; odorants can disperse from sources with structure that cannot be neglected.
An improvement over the previous attempt would be to get an agent to navigate a plume generated from a point source.
Such an odor landscape is generated with similar wind regime described in , but the odorant source is now a circular region in space, rather than one of the boundaries of the landscape.
can be used to solve this boundary condition.
(The condition where a small region of space has constant concentration; $_{source}=1$.)
is an example of this case of simple odor plume.

The lookup table described in , when trained on this task, has a high failure rate; as demonstrated in .
The reason can be attributed to the strategy failing in this instance.
Go-upwind strategy only succeeds if the agent started from the plume in the first place; which accounts for the non-zero success rate.
Without the equivalence of the wind direction and the odor gradient, the lookup table does not have the information needed to navigate.
The state space can be modified to suit the table for the navigation task.
For correct navigation in this case; the agent needs to be able to infer the gradient of the odor concentration.
However; since the agent can only sample the odor concentration locally; it needs to sample through space.
While various ways of doing this is possible; a minimalist state space consists of the action at a previous time step, and whether that action increased the odor concentration that the agent sampled.
The result of such simulation, using the same hyperparameters as , can be seen in .
It can be seen in that the Q-table of develops the following rules;

If previous action was to go north and caused the odor concentration to increase, keep going.
If odor concentration decreased instead, try to go west (left).
If going left increased odor concentration, go north. If it decreased odor concentration, go right (east.)
If previous action was to go right, and it increased concentration; keep doing so until concentration decreases.
If previous action was to go right, and it decreased concentration; go up.

However, with a table with short term memory, there are still failure modes as this strategy fails to meander into the plume if the agent is out of the plume.
Further memory can always be added to the state space, but with each included time-step the weights of the system increase exponentially and the problem quickly becomes difficult to compute, and inefficient.

Using a feed-forward neural network has the same limitation as the reward table; that the memory needs to be included explicitly for the agent to determine whether it's at the center of the plume, or at one of the sides.
However, to include past history of actions in the state space, the lookup table approach requires exponential number of learned parameters whereas a FFNN only scales in such weights linearly.
(Assuming the subsequent layer sizes are kept the same.)
We have the same limitation that the information of the past is constrained to the number of steps included in the architecture.
An improvement over this is to employ a recurrent neural network as the Q-value estimator algorithm.
We accomplish this by using the same network described in , and include recurrent connection between subsequent time-steps of the hidden layer.
This causes input to hidden layer to expand to receive information from all the past hidden layer activations.
<EQN HERE>
The difference between this network is that instead of back-propagation to update weights, back-propagation through time (BPTT) is employed, and new weight $W_{h  h}$ are included in the system.
This is a flat weight increase of the system, and dynamically includes all previous time steps as inputs to the system by promoting the hidden layer to an internally calculated state.
The results of training the recurrent network on the basic plume is given in .
The reward schemes are the same as with an added idle punishment term.
Idle punishment is a constant small negative reward (in these simulations, $r_{-} = -0.3$) to encourage the agent to move, and this speeds up learning in recurrent networks from empirical experimentation.
With the more complicated algorithm, the navigation becomes less streamlined and more abstract (as can be seen in ) but the agent learns to generalize for the rule of going in the direction of the odor gradient, and to seek the plume if it is outside any gradient region.
It can be seen that among several paths, the agent moves through the landscape until the odor starts to decrease along that path, and the agent then reverses and moves in a different direction.
While this behavior can be seen in the lookup table as well, () this agent is only operating on a memory of internal state, rather than the state being constructed to be able to operate on pre-calculated gradients.
This meandering behavior is similar to how insects navigate to odor plumes in real settings.
Since the time window for inferring the strategy is over multiple time steps, the main improvement in learning how to navigate to target comes from reward schemes with intermediate rewards.
It can be seen from both the evolution in success rates () and the success map () that learning navigation becomes easier and more generalizable when the end reward of reaching the stimulus is coupled along with the stimulus being rewarding as well.
This suggest that stimulus being rewarding itself (pleasantness of the odor itself) is an important factor in navigation; as the longer timescale strategy is more viable to learn if the reward comes from both the odorant and from the value extractable upon reaching a target mate or food source.
The recurrent network is also sufficient in approximating the q-function well, as can be seen in .

## Navigating complex plumes

The plume description in the previous section is very regular, and lacks chaotic structures associated with real world situations.
To test the agent on more real-world like data, can be applied on a windscape with high variance.
One example of such a wind and odor landscape is shown in .
To demonstrate that complex navigation is possible, the agent is trained using only one reward scheme; the concentration as reward along with end reward for successfully navigating to the target.
The same hyperparameters described in are used for the neural network, but the training layout is different.
20 plumes were pre-generated and the agent is trained randomly on one of them at each navigation trial.
The results of the simulation is shown in .

## Conclusion

Various modalities of a sensory navigation task has been modelled using reinforcement learning methods.
While there is no claim that this is how sensory navigation works, it demonstrates that neural networks are capable of performing simple and complex tasks of navigating in an environment where only olfactory cues are present.
This also demonstrates that networks are capable of learning and generalizing various odor dispersion methods.
An important point that has been demonstrated is the importance of reward schemes when it comes to learning and performing the task.
Agents have shown to evolve to succeed navigating various environments faster with varying reward schemes.
Most prominently, flat gradient navigation is faster to learn with a reward scheme that depends on the gradient of the stimulus, whereas more complicated structures are better learned with a reward scheme based on the absolute concentration.
In most cases; success being rewarding does not seem to have as strong an effect as the intermediate reward scheme.
This result does not suggest whether animals on different scales are sensitive to absolute odorant concentration, or the change in concentration, but shows that pleasantness of the odorants are an important sensory modality.
Which collaborates with existing research, pleasantness is often the most identifiable characteristic across human smell classification tasks.
The simulations presented in this chapter also support this finding, but offers this conclusion from a mechanical perspective.
