---
title: "Fibonacci" 

thumbnail : "/images/placeholders/IMG-20250730-WA0005.jpg" 

category : "Mathematics" 

---
![fibonacci](/images/placeholders/IMG-20250730-WA0005.jpg) 

It was a perfectly ordinary Wednesday afternoon, the kind where the air hangs thick and the biggest decision on the docket is whether to have a third cup of tea. On my laptop screen, a disembodied professor was droning on about an introduction to Linear Algebra. And then, there it was: the Fibonacci sequence.

That old chestnut. $1, 1, 2, 3, 5, 8, 13, \dots$ and so on into infinity. It's the mathematical equivalent of a comfortable old armchair, a sequence we're all shown in school, usually accompanied by charming pictures of rabbits reproducing with alarming alacrity. The rule is simplicity itself: any number in the sequence is just the sum of the two that came before it. In the crisp language of mathematics, we write this as:

$$ 
f_n = f_{n-1} + f_{n-2} 
$$

A beautifully simple recursive relationship. To find the next number, you just need the last two. And then the professor did something... peculiar. He took this gentle, plodding sequence and forced it into the rigid, angular confines of a matrix. The screen flashed up with an equation not dissimilar to this one:

$$ 
\begin{bmatrix} 
1 & 1 \\ 1 & 0 
\end{bmatrix} 
\begin{bmatrix} 
f_{n-1} \\ f_{n-2} 
\end{bmatrix} = 
\begin{bmatrix} 
f_n \\ f_{n-1} 
\end{bmatrix} 
$$

My brain, still pondering the tea situation, baulked. Why? What was the earthly point of this? It felt like using a particle accelerator to toast a piece of bread. It seemed like an act of needless complication, a solution in search of a problem. But a flicker of curiosity stubbornly remained. How did he even conjure that matrix from thin air? What was the thought process that leads from a simple sum to that stark block of ones and zeros?

So, I paused the video, leaned back, and decided to retrace the steps from first principles, as if I were the first person to stumble upon this idea.

First things first: what do we *need* to know to describe the Fibonacci sequence at any given point? To calculate the next term, $f_n$, you absolutely must know the values of $f_{n-1}$ and $f_{n-2}$. That's it. Those two numbers contain all the necessary information. In the parlance of physics and engineering, this is the "state" of our system.

Linear algebra loves to represent states as vectors. So, let's define a state vector, $\vec{v}$, that captures our Fibonacci universe at step $n-1$. A perfectly sensible choice would be:

$$ 
\vec{v}_{n-1} = 
\begin{bmatrix} 
f_{n-1} \\ f_{n-2} 
\end{bmatrix} 
$$

This little column vector holds everything we need. Now, the grand ambition of this whole exercise is to find a *transformation* that will take us from this state to the *next* state, which would logically be:

$$ 
\vec{v}_{n} = 
\begin{bmatrix} f_n \\ f_{n-1} \end{bmatrix} 
$$

In linear algebra, transformations are matrices. So the game is afoot. We are hunting for a mystery matrix, let's call it $A$, that does the following:

$$ 
A \cdot \vec{v}_{n-1} = \vec{v}_{n} 
$$

Let's write that out in its full, glorious form, with our unknown matrix represented by letters:

$$ 
\begin{bmatrix} a & b \\ c & d \end{bmatrix} 
\begin{bmatrix} f_{n-1} \\ f_{n-2} \end{bmatrix} = 
\begin{bmatrix} f_n \\ f_{n-1} \end{bmatrix} 
$$

This is the puzzle. All we need to do now is solve for $a, b, c,$ and $d$.

Let's do the matrix multiplication on the left-hand side. The rules of engagement are clear: row by column.

The top entry of our resulting vector will be $a \cdot f_{n-1} + b \cdot f_{n-2}$. And we know from our goal on the right-hand side that this has to equal $f_n$. So:

$$ 
a \cdot f_{n-1} + b \cdot f_{n-2} = f_n 
$$

At this point, a small, satisfying *click* should sound in the cerebral machinery. We already have a formula for $f_n$! It's the definition of the Fibonacci sequence itself: $f_n = 1 \cdot f_{n-1} + 1 \cdot f_{n-2}$.

Comparing the two equations, the solution presents itself with startling clarity. It must be that $a=1$ and $b=1$. The top row of our mystery matrix practically wrote itself.

Now for the bottom row. The matrix multiplication gives us $c \cdot f_{n-1} + d \cdot f_{n-2}$. And the goal on the right-hand side tells us this must be equal to $f_{n-1}$.

$$ 
c \cdot f_{n-1} + d \cdot f_{n-2} = f_{n-1} 
$$

This one is even more beautifully mundane. How can we combine $f_{n-1}$ and $f_{n-2}$ to get just $f_{n-1}$? Well, we take one of the $f_{n-1}$'s and, crucially, *none* of the $f_{n-2}$'s. So, it must be that $c=1$ and $d=0$.

And there it was. Assembling our discovered values, we get the matrix $A$:

$$ 
A = \begin{bmatrix} 1 & 1 \\ 1 & 0 \end{bmatrix} 
$$

It wasn't magic at all. It was a simple, logical deduction, flowing directly from the definition of the sequence itself. The feeling was not one of complex revelation, but of seeing how a familiar object could be described in a completely new, yet perfectly fitting, language.

At this point, you might still be thinking, "Fine, a clever bit of mathematical window dressing. You've just repackaged the problem." And you would be right, but also spectacularly wrong. This isn't just a new hat for an old formula. It's a warp drive.

Consider this: to find $f_{100}$, the old way requires you to find $f_{99}$ and $f_{98}$, which requires $f_{98}$ and $f_{97}$, and so on, all the way back to the beginning. It's a laborious chain of additions.

But with the matrix form? To get from our initial state, say $\vec{v}_1 = \begin{bmatrix} f_1 \\ f_0 \end{bmatrix} = \begin{bmatrix} 1 \\ 0 \end{bmatrix}$, to the state $\vec{v}_{100} = \begin{bmatrix} f_{100} \\ f_{99} \end{bmatrix}$, we just apply the transformation matrix 99 times.

$$ 
\vec{v}_{100} = A^{99} \cdot \vec{v}_1 
$$

We've transformed a recursive problem into one of matrix exponentiation. And while calculating $A^{99}$ might seem daunting, linear algebra has astonishingly powerful tools for this, like eigenvalues and diagonalization, that can compute it in a flash. This matrix is the key that unlocks a direct, "closed-form" expression for any Fibonacci number without calculating all the ones before it (the famous Binet's formula, for the curious).

And so, my reverie on the humble tea bag was broken by a much more profound thought. Mathematics is not just about finding answers. It's about finding new ways to ask the questions. It's a testament to that glorious human endeavor of looking at something simple—like rabbits in a field—and asking, "But what if I looked at it... *sideways*?" Sometimes, that change in perspective makes all the difference.
