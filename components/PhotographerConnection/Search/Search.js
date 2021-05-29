import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
} from "react-native";
import { color, delay } from "./../../../utils/f";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome5, Entypo } from "@expo/vector-icons";
import { hereKeyAPI } from "./../../../configs/placeAPI";
import axios from "axios";
import { useGoBackHandler } from "./../../../utils/custom-hook";
import { LinearGradient } from "expo-linear-gradient";
import { rainBowGradient, gradient } from "./../../../utils/gradient";
import ContentLoader, {
  Rect,
  Circle,
  Facebook,
} from "react-content-loader/native";

const baseUrl =
  "https://autocomplete.geocoder.ls.hereapi.com/6.2/suggest.json?";

const Search = () => {
  const navigation = useNavigation();

  const [searching, setSearching] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const textRef = useRef("");
  const canSearch = useRef(true);
  let timeOutSearch = 0;

  useGoBackHandler(navigation);

  useEffect(() => {
    const i = setInterval(() => {
      canSearch.current = true;
    }, 1600);

    return () => {
      clearInterval(i);
    };
  }, []);

  const renderUrl = (location) => {
    const _location = location;
    return (
      baseUrl +
      "query=" +
      _location +
      "&maxresults=" +
      5 +
      "&country=VNM" +
      "&apiKey=" +
      hereKeyAPI
    );
  };

  const searchLocation = async (value) => {
    if (timeOutSearch) clearTimeout(timeOutSearch);
    timeOutSearch = setTimeout(async () => {
      if (value.length == 0) {
        setSearchResult([]);
        return;
      }

      if (canSearch.current && value.length > 2) {
        canSearch.current = false;
        setSearching(true);

        console.log("-------------------LOADNG", value);
        const response = await axios.get(renderUrl(value));
        const data = response.data;
        setSearchResult(data.suggestions);
        setSearching(false);
        console.log("-------------------FINISH LOADNG", value);
      }
    }, 1000);
  };

  const renderItem = (item) => {
    const { street, district, city, country, label } = item.address
      ? item.address
      : {};

    const labelLocation = street
      ? street
      : district
      ? district
      : city
      ? city
      : null;
    const describe = `${street ? street + ", " : ""}${
      district ? district + ", " : ""
    }${city ? city : ""}`;
    return (
      <View style={styles.itemLocation}>
        <Entypo
          name="location-pin"
          style={[
            styles.typeIcon,
            { color: "black", fontSize: 18, paddingLeft: 0 },
          ]}
        ></Entypo>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("MapScreen", {
              type: "SEARCH",
              payload: {
                location: item,
                labelLocation: describe,
              },
            });
          }}
        >
          <Text style={styles.label}>{labelLocation}</Text>
          <Text style={styles.describeItem}>{describe}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // const searchLocation = async (value) => {
  //   if (value.length == 0) {
  //     setSearchResult([]);
  //     return;
  //   }
  //   if (canSearch.current && value.length > 2) {
  //     canSearch.current = false;

  //     setSearching(true);
  //     console.log("-------------------LOADNG", value);
  //     const response = await axios.get(renderUrl(value));
  //     console.log("-------------------FINISH LOADNG", value);
  //     await delay(1000);
  //     setSearching(false);

  //     const data = response.data;
  //     setSearchResult(data.suggestions);

  //     console.log("CURRENT - PRE", textRef.current, value);
  //     await delay(1000);
  //     if (textRef.current != value) {
  //       console.log("Continue to search", textRef.current);
  //       searchLocation(textRef.current);
  //     }
  //   }
  // };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.headerContainer}>
        <View style={styles.boxSeach}>
          <Entypo name="location-pin" style={styles.typeIcon}></Entypo>
          <TextInput
            placeholder="Search for a location"
            placeholderTextColor={color.gray5}
            autoFocus={true}
            style={styles.type}
            onChangeText={(value) => {
              textRef.current = value;
              searchLocation(textRef.current);
            }}
          />
        </View>

        <View style={{ flexDirection: "row", marginVertical: 12 }}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("MapScreen", {
                type: "SEARCH_VIA_MAP",
              });
            }}
          >
            <LinearGradient
              colors={gradient.aqua_splash}
              start={[0, 0]}
              end={[1, 1]}
              style={styles.selectViaMap}
            >
              <FontAwesome5 name="map-marked" size={12} color="white" />
              <Text style={{ fontSize: 13, marginLeft: 5, color: "white" }}>
                {" "}
                Select Via Map
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.listContainer}>
        {searching ? (
          <View style={{ marginVertical: 10 }}>
            <ContentLoader
              speed={1}
              width="100%"
              height={70}
              backgroundColor={color.gray1}
              foregroundColor="#ffffff"
            >
              <Rect x="20" y="10" rx="5" ry="5" width="20%" height="10" />
              <Rect x="20" y="30" rx="5" ry="5" width="100%" height="10" />
              <Rect x="20" y="50" rx="5" ry="5" width="100%" height="10" />
            </ContentLoader>
            <View
              style={{
                height: 1,
                width: "100%",
                backgroundColor: color.gray2,
                marginTop: 20,
              }}
            ></View>
            <ContentLoader
              speed={1}
              width="100%"
              height={70}
              backgroundColor={color.gray1}
              foregroundColor="#ffffff"
            >
              <Rect x="20" y="10" rx="5" ry="5" width="20%" height="10" />
              <Rect x="20" y="30" rx="5" ry="5" width="100%" height="10" />
              <Rect x="20" y="50" rx="5" ry="5" width="100%" height="10" />
            </ContentLoader>
            <View
              style={{
                height: 1,
                width: "100%",
                backgroundColor: color.gray2,
                marginTop: 20,
              }}
            ></View>
            <ContentLoader
              speed={1}
              width="100%"
              height="100%"
              backgroundColor={color.gray1}
              foregroundColor="#ffffff"
            >
              <Rect x="20" y="10" rx="5" ry="5" width="20%" height="10" />
              <Rect x="20" y="30" rx="5" ry="5" width="100%" height="10" />
              <Rect x="20" y="50" rx="5" ry="5" width="100%" height="10" />
            </ContentLoader>
          </View>
        ) : (
          <FlatList
            keyExtractor={(item) => item.locationId}
            data={searchResult}
            renderItem={({ item }) => renderItem(item)}
          />
        )}
      </View>
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: color.gray2,
  },
  boxSeach: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: color.gray0,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: color.gray2,
    padding: 8,
    marginVertical: 5,
  },
  typeIcon: {
    paddingHorizontal: 10,
    fontSize: 22,
    color: color.blueModern2,
  },
  type: {
    fontSize: 16,
  },
  selectViaMap: {
    flexDirection: "row",
    borderRadius: 25,
    borderColor: color.gray2,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  itemLocation: {
    flexDirection: "row",
    paddingVertical: 22,
    borderBottomWidth: 1,
    borderBottomColor: color.gray2,
  },
  label: {
    fontWeight: "bold",
    paddingBottom: 3,
    fontSize: 16,
  },
  describeItem: {
    color: color.gray6,
    fontSize: 14,
  },
});
