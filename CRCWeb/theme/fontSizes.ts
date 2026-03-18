export default {
  small: 0,
  medium: 3,
  large: 5,
} as const;

export type FontSizes = typeof import('./fontSizes').default;
export type FontSizeKey = keyof FontSizes;
