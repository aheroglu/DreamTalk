// Soft Spring Design Palette for DreamTalk
const softSpring = {
  cream: '#FFFFE3',      // Primary background - soft cream
  mint: '#E3FFF1',       // Accent green - mint highlight
  lavender: '#E3E3FF',   // Secondary purple - lavender tabs
  blush: '#FFE3F1',      // Button pink - active states
};

const tintColorLight = softSpring.blush;
const tintColorDark = softSpring.mint;

export default {
  light: {
    text: '#333333',
    background: softSpring.cream,
    tint: tintColorLight,
    tabIconDefault: '#999999',
    tabIconSelected: tintColorLight,
    card: softSpring.mint,
    accent: softSpring.lavender,
    primary: softSpring.blush,
  },
  dark: {
    text: '#FFFFFF',
    background: '#1A1A1A',
    tint: tintColorDark,
    tabIconDefault: '#666666',
    tabIconSelected: tintColorDark,
    card: '#2A2A2A',
    accent: softSpring.lavender,
    primary: softSpring.mint,
  },
  
  // Export palette for direct use in components
  softSpring,
};
