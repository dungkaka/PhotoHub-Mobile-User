import React, { useEffect, useState } from "react";
import { View, FlatList, TouchableOpacity, Text } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import ImageThumbnail from "./ImageThumbnai";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { rainBowGradient } from "../../../utils/gradient";
import request from "../../../utils/axios";
import { URL } from "../../../configs/end-points-url";
import customAlert from "../../Common/CustomAlert";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "react-native-loading-spinner-overlay";
import { createCollectionSuccess } from "./../../../redux/actions/collection";
import { color } from "../../../utils/f";

const QRCollectionDetail = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const { collection } = route.params ? route.params : {};
  const { images_snippet, id, ownUser, name } = collection;
  const { user } = useSelector((store) => store.user);
  const [loading, setLoading] = useState(false);
  const [addCollection, setAddCollection] = useState(false);
  const [newCollection, setNewCollection] = useState({});

  useEffect(() => {
    navigation.setOptions({
      title: "Share:  " + collection.name,
    });
  }, []);

  const handleAddToCollection = async () => {
    setLoading(true);
    try {
      const response = await request.server.post(URL.CLONE_COLLECTION(), {
        ownUser: ownUser,
        collectionId: id,
      });
      const data = response.data;
      console.log(data);
      if (data.status == true) {
        dispatch(createCollectionSuccess({ collection: data.collection }));
        setAddCollection(true);
        setNewCollection(data.collection);
        setLoading(false);
      } else {
        setLoading(false);
        throw new Error(data.message);
      }
    } catch (error) {
      setLoading(false);
      customAlert(error.message);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Spinner
        visible={loading}
        textStyle={{ color: "black" }}
        cancelable={true}
        animation="fade"
      />
      <FlatList
        style={{ marginHorizontal: 5 }}
        numColumns={3}
        keyExtractor={(item) => item.image_id.toString()}
        data={images_snippet}
        renderItem={({ item }) => (
          <ImageThumbnail
            image={item}
            width={200}
            height={120}
            spaceBetween={2}
          />
        )}
      />

      {user && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            backgroundColor: "transparent",
            opacity: 0.9,
            shadowColor: "black",
            shadowOpacity: 1,
            elevation: 30,
          }}
        >
          <LinearGradient
            colors={
              !addCollection ? rainBowGradient.blue : [color.gray5, color.gray2]
            }
            start={[0, 0]}
            end={[1, 1]}
          >
            <TouchableOpacity
              disabled={addCollection}
              onPress={handleAddToCollection}
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                padding: 15,
              }}
            >
              {!addCollection ? (
                <MaterialIcons
                  name="create-new-folder"
                  color="white"
                  size={26}
                ></MaterialIcons>
              ) : (
                <Ionicons name="md-checkmark" size={26} color="white" />
              )}

              <Text
                style={{
                  marginLeft: 10,
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "white",
                }}
              >
                {!addCollection ? "Add To Collection" : newCollection.name}
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      )}
    </View>
  );
};

export default QRCollectionDetail;
