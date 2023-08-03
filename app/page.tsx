"use client";
import { useControls } from "leva";
import { useCallback, useRef, useState } from "react";

let A = 1,
	B = 1;

function draw(ctx: CanvasRenderingContext2D) {
	const { width, height } = ctx.canvas;

	const K1 = 1,
		K2 = 12,
		R1 = 1,
		R2 = 2;

	(function frame() {
		A += 0.07;
		B += 0.02;
		const { sin, cos } = Math;

		const [cosA, sinA, cosB, sinB] = [cos(A), sin(A), cos(B), sin(B)];

		for (let theta = 0; theta < 6.28; theta += 0.03) {
			const [sinT, cosT] = [sin(theta), cos(theta)];

			for (let phi = 0; phi < 6.28; phi += 0.1) {
				const [sinP, cosP] = [sin(phi), cos(phi)];
				const ox = R2 + R1 * cosT,
					oy = R1 * sinT;

				const x = ox * (cosB * cosP + sinA * sinB * sinP) - oy * cosA * sinB;
				const y = ox * (sinB * sinP - sinA * cosB * sinP) + oy * cosA * cosB;

				const ooz = 1 / (K2 + cosA * ox * sinP + sinA * oy);

				const xp = ~~(150 + K1 * ooz * x);
				const yp = ~~(120 - K1 * ooz * y);

				const L =
					0.7 *
					(cosP * cosT * sinB -
						cosA * cosT * sinP -
						sinA * sinT +
						cosB * (cosA * sinT - cosT * sinA * sinP));

				if (L > 0) {
					ctx.fillStyle = "rgba(255,255,255," + L + ")";
					console.log(xp, yp, A, B);
					ctx.fillRect(xp, yp, 5, 5);
				}
			}
		}
	})();
}

export default function Home() {
	const animation = useRef<number>();
	const canvas = useRef<HTMLCanvasElement>(null);

	function init({ width, height }: { width?: number; height?: number }) {
		const ctx = canvas.current?.getContext("2d");

		if (ctx) {
			if (width) ctx.canvas.width = width;
			if (height) ctx.canvas.height = height;

			ctx.fillStyle = "#000";
			ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		}
	}

	const changeWidth = useCallback((width: number) => {
		init({ width });
	}, []);

	const changeHeight = useCallback((height: number) => {
		init({ height });
	}, []);

	useControls({
		animate: {
			value: false,
			onChange: (v: boolean) => {
				function render() {
					const ctx = canvas.current?.getContext("2d");

					if (ctx) {
						draw(ctx);
					}

					animation.current = requestAnimationFrame(render);
				}

				if (v) {
					animation.current = requestAnimationFrame(render);
				} else {
					if (animation.current) cancelAnimationFrame(animation.current);
				}
			},
		},
		width: {
			value: 1000,
			onChange: changeWidth,
		},
		height: {
			value: 500,
			onChange: changeHeight,
		},
	});

	return (
		<main className='flex min-h-screen flex-col items-center p-24'>
			<h1 className='mb-4'>Donut.js</h1>
			<canvas ref={canvas} width={1000} height={500}></canvas>
		</main>
	);
}
