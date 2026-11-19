// Colour grades: each grade maps a photo's luminance through a three-stop
// duotone (shadow, midtone, highlight), then washes the whole cover with a
// warm or cool tint. No photo ever leaves the machine; the grade is math.
export const GRADES = {
  sunset: {
    label: 'Vice City Sunset',
    shadow: [36, 10, 58],
    mid: [255, 104, 54],
    light: [255, 216, 150],
    wash: 'rgba(255, 96, 44, 0.16)',
    vignette: 0.4,
  },
  neon: {
    label: 'Neon Night',
    shadow: [4, 18, 40],
    mid: [0, 214, 196],
    light: [255, 92, 196],
    wash: 'rgba(0, 170, 255, 0.12)',
    vignette: 0.42,
  },
  golden: {
    label: 'Golden Hour',
    shadow: [44, 26, 8],
    mid: [216, 158, 60],
    light: [255, 238, 182],
    wash: 'rgba(255, 180, 60, 0.14)',
    vignette: 0.34,
  },
  noir: {
    label: 'Noir',
    shadow: [10, 10, 12],
    mid: [118, 118, 124],
    light: [244, 244, 248],
    wash: 'rgba(20, 24, 60, 0.10)',
    vignette: 0.46,
  },
};

export const GRADE_ORDER = ['sunset', 'neon', 'golden', 'noir'];
