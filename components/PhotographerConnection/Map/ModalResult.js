import React, {
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  View,
  Text,
  Dimensions,
  BackHandler,
  FlatList,
  StyleSheet,
  Image,
} from "react-native";
import BottomSheet from "reanimated-bottom-sheet";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { stickRef } from "./createRefModal";
import { delay } from "../../../utils/f";
import { color } from "./../../../utils/f";
import CustomLinearGradient from "./../../Common/LinearGradient/index";
import { TouchableOpacity } from "react-native-gesture-handler";
import { haversine_distance } from "./../../../utils/map";
const window = Dimensions.get("window");
const avatar_1 =
  "https://firebasestorage.googleapis.com/v0/b/photohub-e7e04.appspot.com/o/avatar%2Favatar_1.jpg?alt=media&token=3efbdede-a9ca-4bd6-95f3-9cd9383e6379";

const ModalResult = forwardRef(
  ({ reset, nears, labelSearch, locationSearch, getDirections }, ref) => {
    const navigation = useNavigation();
    const refResult = useRef();

    useFocusEffect(
      useCallback(() => {
        const onBackPress = () => {
          reset();
          return true;
        };
        BackHandler.addEventListener("hardwareBackPress", onBackPress);

        return () =>
          BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      }, [])
    );

    const renderResult = (photographer) => {
      console.log("NEAR------", photographer);
      const { name, age, gender, address } = photographer.photographerInfor;
      const distance = haversine_distance(locationSearch, photographer);

      return (
        <View style={styles.containerResult}>
          <CustomLinearGradient>
            <View style={styles.result}>
              {/* Image and detail of photogeapher */}
              <View style={styles.topResult}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("PGProfile", {
                      photographer: {
                        ...photographer.photographerInfor,
                        id: photographer.photographerId,
                      },
                    })
                  }
                >
                  <Image
                    style={styles.image}
                    source={{
                      uri: avatar_1,
                    }}
                  ></Image>
                </TouchableOpacity>

                <View style={styles.contentResult}>
                  <Text
                    style={{ fontWeight: "bold", fontSize: 20, color: "white" }}
                  >
                    Name: {name}
                  </Text>
                  <Text
                    style={{
                      color: color.gray8,
                      fontStyle: "italic",
                      color: "white",
                    }}
                  >
                    {gender} - {age}
                  </Text>
                </View>
              </View>

              {/* Distane and go to connect */}
              <View style={styles.bottomResult}>
                <View style={styles.distance}>
                  <Text style={styles.numberDistance}>
                    {distance.toFixed(2)}
                  </Text>
                  <Text style={styles.unit}> km</Text>
                </View>

                <TouchableOpacity
                  style={styles.buttonDirection}
                  onPress={async () => {
                    await getDirections(locationSearch, photographer);
                    refResult.current.snapTo(1);
                  }}
                >
                  <Text style={styles.textDirection}>Direction</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.buttonConnect}
                  onPress={() => {
                    navigation.push("Chat", {
                      photographer: {
                        ...photographer.photographerInfor,
                        id: photographer.photographerId,
                      },
                      location: photographer,
                      distance: distance,
                      fromMap: true,
                    });
                  }}
                >
                  <Text style={styles.textConnect}>Connect</Text>
                </TouchableOpacity>
              </View>
            </View>
          </CustomLinearGradient>
        </View>
      );
    };

    const renderSearch = () => (
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => reset()}
          style={{
            opacity: 0.8,
            marginLeft: 5,
            padding: 6,
            alignContent: "center",
          }}
        >
          <AntDesign name="arrowleft" size={26}></AntDesign>
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 10,
            borderRadius: 25,
            paddingHorizontal: 10,
            backgroundColor: color.gray0,
            borderColor: color.gray2,
            borderWidth: 1,
          }}
        >
          <Entypo name="location-pin" size={18} color={color.blueModern1} />
          <Text
            style={styles.textLabelSearch}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {labelSearch ? labelSearch : ""}
          </Text>
        </View>
      </View>
    );

    const renderContent = () => (
      <View style={[styles.contentContainer, { height: nears.length * 170 }]}>
        {nears.length > 0 ? (
          <View>
            <FlatList
              keyboardDismissMode="on-drag"
              keyExtractor={(item) => item.id}
              data={nears}
              renderItem={({ item }) => renderResult(item)}
            />
          </View>
        ) : (
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              letterSpacing: 1,
              marginVertical: 10,
            }}
          >
            Sorry! No Photographer works in this area!
          </Text>
        )}
      </View>
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
          ref={refResult}
          initialSnap={1}
          snapPoints={["80%", "40%"]}
          renderContent={renderContent}
          renderHeader={renderSearch}
          enabledBottomInitialAnimation={true}
          enabledImperativeSnapping={true}
          // enabledGestureInteraction={false}
        />
      </View>
    );
  }
);

export default stickRef(ModalResult, "CLEAN_UP");

const styles = StyleSheet.create({
  headerContainer: {
    padding: 10,
    width: "100%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  contentContainer: {
    minHeight: 640,
    width: "100%",
    backgroundColor: "white",
    paddingHorizontal: 20,
    marginBottom: 0,
  },
  textLabelSearch: {
    paddingStart: 5,
    paddingEnd: 20,
    paddingVertical: 5,
    color: color.gray8,
    textAlignVertical: "center",
    fontSize: 15,
  },
  containerResult: {
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: "transparent",
    overflow: "hidden",
    elevation: 3,
  },
  result: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: "column",
  },
  image: {
    borderRadius: 200,
    height: window.width / 6,
    width: window.width / 6,
  },
  contentResult: {
    paddingStart: 15,
    flex: 2,
  },
  topResult: {
    flexDirection: "row",
    alignItems: "center",
  },
  bottomResult: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginTop: 10,
    marginBottom: 5,
    paddingHorizontal: 5,
  },
  distance: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  numberDistance: {
    fontSize: 30,
    fontWeight: "bold",
    includeFontPadding: false,
    bottom: -3,
    color: "white",
  },
  unit: {
    color: "white",
    fontStyle: "italic",
    textAlignVertical: "bottom",
  },
  buttonConnect: {
    backgroundColor: color.blueDark,
    paddingStart: 10,
    paddingEnd: 15,
    paddingVertical: 10,
    borderTopEndRadius: 20,
    borderBottomEndRadius: 20,
  },
  textConnect: {
    color: "white",
  },
  buttonDirection: {
    backgroundColor: "white",
    paddingStart: 15,
    paddingEnd: 10,
    paddingVertical: 10,
    borderTopStartRadius: 20,
    borderBottomStartRadius: 20,
  },
  textDirection: {
    color: color.blueDark,
  },
});
