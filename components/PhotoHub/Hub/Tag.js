import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "./index.style";
import { random_color } from "../../../utils/f";

const Tag = ({ tag, onSelect, reset }) => {
  const [selected, setSetlected] = useState(false);
  const [randomColor, setRandomColor] = useState();

  useEffect(() => {}, []);

  useEffect(() => {
    setSetlected(false);
  }, [reset]);

  return (
    <TouchableOpacity
      style={[
        styles.tag,
        selected
          ? { ...styles.tagIsSelected, backgroundColor: randomColor }
          : {},
      ]}
      onPress={() => {
        setRandomColor(random_color());
        setSetlected(!selected);
        onSelect(tag);
      }}
    >
      <Text style={selected ? { color: "white" } : { color: "dimgray" }}>
        {" "}
        {tag.name.en}
      </Text>
    </TouchableOpacity>
  );
};

export default Tag;
