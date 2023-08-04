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
			step: 0.01,
			max: 1,
		},
		pixel: folder(
			{
				color: {
					r: 255,
					g: 255,
					b: 255,
				},
				size: 2,
			},
			{
				collapsed: true,
			}
		),
		options: folder(
			{
				r1: 1,
				r2: 2,
				k1: 250,
				k2: 6,
				spacing1: {
					value: 0.3,
					step: 0.01,
					min: 0.02,
				},
				spacing2: {
					value: 0.07,
					step: 0.01,
					min: 0.02,
				},
			},
			{
				collapsed: true,
			}
		),
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
		pixelColor: color,
		pixelSize: size,
	});

	return (
		<main className='flex min-h-screen flex-col items-center p-24'>
			<h1 className='mb-4'>Donut.js</h1>
			<canvas ref={ref} width={500} height={500}></canvas>
		</main>
	);
}
