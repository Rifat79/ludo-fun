import { Dimensions } from "react-native";
import Svg from "react-native-svg";

import BaseBoard from "./BaseBoard";
import Center from "./Center";
import HomeAreas from "./HomeAreas";
import HomeCircles from "./HomeCircles";
import Paths from "./Paths";

const { width } = Dimensions.get("window");

export default function LudoBoard() {
  const size = width - 20;

  return (
    <Svg width={size} height={size} viewBox='0 0 360 360'>
      <BaseBoard />
      <HomeAreas />
      <Paths />
      <Center />
      <HomeCircles />
    </Svg>
  );
}
