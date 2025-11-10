// app/constants/fonts.ts

export const FontSizes = {
  extraLarge: 36,
  h1: 28,
  h2: 22,
  large: 18,
  medium: 16,
  small: 14,
  extraSmall: 12,
};

export const FontWeights = {
  bold: '700',
  semiBold: '600',
  medium: '500',
  regular: '400',
  light: '300',
} as const;

// 🎨 Główne rodziny czcionek
export const FontFamilies = {
  heading: 'DancingScript_400Regular',      // dla nagłówków
  body: 'Poppins_Regular',              // dla zwykłych tekstów
  button: 'PlayfairDisplay_700Bold',      // dla przycisków
};
