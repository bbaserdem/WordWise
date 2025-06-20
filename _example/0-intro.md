# Role of connectivity on the macroscopic behavior of neural networks
The brain is one of the most complicated systems ever observed.
Ever since it is established that the brain is responsible for thoughts and behaviors, it has been a major interest for many fields of science.
Adopting a Physics perspective, the brain is a large collection of interacting atoms, which are the cells that make up the brain.
The electrical activity of motor neurons, along with average of activity of the brain and level of signaling chemicals released can be taken to be the macroscopic state of the brain.
The macro state follows from what we can measure about the functions of the brain.
The brain controls motor function and level of certain chemicals in the body.
We can measure brain activity by measuring the potential difference across various points of the scalp; Electroencephalography (EEG).
(The single neuron electrical activity can also be measured, but this can be considered microscopic behavior.)
Such a description would be followed by the application of Statistical Mechanics (SM) to predict the behavior of the brain.
However, unlike other macroscopic systems of interacting particles, SM has shown to be insufficient to predict the macrostate behavior of the brain.
There is a diversity of the scale of connections between the neurons, small and large scale connectivity exist simultaneously, creating both local and non-local interactions.~
The connections between the neurons are inhomogeneous and anisotropic, and the current consensus is that this asymmetry is what leads to the macroscopic behavior of the brain.
Only one species' connectome has been fully mapped.
The full connectome is only available for the nematode Caenorhabditis elegans.~ (C elegans)
Two samples, a male and a hermaphrodite, have been mapped: consisting of approximately 350~neurons and 5000~connections.
Recently there has been published work in mapping the connectome of Drosophila melanogaster, the fruit fly.~
In this study, a large and densely populated section of the half hemibrain, which consists of $25K$~neurons and $20M$~synapses, have been mapped.
Drosophila is estimated to have $135,000$~neurons across it's brain in total.~.
In comparison, the human brain is estimated to have around $10^{8}$~neurons, and each neuron synapses on average with 7000 cells, which makes collecting connectivity information of each neuron a monumental task.
Current research is ongoing with regards to understanding the full functionality of the nervous system and how the connectome generates the behavior.~
## Neuronal Function
The computational unit of the brain is the neuron.
The neuron is a highly specialized cell that is structured around receiving and broadcasting electro-chemical signals.
The physiology of the neuron is specialized around its function and can be roughly divided into four parts.
Dendrites are branching structures that collect input to the neuron, mostly from other neurons.
The soma is the central structure of the neuron and can be considered as where the input signal is consolidated.
Axons are structures that transmit electrical signals from the soma to other neurons.
While small in size compared to other constituents, synapses are specialized interfaces of neural connections.
The electro chemical signal transmitted by axons are transmitted by synapses.
Synapses consist of structures of both the presynaptic and the postsynaptic neuron.
The presynaptic neuron' axon terminal is named a bouton.
The gap between is named the synaptic cleft.
The interface of the synapse and the postsynaptic neuron is called the dendritic spine.
While exceptions exist, synapses in general transmit signals coming from an upstream neuron's axon to the downstream neuron's dendrite.
In this sense, synapses are the connections between the neurons and constitute the connectome of neuron-to-neuron interactions.
The signals of neurons are voltage differences across the cell membrane (between the extracellular matrix and the neuron's cytoplasm) maintained through ion gradients.
Neurons actively maintain ion gradients; mostly sodium ($Na^{+}$), potassium ($K^{+}$), calcium ($Ca^{2+}$) and chloride ($Ca^{-}$); to maintain this potential gradient.
Under resting state; neurons usually are kept at around$-70 mV$ (with respect to the extracellular potential, taken to be $0 mV$.)
There are ion channels on neurons that selectively allow ions to flow from or to the cell, making the membrane potential more negative (hyperpolarization) or more positive (depolarization).
If a neuron is sufficiently depolarized, the depolarization is maintained and transmitted through the cell towards the axons.
This transmission of signal is called an action potential (AP) and is a fluctuation of around $100 mV$ from the cell membrane.
While subthreshold fluctuations' amplitudes decay along the axonal axis, APs are maintained through an axon and propagate without decay.
When AP reaches the synapse, the voltage difference leads to release of neurotransmitters on the presynaptic side, which bind to postsynaptic side and causes either depolarization (excitory) or hyperpolarization (inhibitory) on the postsynaptic neuron.
## Measuring Neurons
Neurons constantly replenish and break down this chemical gradient to be able to generate APs.
The depolarization and the recovery of the chemical gradient takes a few milliseconds.
During this period, named absolute refractory period; sending of further APs is not possible.
It is harder to generate a new action potential after the absolute refractory period.
This timescale, on the order of 10 ms, is called the relative refractory period.
The timescales involved with depolarization and re-establishment of the gradients lead to the visualization of action potentials as spikes.
Since the activity of neurons consist of potential differences, this activity can be measured by probing the neurons and the intracellular matrix.
Neuronal activity recordings using electrical probes indeed display this behavior.
Such recording of activity over a time scale is referred to as spike train recordings.
These recordings can be taken in vivo (while subject is alive) to correlate behavior and neuronal activity.
In a neuronal network, the spikes are transmitted through different neurons by connections.
Therefore, the activity of neurons are dependent on the activity of the others through the connectome.
(Except neurons that are the first producer of signals, such as sensory neurons whose activity is dependent not only on other connected neurons, but also on the receptor activity due to various stimuli.)
## Measuring Connectome
Measuring of connectivity of neural tissue has its challenges.
Advances have been made in the ease of doing single cell tracing, such as Brainbow where each neuron is genetically edited to express randomly certain fluorescent proteins, coloring each neuron differently so that the images can be easily segmented.~
Connectome measuring in neural tissue on single cell level resolution necessitates not only cell tracing, but also detection of synapses, which is a structure vastly smaller than it's surroundings.
The synaptic structures are roughly of the size of $1 m$.
Comparably, the average axon and dendrite length per cortical neuron is around $40 mm$ and $4 mm$ respectively.
Imaging of the neurons and finding points of sufficiently close contact (on the order of $m$) is not sufficient as the highly branching nature of dendrites and axons cause many points of close contact without synapses.
High resolution methods are necessary to image such structures.
### Electron Microscopy
One of the high-resolution imaging techniques that can resolve $m$ scale details is electron microscopy (EM).
While methodology differs; the EM methods image thin slices.
Each slice is imaged using EM, and the resulting images are stacked to produce 3D images.
For connectome detection, the stack of images obtained need to be segmented into individual neurons and synapses need to be detected.
Various methods to compliment EM imaging exist in segmentation and synapse detection.
In the Drosophila connectome project, heavy metal staining are used to enhance contrast of cell membranes so that automated methods can segment and identify synapses with greater precision.~
### Sequencing
While imaging is powerful, it has many caveats.
EM imaging captures a lot of detail, and with that the data gathered is quite large.
Such large amount of information necessitates automation to sift through them.
While C elegans has been mapped without using automated techniques, it took a lot of manual tracing, effort and time to map out a network of 350 neurons.
One of the advances in technology in Genomics have been the speed up and increased availability of sequencing techniques.
Utilizing this technology, various techniques have been developed.~
## Modelling Neurons
Extracting information from neural tissue about the connectome is vital into our understanding of how the brain processes information.
Modelling the dynamics of neurons is of special interest.
### Dynamical Properties of Neurons
Neurons propagate voltage spikes and transmit this information to other neurons.
The time dependence of neuron output can be represented, on time scales where the internal dynamics of the individual spikes may be ignored, by a sum over Dirac $$ functions.
<EQN HERE>
($N$ being the total number of spikes transmitted and $ρ(t)$ is the neural response function.)
The spike trains are not identical when running the same trial.
In this case, trial-averaged neural response function ($<ρ(t)>$), would be considered.
In vivo, this would be the average over the repeats of the same trial.
Often it is more convenient to talk about the firing rate, which is the binned version of the neural response function.
<EQN HERE>
This is one way of estimating firing rate from the spike train data, which retains the discontinuous nature of the spikes.
In the above approximation, $r(t)$ is the moving average of spikes using rectangular windows.
To generalize this procedure, the firing rate is approximated with the filter kernel $K(t, )$ as following.
<EQN HERE>
becomes the case where the kernel is a simple rectangular window from $0$ to $t$ and height $1/ t$.
Depending on the kernel; firing rate of a neuron can be approximated either smoothly or more like the raw spike train.
### Firing Rate Network Model
A simple model of a neuronal network is when the firing rate of neurons are taken as sufficient to explain the network dynamics.
In this model, the output of neurons can be considered to be continuous.
This simplifies the system and allows to model the network as a system of coupled differential equations.
Each neuron of the network can be modelled as a node in a graph.
The nodes receive inputs, which is the weighted sum of the outputs of upstream nodes.
The inputs $I$, are referred as the synaptic input.
This is the firing rate analog of incoming APs to the dendrites.
The outputs $o$ are transformations of the input, are the firing rate of the neurons corresponding to the nodes.
The output input relationship is given by the connectivity matrix $W$ of the graph, which is the connectome.
The matrix $M_{n,m}$ indicates how strong the synaptic connection is between the postsynaptic neuron $n$ and presynaptic neuron $m$.
(The indices $i,j$ run over the nodes of the graph, or neurons in the model.)
Without considering time mechanics, the synaptic input, is some transformation of the incoming rate of spikes.
<EQN HERE>
And the firing rate is some transformation of the synaptic input.
<EQN HERE>
(The transformation functions are to reflect the inner dynamics of the structures.)
This model, without time, is a system of non-linear equations.
The time dynamics are realized by considering either, or both, of the quantities as slowly varying through time.
For example, if the synaptic input responds to incoming spike rates with different time scale with respect to how firing rates respond to synaptic input, the system becomes a set of the following non-linear differential equations.
<EQN HERE>
These systems can be solved numerically to observe and predict neuronal activity.
## Artificial Neural Networks
Besides the simulation of neuronal networks, connectivity information is important for artificial neural networks (ANNs).
Inspired by the setup of neuronal tissue and how signals propagate through them, ANNs has been a breakthrough in large data processing.
While ANNs are far from analogous with biological neural networks (BNNs), they are much easier to probe.
### Perceptron
Perceptron model is the first step in adapting the mechanics of biological neurons to computer algorithms.
Perceptron can be thought of as a simple computational unit analogous to a single neuron.
The perceptron receives numbers as inputs; $x$.
The inputs are added up with a set of pre-determined weights $w$.
The output of the perceptron is binary, analogous to the fire or not-fire behavior of AP generation in neurons, and is determined by an internal bias parameter $x$.
This property essentially makes the perceptron a binary classifier.
The computation of the perceptron can be summarized as follows.
<EQN HERE>
### Feedforward Neural Network (FFNN)
The output of the perceptron is binary but is a transformation of inputs which are possible not-binary.
If the output of the perceptron is needed to be continuous, such as the values of firing rate can be depending on the approximation scheme in real neurons, the output of the perceptron can be a function that approximates the step function.
Take for instance the logistic sigmoid function.
<EQN HERE>
The function is a sigmoid curve, and approximates the step function, except values close to the origin.
The perceptron with this activation function generates numbers within the interval $(0, 1)$.
A multilayer perceptron model is when there are multiple binary classifiers operating on the same input data in parallel.
The output of each perceptron in this model is given by;
<EQN HERE>
(Einstein notation of summing over repeated indices is used.)
A layer of perceptrons can be made to have continuous outputs, and the output of these perceptrons can be wired to another layer of perceptrons.
Denoting the input to the system as $i$, first layer of perceptrons as $h$, and second layer of perceptrons as $o$, the information processing can be realized as;
<EQN HERE>
The connection weights between $i$ and $h$ is denoted with the matrix $W_1$ and likewise for the weights between $h$ and $o$.
The biases are represented with the suffixed vectors.
This computational graph is referred to as a two-layer feedforward neural network.
There are two sets of nodes process the information from the input sequentially and do a non-linear transformation of the elements.
The final layer is called the output layer ($o$) and is the output of the computational structure.
The central layer $h$ is referred to as a hidden layer, which makes this feedforward neural network a single hidden layer model, hidden due to the fact that the activation of these nodes is not part of the network output.
In general, neural networks are graphs whose nodes are activated through linear transformation of their inputs and application of some non-linearity.
The non-linearity is not confined to be a gate-function approximation and can be different non-linear functions.
The strength of the neural network algorithm is the fact that entire computational graph is differentiable.
The differentiability allows the calculation of gradient with respect to the network weights.
This can be utilized with machine learning methods to do regressions on various data.
Utilizing ANNs is about finding the correct connectome that achieves a desired task.