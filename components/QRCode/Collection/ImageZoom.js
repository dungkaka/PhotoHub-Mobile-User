import React from "react";
import { View, Text } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import { useRoute } from "@react-navigation/native";

const ImageZoom = () => {
  const route = useRoute();
  const image = route.params ? route.params : {};
  const images = [
    {
      url: image.url ? image.url : image.thumbnail_url,
    },
  ];

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "black",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      <ImageViewer imageUrls={images} backgroundColor="white" />
    </View>
  );
};

export default ImageZoom;
