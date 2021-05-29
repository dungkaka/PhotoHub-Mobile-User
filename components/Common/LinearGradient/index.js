import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  random_rainbowGradient,
  gradient as GRADIENT,
} from "./../../../utils/gradient";

const CustomLinearGradient = (props) => {
  const [gradient, setGradident] = useState(["#fff", "#fff"]);

  useEffect(() => {
    setGradident(GRADIENT.blue_purple);
  }, []);

  return (
    <LinearGradient start={[0, 0.25]} end={[1, 0.75]} colors={gradient}>
      {props.children}
    </LinearGradient>
  );
};

export default CustomLinearGradient;
