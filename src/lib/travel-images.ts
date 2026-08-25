import type { ImageSourcePropType } from "react-native";

export const TRAVEL_IMAGES = {
  airplane: require("../../assets/images/travel/opt/airplane-with-folded-map.png"),
  beachBall: require("../../assets/images/travel/opt/beach-ball-surfboard.png"),
  camperVanMap: require("../../assets/images/travel/opt/camper-van-with-map.png"),
  camperVan: require("../../assets/images/travel/opt/camper-van.png"),
  camera: require("../../assets/images/travel/opt/compact-camera-with-photo.png"),
  backpack: require("../../assets/images/travel/opt/hiking-backpack.png"),
  lifebuoy: require("../../assets/images/travel/opt/lifebuoy.png"),
  suitcase: require("../../assets/images/travel/opt/rolling-suitcase.png"),
  snorkel: require("../../assets/images/travel/opt/snorkel-diving-mask.png"),
  star: require("../../assets/images/travel/opt/star.png"),
  radio: require("../../assets/images/travel/opt/travel-radio-with-music-notes.png"),
  waterBottle: require("../../assets/images/travel/opt/water-bottle-with-carabiner.png"),
} satisfies Record<string, ImageSourcePropType>;
