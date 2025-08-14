// Under the Moonlight Design Palette for DreamTalk
const underTheMoonlight = {
  moonlight: '#CCCCFF',   // Lightest purple - soft moonlight glow
  twilight: '#A3A3CC',    // Medium light purple - evening twilight
  dusk: '#5C5C99',        // Medium dark purple - sunset dusk
  midnight: '#292966',    // Darkest purple - deep midnight
};

const tintColorLight = underTheMoonlight.midnight;
const tintColorDark = underTheMoonlight.twilight;

export default {
  light: {
    text: '#333333',
    background: underTheMoonlight.moonlight,
    tint: tintColorLight,
    tabIconDefault: '#999999',
    tabIconSelected: tintColorLight,
    card: underTheMoonlight.twilight,
    accent: underTheMoonlight.dusk,
    primary: underTheMoonlight.midnight,
  },
  dark: {
    text: '#FFFFFF',
    background: '#1A1A1A',
    tint: tintColorDark,
    tabIconDefault: '#666666',
    tabIconSelected: tintColorDark,
    card: '#2A2A2A',
    accent: underTheMoonlight.dusk,
    primary: underTheMoonlight.twilight,
  },
  
  // Export palette for direct use in components
  underTheMoonlight,
};
