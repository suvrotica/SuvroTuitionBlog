<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

	// Use Svelte's bind:this to get a reference to the canvas element
	let canvas: HTMLCanvasElement | undefined = $state();

	onMount(() => {
		// Ensure the canvas element is available
		if (!canvas) return;

		// Scene setup
		const scene = new THREE.Scene();

		// Camera setup
		const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
		camera.position.z = 5;

		// Renderer setup
		const renderer = new THREE.WebGLRenderer({
			canvas: canvas,
			antialias: true,
			alpha: true // Make canvas background transparent
		});
		renderer.setSize(canvas.clientWidth, canvas.clientHeight);
		renderer.setPixelRatio(window.devicePixelRatio);

		// Geometry and Material
		const geometry = new THREE.TorusKnotGeometry(1.2, 0.35, 100, 16);
		const material = new THREE.MeshStandardMaterial({
			color: 0xd4af47, // Gold color from your theme
			metalness: 0.7, // Slightly adjusted for better reflections
			roughness: 0.3
		});
		const torusKnot = new THREE.Mesh(geometry, material);
		scene.add(torusKnot);

		// Lighting
		const ambientLight = new THREE.AmbientLight(0xffffff, 1.5); // Increased intensity
		scene.add(ambientLight);

		const pointLight1 = new THREE.PointLight(0xffffff, 25); // Drastically increased intensity
		pointLight1.position.set(5, 5, 5);
		scene.add(pointLight1);
		
		const pointLight2 = new THREE.PointLight(0xffffff, 15); // Added a second light from another angle
		pointLight2.position.set(-5, -5, -2);
		scene.add(pointLight2);

		// Orbit Controls for interaction
		const controls = new OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;
		controls.autoRotate = true;
		controls.autoRotateSpeed = 1.0;

		// Handle window resizing
		const onResize = () => {
			if (!canvas) return;
			const parent = canvas.parentElement;
			if (parent) {
				const width = parent.clientWidth;
				const height = Math.min(width * 0.6, 500); // Maintain a reasonable aspect ratio
				canvas.width = width;
				canvas.height = height;

				camera.aspect = width / height;
				camera.updateProjectionMatrix();
				renderer.setSize(width, height);
			}
		};

		window.addEventListener('resize', onResize);
		onResize(); // Initial resize

		// Animation loop
		const animate = () => {
			if (!renderer) return; // Exit if cleaned up
			requestAnimationFrame(animate);

			torusKnot.rotation.x += 0.001;
			torusKnot.rotation.y += 0.005;

			controls.update();
			renderer.render(scene, camera);
		};

		animate();

		// Cleanup on component unmount
		return () => {
			window.removeEventListener('resize', onResize);
			renderer.dispose();
			geometry.dispose();
			material.dispose();
			// Stop the animation loop by breaking the chain
			// No direct way to stop rAF, so we ensure renderer is gone
			// and let the garbage collector handle it.
		};
	});
</script>

<div class="interactive-component-wrapper">
	<p>
		This interactive 3D scene is rendered using Three.js. You can drag to rotate the object, and use the mouse wheel to zoom.
	</p>
	<div class="mt-4 flex justify-center rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-900 overflow-hidden aspect-video max-h-[500px]">
		<canvas bind:this={canvas} class="w-full h-full block"></canvas>
	</div>
</div>
