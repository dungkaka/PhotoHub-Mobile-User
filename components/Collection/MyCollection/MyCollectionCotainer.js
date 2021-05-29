import React, { useState, useEffect } from "react";
import { useDidMountEffect } from "../../../utils/custom-hook";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  Alert,
  useWindowDimensions,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { getListCollection } from "./../../../redux/actions/collection";
import CollectionThumnail from "./CollectionThumnail";
import ModalAddCollection from "./ModalAddCollection";
import { color } from "../../../utils/f";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { rainBowGradient } from "./../../../utils/gradient";

const MyCollectionContainer = () => {
  const navigation = useNavigation();
  const { height, width } = useWindowDimensions();

  const dispatch = useDispatch();
  const { collections, error } = useSelector((store) => store.collection);
  const [fetching, setFetching] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    dispatch(getListCollection());
  }, []);

  useDidMountEffect(() => {
    if (fetching) setFetching(false);
  }, [collections]);

  // When refersh data of List
  const handleRefresh = () => {
    setFetching(true);
    dispatch(getListCollection());
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <View>
        <ModalAddCollection
          height={height}
          width={width}
          isVisible={modalVisible}
          openModal={openModal}
          closeModal={closeModal}
        ></ModalAddCollection>
      </View>

      <View style={{ flex: 1 }}>
        <FlatList
          style={{ margin: 4, marginBottom: 0 }}
          numColumns={2}
          keyExtractor={(item) => item.collection_id.toString()}
          data={collections}
          renderItem={({ item }) => (
            <CollectionThumnail
              collection={item}
              width={200}
              height={200}
              spaceBetween={5}
            ></CollectionThumnail>
          )}
          onRefresh={handleRefresh}
          refreshing={fetching}
          ListFooterComponent={() => <View style={{ margin: 30 }}></View>}
        />
      </View>

      <View
        style={{
          position: "absolute",
          bottom: 0,
          flexDirection: "row",
          backgroundColor: "transparent",
          opacity: 0.9,
          shadowColor: "black",
          shadowOpacity: 1,
          elevation: 30,
          margin: 5,
          borderRadius: 20,
          overflow: "hidden",
        }}
      >
        <LinearGradient
          style={{ width: "100%" }}
          colors={rainBowGradient.blue}
          start={[0, 0]}
          end={[1, 1]}
        >
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              padding: 15,
              borderRadius: 20,
            }}
          >
            <MaterialIcons
              name="create-new-folder"
              color="white"
              size={26}
            ></MaterialIcons>
            <Text
              style={{
                marginLeft: 10,
                fontSize: 20,
                fontWeight: "bold",
                color: "white",
              }}
            >
              Create New Collection
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
};

export default MyCollectionContainer;
