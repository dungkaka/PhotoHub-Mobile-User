import { random_item } from "./f";

export const gradient = {
  blue_purple: ["#74ceff", "#6b69ff"],
  warm_flame: ["#ff9a9e", "#fad0c4"],
  juicy_peach: ["#ffecd2", "#fcb69f"],
  lady_lips: ["#ff9a9e", "#fecfef"],
  winter_neva: ["#a1c4fd", "#c2e9fb"],
  heavy_rain: ["#cfd9df", "#e2ebf0"],
  happy_fisher: ["#89f7fe", "#66a6ff"],
  great_whale: ["#a3bded", "#6991c7"],
  aqua_splash: ["#13547a", "#80d0c7"],
  passionate_bed: ["#ff758c", "#ff7eb3"],
  desert_hump: ["#c79081", "#dfa579"],
};

export const rainBowGradient = {
  red: ["#e55151", "#ff9e9e"],
  yellow: ["#ff9300", "#fdcc2b"],
  blue: ["#6486d3", "#82cdfd"],
  purple: ["#d364a9", "#fd9ef9"],
  green: ["#5baf5b", "#96e89d"],
};

const gradientArray = [
  gradient.warm_flame,
  gradient.juicy_peach,
  gradient.lady_lips,
  gradient.winter_neva,
  gradient.heavy_rain,
  gradient.happy_fisher,
  gradient.great_whale,
  gradient.aqua_splash,
  gradient.passionate_bed,
  gradient.desert_hump,
];

const rainbowGradientArray = [
  rainBowGradient.red,
  rainBowGradient.red,
  rainBowGradient.yellow,
  rainBowGradient.blue,
  rainBowGradient.blue,
  rainBowGradient.blue,
  rainBowGradient.purple,
  rainBowGradient.purple,
  rainBowGradient.green,
];

export const random_gradient = () => {
  return random_item(gradientArray);
};

export const random_rainbowGradient = () => {
  return random_item(rainbowGradientArray);
};
