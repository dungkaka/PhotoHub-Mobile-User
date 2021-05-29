import React from "react";
import { View, Dimensions, Text } from "react-native";
import { useRoute } from "@react-navigation/native";
import QRCode from "react-native-qrcode-svg";
import { URL } from "../../../configs/end-points-url";
import { useSelector } from "react-redux";
const window = Dimensions.get("window");

const CollectionQR = () => {
  const route = useRoute();
  const { user } = useSelector((store) => store.user);
  const ownUser = user.id;

  const { collectionId } = route.params ? route.params : {};

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      <QRCode
        size={window.width * 0.6}
        value={URL.GET_COLLECTION_BY_QR(ownUser, collectionId)}
      />

      <Text style={{ margin: 20, fontSize: 18, fontWeight: "bold" }}>
        {" "}
        Scan QR Code to view collection{" "}
      </Text>
    </View>
  );
};

export default CollectionQR;
