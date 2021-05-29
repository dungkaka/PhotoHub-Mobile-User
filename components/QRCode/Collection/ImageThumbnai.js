import React from "react";
import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const ImageThumbnail = (props) => {
  const navigation = useNavigation();

  const { height, width, image, spaceBetween } = props;
  return (
    <View style={{ flex: 1 / 3, height: height, width: width }}>
      <TouchableOpacity
        style={[styles.imageView, { margin: spaceBetween }]}
        onPress={() => navigation.push("ImageZoom", { ...image })}
      >
        <Image
          source={{
            uri: image.thumbnail_url,
            height: "100%",
            width: "100%",
          }}
          resizeMode="cover"
        ></Image>
      </TouchableOpacity>
    </View>
  );
};

export default ImageThumbnail;

const styles = StyleSheet.create({
  imageView: {
    flex: 1,
    backgroundColor: "white",
    overflow: "hidden",
  },
});
