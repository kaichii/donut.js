import { useCallback, useEffect, useRef } from "react";
import type { } from 'leva'

type DonutOptions = {
  animate: boolean;
  r1: number;
  r2: number;
  k1: number;
  k2: number;
  spacing1: number
  spacing2: number
  light: [number, number, number],
  width?: number;
  height?: number,
  pixelColor?: { r: number, g: number, b: number }
  pixelSize?: number
}

let A = 1,
  B = 1;

function clean(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function draw(
  ctx: CanvasRenderingContext2D,
  options: Omit<DonutOptions, "animate" | "width" | "height">
) {
  const { width, height } = ctx.canvas;
  const { r1, r2, k1, k2, spacing1, spacing2, light, pixelColor = { r: 255, g: 255, b: 255 }, pixelSize = 2 } = options;

  clean(ctx);

  (function () {
    A += 0.04;
    B += 0.02;
    const { sin, cos } = Math;

    const [cosA, sinA, cosB, sinB] = [cos(A), sin(A), cos(B), sin(B)];

    for (let theta = 0; theta < 6.28; theta += spacing1) {
      const [sinT, cosT] = [sin(theta), cos(theta)];

      for (let phi = 0; phi < 6.28; phi += spacing2) {
        const [sinP, cosP] = [sin(phi), cos(phi)];

        // 在 x,y 平面上绘制圆环(平面)，半径 R1, 圆心 (0, R2, 0)
        let [x, y, z] = [r1 * sinT, r2 + r1 * cosT, 0];
        // 单位向量
        let [dx, dy, dz] = [sinT, cosT, 0];

        // 绕 X 轴旋转 2Pi 得到圆环（3D），半径 R2
        // (x,y,z)·[1 0 0\n 0 cosP -sinP\n 0 sinP cosP]
        [x, y, z] = [x, y * cosP - z * sinP, y * sinP + z * cosP];
        [dx, dy, dz] = [dx, dy * cosP - dz * sinP, dy * sinP + dz * cosP];

        // 绕 Y 轴旋转 A
        [x, y, z] = [x * cosA + z * sinA, y, z * cosA - x * sinA];
        [dx, dy, dz] = [dx * cosA + dz * sinA, dy, dz * cosA - dx * sinA];

        // 绕 Z 轴旋转 B
        [x, y, z] = [x * cosB - y * sinB, x * sinB + y * cosB, z];
        [dx, dy, dz] = [dx * cosB - dy * sinB, dx * sinB + dy * cosB, dz];

        const ooz = 1 / (z + k2);

        const xp = ((width >> 1) + k1 * ooz * x);
        const yp = ((height >> 1) - k1 * ooz * y);

        const [lx, ly, lz] = light;

        // 归一化
        const L = 0.71 * (dx * lx + dy * ly + dz * lz);

        if (L > 0) {
          ctx.fillStyle = `rgba(${pixelColor.r},${pixelColor.g},${pixelColor.b},${L})`;

          ctx.fillRect(xp, yp, pixelSize, pixelSize);
        }
      }
    }
  })();
}

export default function useDonut({ animate, r1, r2, k1, k2, width, height, spacing1, spacing2, light, pixelColor, pixelSize }: DonutOptions) {
  const id = useRef<number>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function init({ width, height }: Pick<DonutOptions, "width" | "height">) {
    const ctx = canvasRef.current?.getContext("2d");

    if (ctx) {
      if (width) ctx.canvas.width = width;
      if (height) ctx.canvas.height = height;

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
  }

  const render = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");

    if (ctx) {
      draw(ctx, { r1, r2, k1, k2, spacing1, spacing2, light, pixelColor, pixelSize });
    }

    id.current = requestAnimationFrame(render);
  }, [r1, r2, k1, k2, spacing1, spacing2, light, pixelColor, pixelSize]);

  useEffect(() => {
    if (animate) {
      id.current = requestAnimationFrame(render);
    } else {
      if (id.current) cancelAnimationFrame(id.current);
    }

    return () => {
      if (id.current) cancelAnimationFrame(id.current);
    }

  }, [animate, render]);

  useEffect(() => {
    init({ width, height });
  }, [width, height]);

  return [canvasRef];
}