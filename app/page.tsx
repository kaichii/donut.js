"use client";
import useDonut from "@/hooks/useDonut";
import { useControls, folder } from "leva";

export default function Home() {
	const [
		{
			animate,
			canvas: { width, height },
			r1,
			r2,
			k1,
			light,
			k2,
			spacing1,
			spacing2,
			color,
			size,
		},
		set,
		get,
	] = useControls(() => ({
		animate: false,
		canvas: {
			value: {
				width: 500,
				height: 500,
			},
		},
		light: {
			value: [0, 1, -1],
			min: -1,
			step: 1,
			max: 1,
		},
		pixel: folder({
			color: {
				r: 255,
				g: 255,
				b: 255,
			},
			size: 2,
		}),
		options: folder({
			r1: 1,
			r2: 2,
			k1: 250,
			k2: 4,
			spacing1: 0.3,
			spacing2: 0.1,
		}),
	}));

	const [ref] = useDonut({
		animate,
		r1,
		r2,
		k1,
		k2,
		spacing1,
		spacing2,
		width,
		height,
		light,
	});

	return (
		<main className='flex min-h-screen flex-col items-center p-24'>
			<h1 className='mb-4'>Donut.js</h1>
			<canvas ref={ref} width={500} height={500}></canvas>
		</main>
	);
}
