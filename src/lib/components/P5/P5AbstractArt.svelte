<script lang="ts">
	import { onMount } from 'svelte';
	// For type annotations only. This is erased from the final JS bundle.
	import type p5 from 'p5';

	// 1. Particle class is at the top-level scope, resolving the performance warning.
	class Particle {
		p: p5;
		pos: p5.Vector;
		vel: p5.Vector;
		acc: p5.Vector;
		lifespan: number;
		color: p5.Color;

		// 2. The constructor now accepts the main p5 constructor as a dependency.
		//    We use 'any' here for simplicity, as the type is complex (typeof p5).
		constructor(p: p5, p5Constructor: any, x: number, y: number) {
			this.p = p;
			this.pos = this.p.createVector(x, y);
			// 3. The static 'Vector' property is now accessed from the injected constructor.
			this.vel = p5Constructor.Vector.random2D().mult(this.p.random(1, 3));
			this.acc = this.p.createVector(0, 0);
			this.lifespan = 255;
			this.color = this.p.color('#D4AF47');
		}

		update() {
			this.vel.add(this.acc);
			this.pos.add(this.vel);
			this.lifespan -= 1.5;
			this.acc.mult(0);
		}

		show() {
			this.p.noStroke();
			this.color.setAlpha(this.lifespan);
			this.p.fill(this.color);
			this.p.ellipse(this.pos.x, this.pos.y, 8);
		}

		isFinished() {
			return this.lifespan < 0;
		}
	}

	let container: HTMLDivElement;
	let p5Instance: p5 | undefined;

	onMount(() => {
		const initSketch = async () => {
			const p5Constructor = (await import('p5')).default;

			const sketch = (p: p5) => {
				const particles: Particle[] = [];

				p.setup = () => {
					p.createCanvas(p.windowWidth > 768 ? 600 : 300, 400).parent(container);
					p.background(p.color('#171717'));
				};

				p.draw = () => {
					p.background(23, 23, 23, 40);
					// 4. Inject both the instance 'p' and the 'p5Constructor' when creating a particle.
					particles.push(new Particle(p, p5Constructor, p.width / 2, p.height / 2));

					for (let i = particles.length - 1; i >= 0; i--) {
						particles[i].update();
						particles[i].show();
						if (particles[i].isFinished()) {
							particles.splice(i, 1);
						}
					}
				};
			};

			p5Instance = new p5Constructor(sketch, container);
		};

		initSketch();

		return () => {
			p5Instance?.remove();
		};
	});
</script>

<div class="interactive-component-wrapper">
	<p>
		This is a dynamic abstract art piece generated with p5.js inside a Svelte component. The sketch
		continuously generates and animates particles from the center.
	</p>
	<div
		bind:this={container}
		class="mt-4 flex justify-center rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-900 overflow-hidden"
	>
		</div>
</div>