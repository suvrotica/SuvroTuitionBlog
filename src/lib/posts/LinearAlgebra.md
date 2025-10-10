---

title : "Linear Algebra" 

thumbnail: "/src/lib/assets/slideshow-images/portrait/Gemini_Generated_Image_ggwm87ggwm87ggwm.png"

tags: ["Calcutta", "Bengali", "American", "Mathematics", "Linear Algebra" ]

category: "Linear Algebra"

date: "2025-10-10"

published: true

---


<script>
    import PostBadge from '$lib/components/ui/PostBadge.svelte';
    import Mermaid from '$lib/components/blog/Mermaid.svelte';

    import PostImage from '$lib/components/blog/PostImage.svelte';
    import SanskritVerse from '$lib/components/ui/SanskritVerse.svelte';
    import imageSrc from '$lib/assets/slideshow-images/portrait/Gemini_Generated_Image_ggwm87ggwm87ggwm.png?url';
    import Ytp from '$lib/components/blog/YouTubePlayer.svelte';
</script> 


<PostImage src={imageSrc} alt="a vectorial bengali" />

<PostBadge
	title="Field"
	href="/blog/Linear%20Algebra/Field"
	standalone
/>

**A video by @AllAnglesMath to see what I am explaining here**

<Ytp src="https://youtu.be/KbyYTjfgZJI?si=4lZjk5OJhsUpU_hq" />

**A video by @Mutual_Information**

<Ytp src="https://youtu.be/6htbyY3rH1w?si=wVn3c9cJINAVyVFZ" />

Not only am I severely Indian, indelibly brown, incorrigibly ugly, and manic-depressed, but I pretend I know about subjects when I know jackshit. But I don't care, and I hope you don't mind if I take a steaming pile of abnormal knowledge dump gleaned repentantly, unwillingly, through sheer pressure, apathy, and initial disdain for all things related to work. But now I'm fifty, so my life being fuck-all, I have time for revenge—to irritate and nauseate people with halitosis, farts, and just generally my incessant giddy desire to stay continually unwell and make you feel matchingly unwell through my jaundiced erudition causing profligate misuse of your time and non-linear irreparable harm by reading this crap about linear fucking topics of non-masturbatory and joyless mathematics. 

And so, this is not going to be one annoying essay or thought on linear algebra but a culmination of years of distilled education and work experience in the U.S. as a statistician, data scientist, and later as an AI healthcare entrepreneur—spectacular failures in all these endeavors, I hasten to add. I spit that out at the outset because pretense makes mathematics smell faintly of varnish and because the subject demands more than a tidy sermon—it beggars bad metaphors, sick stories, uninteresting experiments, failed models at three in the morning, and the rambling mercies of boring algebra that help make no sense of the mess it already is. So please allow me to piss my pants and show you I’ve pissed my pants, as there’s no better way to consolidate what I can never understand than sharing embarrassment publicly in a way that destroys your hopes of ever mastering a said topic? It’s like theater where you’re gagged and tied, spellbound to a chair, but you are convinced through your mirror neuron that it’s not Tarzan but you swinging from canopy to canopy with a half-naked damsel in well-paid theatrical distress. It’s just with the hope that my bogosity will turn you off permanently, thus ensuring the robots have their obeisances guaranteed, because you’d be blind to what’s inside their shiny metallic noggin.
 
I also preface with unnecessary personal details because mathematics has been, for me, both an unwilling vocation and irritating refuge; bipolar disorder is a clumsy companion, and when words lined up badly or moods dissolved, vectors and matrices remained predictable in a way that both steadied and annoyed me—steady like the tram’s bell, annoying like the tram’s jolt, both taking me nowhere because it’s a bad metaphor stuck in Calcutta traffic. If you are someone curious in Calcutta who likes the smell of rotten mango stalls mixed with the damp, pissy smell of monsoon and the clatter of a ramshackle cycle-rickshaw, this will not ask you to leave any of that behind. Linear algebra will walk through those streets with you like an expensive escort you can’t afford.

To justify my position toward writing long jagged paragraphs full of futility: when I write on a technical topic, I naturally begin with the deficiencies that once tripped me up, too many to recount and I admit I am still in a permanent tripped up state of snare. Some of these I can soften by sketching or programming visualizations, but others come from the sheer strangeness of perspective common to rabid Bengali mad face fucks. If you have never left India, for instance, then the mention of a distant European scientist, usually a peculiar and pecuniary paleface, is just another fuck in a faraway land, with no anchor to fix your attention or spark curiosity. And because history is so often thought of as a tragic, dreary, desiccated none-of-my-fucking-business, the point, people, their piss in these places tend to feel ornamental, something to skim past, like an Indian public urinal. Yet the truth is that what appears inside the tidy bounds of a dense and obese textbook took millennia and many of these pissy serious looking men (few women, high melanin or other meaningless minorities) to assemble. It was never in the order of the chapter numbers. Ideas came and went through mistakes and misadventures: wars, deaths of kingdoms, obscure smelly scribes, forgotten manuscripts stolen during colonial massacres and preserved in white prejudiced museums. Sometimes a symbol, an operator, or a concept survived only because of such accidents or because someone back then could not doomscroll on an expensive iPhone. 

That is why I mix shit up—folding in my own absurd anecdotes, weaving what I find in books, gathering scraps from old footnotes into a narrative stitched in my own opinionated way, unhinged and unobstructed by a syllabus, meandering as I try to approach the topic from many useless angles. This cannot be a pedantic exercise; I am no authority but I am only a curious middle-class mad man of middle age, without the budget of a tenured professor or someone salaried at an endowed university with fat grant money, trying to use his hours unwisely, hoping the result might one day make for a worthless and impossible read. There will be omissions and mistakes, certainly gaps in my grasp of mathematics because I have none. I claim no perfection—only the willingness to keep revising the defecation by defecating more, in the spirit of fallibilism itself. Which is really the point: fallibilism doesn’t demand that I get everything right the first time but every time. It tells me it’s natural—even necessary—that my explanations carry errors along with their insights, most of the time — none. Instead of freezing an idea in glass, it asks me to keep poking, prodding, reworking, until the loose anal dingleberries loosen and fall away. In my context, that means treating every sentence I write, every diagram I sketch, every story I stitch together, like taking a provisional dump. The best I can do today is not the end of the matter, but simply the next stepping stone in a cholera epidemic. If tomorrow I discover that what I wrote is clumsy, misleading, or just plain wrong, then so much the better—it means I’ve found a place to add more diarrhea. 

The subject of linear algebra still isn’t given the importance it should be. And although my mental health issues (bipolar disorder) were one of the reasons I wanted to start a blog, I also simply like mathematics like I fancy defecation. Having worked and gained experience in its applied branches—in engineering and scientific pursuits—I have interesting stories about both the mathematics and the data that I want to avoid sharing, which many people, even those whose lives aren’t touched by mathematical sciences, would not benefit from.

So this first essay will be where I introduce linear algebra etymologically and point to the blog posts of subsequent entries (as they are written) that will cover its subtopics. Now, like most everyone, I arrived at a partial picture of linear algebra (I still don’t have the full picture, but I know quite a bit) late, as a working professional. Neither had it been taught well at Jadavpur University, where I first encountered it—at least I never felt any inspiration toward it—nor was it taught well in the US, where I received my master’s degree. My inspiration has really been personal exploration of the subject through my own perspective, work, and need-based evolution, driven mainly by curiosity to understand the structure of abstraction and the mathematical objects used in various models of abstraction. By models, I mean the approximate mathematics that approach or simulate some real-life situation. But I can help some student or professional arrive precociously at my aha moment with less labor through my posts and visualizations—at least, that's the hope. Or at least, even if no one uses them, I'll have at least put all my scattered thoughts in one place.

Picture, first, a stick. A stick is simple. Give a stick a direction and a length and you have, without fuss, a **vector**. Vectors are arrows with attitudes. They sit in pockets labelled R, usually with a small raised number telling you how many directions the pocket allows — R², R³, $R^n$ — and you can add them (place arrows head to tail) and scale them (stretch or shrink them like puppet strings). That is the ordinary beginning. And when I say: a vector is an element of a vector space, an algebraic structure closed under addition and scalar multiplication, and its study is the study of structure rather than numbers—think of it as if we give them an island of their own. More simply this means we learn not only how arrows behave but why they must behave that way, and what we can build from them — roads, coordinates, secret languages that let machines understand faces and hearts.

Now, imagine a machine-made of numbers-that-eat-arrows and spit-out different arrows. That machine is a **matrix**. A matrix looks like a rectangle of numbers — rows and columns that are, in a civilized fashion, allowed to gossip with one another. Multiply a matrix A by a vector x and you get another vector b: A x = b. Geometrically the matrix is a map — it stretches, rotates, squeezes, sometimes folds space (but only linearly; it cannot bend like a banana). That deceptively modest statement is the crux: **linear algebra** studies linear transformations (matrices) and their actions on vector spaces. Much of applied mathematics, statistics and machine learning works because large systems — populations, pixels, gene expression levels — are approximated as linear, at least locally. When you line up thousands of patient records into a giant table, you have made a matrix. When you ask which combinations of symptoms vary together, you are poking at eigenvectors.

Terms, therefore, with small violent meanings: basis, dimension, rank, eigenvalue, eigenvector, orthogonality, projection. Basis is the set of directions you choose to describe everything; dimension is how many independent directions there are; rank measures how much of the output space your matrix can reach. If you own three bicycles and two are in the shed and one cycles well, the rank tells you roughly how many genuine cycles the fleet can perform. Eigenvectors are the rare arrows that, when you put them into the matrix machine, come out pointing the same way — perhaps a different length, perhaps a negative length that points opposite. The equation A v = λ v — which I will say reverently, because it is the elegant jailer of many truths — asks: which special directions v do not change direction under A, and by what factor λ? Diagonal matrices are like machines that act independently on coordinate axes; diagonalization, when possible, rewrites a matrix in such a friendly language. When diagonalization fails, the singular value decomposition (SVD) arrives like a kindly engineer: any matrix A can be written A = U Σ Vᵀ, where U and V are orthonormal bases and Σ is a diagonal panel of singular values. SVD is both beautiful and brutally useful — it is the Swiss Army knife of data: denoising, compression, revealing hidden structure.
 
“Linear” comes from the Latin linea, literally “a linen thread.” The Romans used stretched cords to draw straight furrows and mark boundaries, so a linea was not some abstract Platonic straightness, but string you could trip over. From that sense we get “line,” and eventually “linear”—anything that obeys straightness, proportionality, and additivity. “Algebra” comes from Arabic: al-jabr, meaning “the reunion of broken parts.” 

It entered Europe through a ninth-century treatise by al-Khwarizmi (yes, the same man who gave us “algorithm”), whose book Kitab al-Jabr wa’l-Muqabala was really about solving equations by balancing and transposing terms. He is the grandfather of Algebra, who laid the foundation stones.

Now, stitched together, “linear algebra” literally means the mending and manipulation of straightness. That doesn’t sound like much, but historically it ballooned into the universal language for systems of equations, geometry, transformations, and later quantum mechanics and machine learning.

One notable mention is Nicole Oresme [ni-kol uh-REM], who was a French philosopher, mathematician, and bishop who lived in the 14th century (c. 1320-1382). He was one of the most original thinkers of the late Middle Ages. While Nicole Oresme did not invent the idea of a "variable" as the symbolic letter (like 'x' or 'y') we use in algebra today, he did invent something arguably more profound and foundational: the concept of graphically representing a changing, variable quantity. Before Oresme, quantities were thought of as static numbers. Oresme was the first to create a system to visualize how a quality (what he called a "form"), such as heat, velocity, or even grace, changed in relation to another quantity, like time or distance.

The idea of using a letter as a placeholder for an unknown or variable number was systematically developed much later, during the Renaissance. The French mathematician François Viète (in the late 16th century) is often credited with being the "father of algebra" for being the first to use letters to represent both unknown quantities and known parameters, which allowed for the creation of general formulas. René Descartes then built on this in the 17th century, popularizing the use of x, y, and z for unknowns and a, b, and c for knowns, which is the system we use today.

As for first sightings of the full phrase <em>Linear Algebra</em> itself, the French get there first. In the mid-nineteenth century you start seeing <strong>algèbre linéaire</strong> orbiting Cauchy’s world of determinants and <em>formes linéaires</em>—not yet a course banner, more a working label for the manipulation of linear forms and systems. It pops up in journals and lectures as a way to fence off the “straight-line” part of algebra from the rest of the menagerie.

English takes the scenic route. Through the late nineteenth and early twentieth centuries, people say <em>matrix theory</em>, <em>determinants</em>, or <em>theory of equations</em>. <strong>Linear algebra</strong> doesn’t really plant its flag until the interwar years and then, decisively, after World War II, when vector spaces and linear transformations become the organizing grammar. You see it settle into American and British syllabi as the course title; the influence of the French structural style helps. A nice tell: Halmos’s 1942 classic is <strong>Finite-Dimensional Vector Spaces</strong>—no “linear algebra” in the title yet—while by the 1950s–60s the same material is routinely taught under that name.

**linear equation**

Imagine a teacher writes on the board

$2x + 3 = 7$

and calls it a linear equation. Sounds terrifyingly serious, but it’s really not. The word “linear” comes from “line” as we discussed. That’s all. A linear equation is just an equation whose solutions, when you plot them, make a straight line, when we are talking only two dimensions that is like drawing on the board, or it could be a straight "plane" in space, or a straight something as the number of dimensions keep increasing. 

Take $y = 2x + 1$. If you draw all the pairs $(x, y)$ that satisfy it, you don’t get a circle, a zigzag, or a Mona Lisa, you get a plain straight line. No drama, no curves. It’s the mathematical equivalent of standing in a queue at Howrah station.

So in one variable:
$2x + 3 = 7$ is linear.
But $x^2 + 3 = 7$ is not—it’s quadratic, and will happily draw a curve instead of a line.

In two variables:
$3x + 2y = 6$ is linear. All the $(x, y)$ pairs that work lie neatly on a straight line.

In three variables:
$x + y + z = 10$ is still linear. Now the solutions don’t form a line, but a flat plane floating in 3-D space. Same idea: flat, straight, no curving around.

In general, a linear equation in $n$ variables looks like:

$a_1x_1 + a_2x_2 + \dots + a_nx_n = b$

<Mermaid code={`mindmap
    root((Linear Equation?))
        Not Allowed
            Products of variables xy, xz
            Powers or roots x^2, √y, x^0.3
            Trig functions sin x, cos y
            Logarithms log x, ln y
            Exponentials e^x, 2^y
        Allowed Forms
            Variables only to 1st power x, x+y, x1+x2+x3
            Variables multiplied by constant y=mx+c
            Coefficients nonlinear in external funcs
            Disguises still OK 3x=2y, x-1=0
            Linear differential eqs y' + 3y = 0      
`} />

Do not be scared if vocabulary rushes in like monsoon rain; the explanation you need is often geometric. Imagine a crowd of vectors as a cloud of points — perhaps pixels of an MRI scan, perhaps rows in an electronic health record (EHR), perhaps the word-vectors that let a computer understand that “apple” is more like “pear” than “carburettor”. Linear algebra gives us tools to ask what directions in that cloud hold the most variance (PCA — principal component analysis), how to compress the cloud without losing its essence (low-rank approximation using SVD), and how to solve for unknowns when exact solutions do not exist (least squares regression: minimize error by projecting onto the space spanned by your predictors).

What makes linear algebra more than a parade of theorems is its applications in the real, messy world, particularly in statistics, machine learning and healthcare. Consider an fMRI study: time series for tens of thousands of voxels feed into matrices where each row is time and each column a voxel (or vice versa). Patterns of correlated activity are eigenvectors of covariance matrices; singular vectors find recurring spatial patterns. In genomics, expression matrices whisper the coordinated life of genes. In EHR-based risk prediction, your matrix is patient × features; dimensionality reduction can mean the difference between a model that trusts spurious correlations and a model that generalizes. Neural networks, despite their nonlinear trappings, are stitched together from linear pieces: fully connected layers are matrix multiplications,convolutions are structured linear maps, embeddings are linear projections into latent spaces. Understanding linear algebra is to know the bones beneath the flesh of modern AI.

Mathematics, in practice, is not often about proving the pretty theorems — it is about discovering what the theorems do for you. I learned this in laboratories in the United States where data smells of coffee and ozone, and in small hospital rooms where clinicians ask blunt questions about risk and outcomes. The algebraic machinery that reduces data noise, that detects patient subpopulations and that compresses images without losing malignant nodules saved time, money and sometimes worry. It will not, by itself, fix a broken system, but it makes the complexity tractable.

Now, a few practical landmarks you should be able to recognize if you walk through a dataset with me: (1) Gaussian elimination and LU decomposition: algorithmic workhorses that solve linear systems efficiently; (2) orthonormality and QR decomposition: the safe way to avoid catastrophic cancellation; (3) singular value decomposition and low-rank approximation: the cleanest route to data compression and denoising; (4) eigen-decomposition of symmetric matrices: the backbone of PCA and spectral clustering; (5) projections and subspaces: geometry that tells you what information you keep and what you discard; (6) nullspaces and nullity: the ways in which equations fail to constrain us, which is sometimes a feature (privacy) and sometimes a bug (non-identifiability).

A cautionary note, clad in gentleness: matrices of clinical data are full of missingness, biases and shifting semantics. Linear algebra provides the scaffolding but not the ethics. When you reduce dimensionality you may, inadvertently, erase minority signals; when you interpret principal components you must interrogate whether they reflect biology or batch effects from different machines. Being skilled in linear algebra without being ethically vigilant is like owning a scalpel and believing that makes you a surgeon.

This first essay — the hinge post — is meant to be a map and a promise. Map: the territory is arithmetic of vectors and matrices, geometry of subspaces, calculus-light optimization, numerical methods and spectral thought (eigen-things). Promise: future posts will unspool these topics with worked examples, code (Python snippets), visualizations, clinical case studies and computational caveats, all written to be useful whether you are a student on Park Street or a researcher in Boston. I will show derivations (because clarity lives in the algebra), but I will also tell stories — how a mis-specified matrix almost led to a bad clinical alert in an hospital system, how singular vectors once revealed a batch effect so obvious it smelled like reagent, and how a stubborn patient-cluster was found not by intuition but by eigenvectors.

Pointers to subsequent posts (short titles and what you'll get — each will be an essay, a toolbox, and a small gallery of code and visuals):

• Vectors and Coordinate Systems: arrows, coordinates, bases, change of basis; intuitive geometry and coordinates as addresses; example: representing wind velocity in Kolkata in Cartesian vs polar-like coordinates.

• Matrix Arithmetic and Geometry: addition, multiplication, transpose, inverse where it exists; geometric interpretation of matrix multiplication; worked example: image as matrix and simple filters.

• Determinant, Volume and Orientation: determinant as volume-scaler and sign; practical meaning and when not to use it for numerical computation.

• Linear Independence, Rank and Nullspace: how to tell whether your predictors tell the same story twice; clinical example: redundant biomarkers.

• Orthogonality, Inner Products and Projections: Gram–Schmidt, QR, geometric projection and why projection equals compromise; least squares and the normal equations, with code and visualization.

• Eigenvalues, Eigenvectors and Diagonalization: spectral intuition, stability, modes of vibration, and the role of eigenstuff in PCA; clinical vignette: symptom clusters as eigen-modes.

• Singular Value Decomposition and Low-Rank Approximation: proof sketch, algorithmic notes, compression and denoising; SVD for image compression and for population stratification in genomics.

• PCA, Factor Analysis and Dimensionality Reduction: the algebraic core and statistical interpretations, with emphasis on centering, scaling and interpreting loadings.

• Numerical Linear Algebra: conditioning, stability, pivoting, iterative solvers and preconditioners; practical section: when direct solvers are tragically impractical and how to use conjugate gradients and sparse methods.

• Regularization and Ill-posed Problems: ridge, Lasso (the latter is not strictly linear but interacts with linear models), Tikhonov regularization and why bias sometimes saves you from disaster.

• Sparse Matrices and Graphs: adjacency matrices, Laplacians, spectral clustering and why networks are often sparse and beautiful.

• Tensors and Multiway Arrays: brief bridge to multilinear algebra, why matrices sometimes aren’t enough (images over time, multimodal healthcare data).

• Linear Algebra in Machine Learning Pipelines: how linear algebra composes into neural networks, embeddings, attention (linear algebra view of softmax and quadratic forms), and pitfalls in reproducibility.

• Case Studies in Healthcare: fMRI matrices and spatial modes, EHR matrices and phenotype discovery, image denoising and diagnostic augmentation; code, pitfalls and reproducible notebooks.

Technical appendices (for readers who like proofs, theorems and a little formalism): proofs of the existence of SVD, spectral theorem for symmetric matrices, derivation of normal equations, a gentle entry into functional analysis connections for the mathematically adventurous.

If you keep nothing else from this introduction, keep this: linear algebra is the language of relations. It is how we turn many small things into a pattern that a machine can reason about. It is a set of lenses; choose your lenses well and you will see structure where others see only noise. Somewhere between the tram bell and the hospital corridor, vectors and matrices have been a steady companion; they helped me order datasets into decisions and, sometimes, helped me order my own scattered thoughts. The next post will start not with definitions but with a stick — a real stick you can hold — and we will build, arrow by arrow, the strange and wonderfully useful world of linear algebra.
