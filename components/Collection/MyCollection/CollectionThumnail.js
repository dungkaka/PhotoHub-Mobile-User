import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import styles from "./index.style";
import { useNavigation } from "@react-navigation/native";
import { color } from "../../../utils/f";

const collectionEmpty =
  "https://firebasestorage.googleapis.com/v0/b/photohub-e7e04.appspot.com/o/assets%2Fcollection-empty.jpg?alt=media&token=d41df555-fb95-4b8a-9951-a7ffe06f5cca";

const CollectionThumnail = (props) => {
  const navigation = useNavigation();

  const { height, width, spaceBetween } = props;
  const { name, images_snippet } = props.collection;

  return (
    <View style={{ flex: 0.5, height: height, width: width, marginBottom: 15 }}>
      <TouchableOpacity
        style={[styles.collectionView, { margin: props.spaceBetween }]}
        onPress={() => navigation.push("Collection Detail", props.collection)}
      >
        <Image
          source={{
            uri: images_snippet[0]
              ? images_snippet[0].thumbnail_url
              : collectionEmpty,
            height: "100%",
            width: "100%",
          }}
          resizeMode="cover"
        ></Image>
      </TouchableOpacity>
      <Text
        style={{
          color: "dimgray",
          marginStart: 5,
          fontWeight: "bold",
          fontSize: 16,
        }}
      >
        {name}
      </Text>
      <Text
        style={{
          color: color.gray5,
          fontSize: 14,
          marginStart: 5,
        }}
      >
        {images_snippet.length}
      </Text>
    </View>
  );
};

export default CollectionThumnail;
