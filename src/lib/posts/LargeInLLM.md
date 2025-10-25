---
title : "Large in Large Language Models" 
thumbnail : "/images/placeholders/IMG-20251002-WA0012.jpg"
date: "2025-09-28"
category : "Neuroscience and AI" 
published : true
tags: ["robot", "ai", "AI", "Calcutta", "India"]
---

<script>
    import PostImage from '$lib/components/blog/PostImage.svelte';
    import imageSrc1 from "$lib/assets/slideshow-images/portrait/IMG-20251002-WA0012.jpg?url";
</script>

<PostImage src={imageSrc1} alt="Large in Large Language Models" />

Imagine you're standing outside a sweet shop in North Kolkata, maybe near College Street, watching a *karigor* (a skilled craftsman) make *mishti doi*. His recipe is in his head. It’s a good recipe, passed down from his grandfather. He knows to add a certain amount of sugar, heat the milk for just so long, and let the pot sit in a warm corner. He makes delicious doi every time.

Now, imagine a different kind of *karigor*. This one isn't a person. It’s a giant, magical recipe book sitting in the middle of a tram depot. This book has a billion tiny instructions, not just ten or twenty. Each instruction is like a tiny knob you can turn: "add 0.001 grams more sugar if the milk comes from a happy cow," or "heat the milk for 0.02 seconds longer if it's a humid monsoon afternoon." This book learned how to set its billion knobs by reading every recipe book in Bengal, every poem ever written about sweets, and every conversation about food ever whispered over a cup of chai.

The "large" in a Large Language Model is like that magical book. It's not just big in size, like a fat dictionary. It's large in the number of tiny, tiny knobs—billions of them—that it can adjust to understand and write things. And it's large because it has learned from a library of information bigger than all the books on College Street put together.

-----

**A Plainer Look at "Large"**

That magical recipe book's "knobs" are what computer scientists call **parameters**. A parameter is simply a number inside the model that it can change as it learns, like the volume knob on a radio. An LLM has billions of these parameters. The "large" in LLM mostly refers to this massive number of parameters.

To learn how to set all those knobs correctly, the model needs to read a mind-boggling amount of text. This is called the **training data**. It’s the second reason the model is “large”—it has consumed a digital library of books, websites, and articles vast enough to fill the National Library many times over.

Finally, all this learning—adjusting billions of parameters based on trillions of words—requires an incredible amount of computer power. This is the **computational cost**. Training a big model is like having thousands of powerful computers working non-stop for months, a process that can cost crores of rupees. So, an LLM is large in three ways: **parameters** (the knobs), **data** (the books it reads), and **computation** (the energy it takes to learn).

-----

**Math behind this**

Let's peek inside one of the simplest "thinkers" in the model, called a neuron. It's just doing some very basic school maths. Imagine this neuron is trying to decide the next word in the sentence "Hot tea with..." Should it be "milk" or "rain"? It takes in information and spits out a number.

The core math is a simple multiplication and addition, called a **weighted sum**.

The equation looks like this:
$y = (w_1 \cdot x_1 + w_2 \cdot x_2) + b$

Let’s break that down:

  * $x_1, x_2$ : These are numbers representing the input words, like "Hot" and "tea".
  * $w_1, w_2$ : These are the **weights**, which are the all-important **parameters**. They're the "knobs". They tell the neuron how much importance to give to each input word. A high weight means "pay close attention\!"
  * $b$ : This is the **bias**. It's another parameter, like a little nudge that pushes the final result up or down, regardless of the input.
  * $y$ : This is the final output number from our one tiny neuron.

A real LLM has billions of these weights and biases, all connected in a giant, complicated web. The "large" part means the numbers of `w`'s and `b`'s are gigantic.

**A Tiny Numerical Example**

Let's pretend our neuron only has 3 parameters ($w_1$, $w_2$, and $b$). A big model like GPT-3 has about 175,000,000,000 of them\!

Let's say our inputs are:

  * $x_1 = 3.0$ (representing the word "Hot")
  * $x_2 = 4.0$ (representing the word "tea")

And our model has these parameter values (the knobs are already set):

  * $w_1 = 2.0$
  * $w_2 = 5.0$
  * $b = -1.0$

Let's calculate the output $y$ step-by-step, just like you would in your exercise book.

**Step 1: Calculate the first weighted input ($w_1 \cdot x_1$)**
We need to multiply $2.0$ by $3.0$.

```
   2.0
×  3.0
------
   0.0  (0 × 2.0)
+ 6.00  (3 × 2.0)
------
   6.00
```

So, $w_1 \cdot x_1 = 6.0$.

**Step 2: Calculate the second weighted input ($w_2 \cdot x_2$)**
We need to multiply $5.0$ by $4.0$.

```
   5.0
×  4.0
------
   0.0   (0 × 5.0)
+ 20.00  (4 × 5.0)
------
  20.00
```

So, $w_2 \cdot x_2 = 20.0$.

**Step 3: Add the weighted inputs together**
Now we add $6.0$ and $20.0$.

```
   6.0
+ 20.0
------
  26.0
```

**Step 4: Add the bias ($b$)**
Finally, we add our bias, which is $-1.0$.

```
  26.0
+ (-1.0)
------
  25.0
```

Our neuron's output is $y = 25.0$. This number would then be passed to other neurons, which would do their own calculations, until the model finally produces a probability for the next word.

**My Sketch**

```
                  ┌──────────┐
Input x₁ (Hot) O───(w₁=2.0)───►│          │
                  │          │
                  │ Neuron y ├───> Output (25.0)
                  │          │
Input x₂ (tea) O───(w₂=5.0)───►│          │
                  └──────────┘
                      ▲
                      │
                   (b=-1.0)
```

"Large" means your drawing would have billions of these circles and lines, all interconnected. It's too big to draw, but it's all made of this very simple math, repeated over and over.

-----

**Deep Dive: The Scaling Hypothesis**

Formally, a Large Language Model is a neural network, typically based on the **Transformer architecture**, whose performance and capabilities are a direct consequence of its scale. The term "large" is operationalized by three interconnected quantities: the number of model parameters ($N$), the size of the training dataset ($D$), and the total computational budget for training ($C$).

**Parameters ($N$)**

The parameters are the tunable elements $\theta$ of the model $p_\theta(x)$. For a standard decoder-only Transformer (like GPT-3), the majority of parameters are in the self-attention and feed-forward network (FFN) layers.

A reasonable approximation for the parameter count is:
$N \approx n_{layers} \times (N_{attn} + N_{ffn}) + N_{embed}$

Where:

  * $n_{layers}$: Number of Transformer blocks.
  * $d_{model}$: The model's hidden dimension (width).
  * $n_{heads}$: Number of attention heads.
  * $d_{head}$: Dimension of each attention head ($d_{model} = n_{heads} \cdot d_{head}$).
  * $d_{ff}$: Inner dimension of the FFN, typically $4 \cdot d_{model}$.
  * $V$: Vocabulary size.

The parameter counts for the key sub-components per layer are:

  * **Self-Attention ($N_{attn}$):** The weight matrices for query, key, value, and output projections ($W_q, W_k, W_v, W_o$) are each of size $d_{model} \times d_{model}$.
    $N_{attn} = 4 \cdot d_{model}^2$ (ignoring biases).
  * **Feed-Forward Network ($N_{ffn}$):** Two linear layers, one from $d_{model} \to d_{ff}$ and the other from $d_{ff} \to d_{model}$.
    $N_{ffn} = (d_{model} \cdot d_{ff}) + (d_{ff} \cdot d_{model}) = 2 \cdot d_{model} \cdot d_{ff}$. With $d_{ff} = 4d_{model}$, this becomes $8 \cdot d_{model}^2$.
  * **Total per Layer (approx):** $N_{layer} \approx 12 \cdot d_{model}^2$.
  * **Embedding Matrix ($N_{embed}$):** The token embedding and final unembedding matrices contribute $2 \cdot V \cdot d_{model}$ parameters (often weights are shared, so $V \cdot d_{model}$).

**Proof-sketch of quadratic dependence:** The parameter count scales quadratically with the model width ($d_{model}$). This is a key reason why making models "wider" is a parameter-expensive way to scale. For example, doubling $d_{model}$ quadruples the number of parameters in the core layers.

**Scaling Laws**

The justification for creating "large" models is empirical, formalized by **scaling laws**. Research by Kaplan et al. (OpenAI, 2020) demonstrated that the test loss ($L$) of an autoregressive language model scales as a power-law function of $N$, $D$, and $C$.

A simplified form of the scaling law for model size $N$ is:
$L(N) = \left(\frac{N_c}{N}\right)^{\alpha_N} + L_\infty$

Where $L(N)$ is the achievable cross-entropy loss for a model with $N$ parameters, and $N_c$, $\alpha_N$, and $L_\infty$ are constants fitted from empirical data. This predictable relationship implies that simply increasing the parameter count (as long as the model is trained to convergence on sufficient data) will predictably decrease the loss and improve performance.

The **Chinchilla scaling laws** (Hoffmann et al., DeepMind, 2022) refined this, suggesting that for optimal performance under a fixed FLOPs budget, both model size and training data size should be scaled in equal measure. They found that most existing LLMs were "over-parameterized and under-trained." For optimal training of a model of size $N$, one should use $D \approx 20 \cdot N$ tokens. This insight has guided the development of newer models.

**Computational Cost ($C$)**

The training compute is typically measured in Petaflop-days or total FLOPs. A rule-of-thumb for estimating the training FLOPs for a dense Transformer is:
$C \approx 6 \cdot N \cdot D_{tokens}$

This formula arises because for each token processed, the model performs approximately $2N$ FLOPs (one matrix-vector product for the forward pass and two for the backward pass, simplified). Thus, for a dataset of $D_{tokens}$, the total computation is $\approx 2N \cdot D_{tokens} \cdot 3$ (where the 3 accounts for forward+backward pass). This simplifies to $6ND$.

**Failure Modes & Research Frontiers:**

  * **Emergent Abilities:** Scale appears to be not just quantitative but qualitative. Abilities like multi-step reasoning are not present in smaller models but "emerge" at certain scale thresholds. The mechanisms behind this are not fully understood.
  * **Data Scarcity:** We are approaching the limits of high-quality text data available on the public internet. Future scaling may rely on synthetic data or multi-modal data.
  * **Alignment Tax:** Controlling large models and aligning them with human values is a major open problem. Techniques like Reinforcement Learning from Human Feedback (RLHF) have a "performance tax" and their own scaling challenges.
  * **Sparsity & Efficiency:** The $O(N^2)$ scaling of dense Transformers is a bottleneck. Research into architectures like Mixture-of-Experts (MoE) attempts to increase parameter count ($N$) while keeping the number of active parameters per token ($N_{active}$) constant, thus decoupling model size from computational cost per forward pass.

**Disclaimer:** Training and deploying large-scale models require significant expertise in distributed systems and AI safety. The results and behaviors of these models can be unpredictable. For safety-critical applications, reliance on LLMs without rigorous testing and human oversight is strongly discouraged.

-----

So, after all that, the giant magical book with a billion knobs isn't just a bigger recipe book. It’s a completely different kind of cook—one that learned so much it can now invent dishes no one has ever dreamed of.