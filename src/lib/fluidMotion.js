/**
 * Apple Fluid Interface Motion Parameters (Web-Translated Physics)
 * Based on Apple's WWDC 'Designing Fluid Interfaces' principles:
 * - Direct manipulation with 1:1 tracking
 * - Velocity handoff on release
 * - Critically damped springs (no excessive bounce)
 * - Immediate pointer-down feedback
 */

export const appleSprings = {
  // Move / reposition: damping 1.0 (critically damped), response ~0.35s
  spatialMove: {
    type: "spring",
    stiffness: 340,
    damping: 32,
    mass: 0.8
  },

  // Sheet / Drawer / Modal presentation
  sheet: {
    type: "spring",
    stiffness: 360,
    damping: 32,
    mass: 0.95
  },

  // Tactile tap feedback on pointer-down (Kill input latency)
  tapPress: {
    scale: 0.982,
    transition: {
      type: "spring",
      stiffness: 600,
      damping: 28,
      mass: 0.4
    }
  },

  // Button hover elevation
  hoverElevate: {
    y: -2,
    transition: {
      type: "spring",
      stiffness: 420,
      damping: 24,
      mass: 0.6
    }
  },

  // Dropdown / Popover appearance
  dropdown: {
    type: "spring",
    stiffness: 420,
    damping: 30,
    mass: 0.7
  },

  // Rubber-band resistance factor
  rubberBand: (offset, dimension, constant = 0.55) => {
    return (offset * dimension * constant) / (dimension + constant * offset);
  }
};

export default appleSprings;
