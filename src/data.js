const COLORS = [
  '#7c3aed', '#a855f7', '#c084fc', '#6d28d9', '#8b5cf6',
  '#a78bfa', '#5b21b6', '#9333ea', '#c4b5fd', '#3b1d8e',
  '#7e22ce', '#d8b4fe', '#4c1d95', '#e9d5ff', '#581c87',
];

export function getColor(index) {
  return COLORS[index % COLORS.length];
}
