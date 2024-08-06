"use client";

import { Asset } from "./StakeTable";

export default function Circle({
  items,
  mainRadius = 150,
  itemRadius = 20,
}: {
  items: Asset[];
  mainRadius?: number;
  itemRadius?: number;
}) {
  const [centerX, centerY] = [mainRadius + itemRadius, mainRadius + itemRadius];
  const totalRadius = mainRadius + itemRadius;

  const calculatePosition = (index: number, total: number) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    const x = centerX + mainRadius * Math.cos(angle);
    const y = centerY + mainRadius * Math.sin(angle);
    return { x, y };
  };

  return (
    <svg width={totalRadius * 2} height={totalRadius * 2}>
      {/* Main circle */}
      <circle
        cx={centerX}
        cy={centerY}
        r={mainRadius}
        fill="none"
        stroke="black"
      />

      {/* Item circles */}
      {items.map((item, index) => {
        const { x, y } = calculatePosition(index, items.length);
        return <circle key={index} cx={x} cy={y} r={itemRadius} fill="blue" />;
      })}
    </svg>
  );
}
