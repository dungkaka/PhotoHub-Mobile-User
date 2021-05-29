import React, {
  useRef,
  useEffect,
  forwardRef,
  useState,
  useImperativeHandle,
} from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  TouchableHighlight,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import BottomSheet from "reanimated-bottom-sheet";
import { useNavigation } from "@react-navigation/native";
import { delay, color } from "../../../utils/f";
import {
  MaterialCommunityIcons,
  Entypo,
  MaterialIcons,
} from "@expo/vector-icons";
import { stickRef } from "./createRefModal";
import { LinearGradient } from "expo-linear-gradient";
import { gradient } from "./../../../utils/gradient";
const window = Dimensions.get("window");

const ModalSearch = forwardRef(({ getMyLocation, searchMyLocation }, ref) => {
  const navigation = useNavigation();
  const refSearch = useRef();
  const [reLoad, setReLoad] = useState(false);

  useImperativeHandle(ref, () => ({
    async open() {
      await delay(350);
      refSearch.current.snapTo(0);
    },
    async close() {
      await delay(100);
      refSearch.current.snapTo(1);
    },
  }));

  const renderSearch = () => (
    <View style={styles.headerContainer}>
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.topleftHeader}
          onPress={() => {
            getMyLocation();
          }}
        >
          <MaterialIcons name="my-location" color={color.blueDark} size={22} />
        </TouchableOpacity>
      </View>
      <View
        onPress={() => navigation.navigate("Search")}
        style={styles.contentContainer}
      >
        <View style={{ top: -10 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            {" "}
            Where would you like to find ?{" "}
          </Text>
        </View>
        <TouchableWithoutFeedback onPress={() => navigation.navigate("Search")}>
          <View style={styles.typeLocation}>
            <Entypo name="location-pin" style={styles.typeIcon}></Entypo>
            <Text style={styles.type}> Search for a location </Text>
          </View>
        </TouchableWithoutFeedback>

        <TouchableOpacity onPress={() => searchMyLocation()}>
          <LinearGradient
            style={[
              styles.typeLocation,
              {
                borderColor: "transparent",
              },
            ]}
            colors={gradient.aqua_splash}
            start={[0, 0]}
            end={[1, 1]}
          >
            <Entypo
              name="home"
              style={[styles.typeIcon, { color: "white" }]}
            ></Entypo>
            <Text style={[styles.type, { color: "white" }]}>
              {" "}
              Your Location{" "}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderContent = () => (
    <View
      style={{ height: 640, width: "100%", backgroundColor: "blue" }}
    ></View>
  );

  return (
    <View
      style={{
        position: "absolute",
        height: "100%",
        width: "100%",
      }}
    >
      <BottomSheet
        ref={refSearch}
        initialSnap={1}
        snapPoints={["40%", 0]}
        renderContent={renderContent}
        renderHeader={renderSearch}
        enabledGestureInteraction={false}
        enabledBottomInitialAnimation={true}
      />
    </View>
  );
});

export default stickRef(ModalSearch);

const styles = StyleSheet.create({
  headerContainer: {
    height: window.height * 0.5,
    width: "100%",
    backgroundColor: "transparent",
  },
  topHeader: {
    // position: "absolute",
    width: "100%",
    top: -10,
    height: 30,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  topleftHeader: {
    marginRight: 10,
    padding: 8,
    backgroundColor: `rgba(255,255,255,0.5)`,
    borderRadius: 50,
  },
  contentContainer: {
    backgroundColor: "white",
    flex: 1,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    padding: 30,
    elevation: 10,
  },
  typeLocation: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: color.gray0,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: color.gray2,
    padding: 10,
    marginVertical: 5,
  },
  typeIcon: {
    paddingHorizontal: 10,
    fontSize: 22,
    color: color.blueModern2,
  },
  type: {
    fontSize: 14,
    color: color.gray5,
  },
});
