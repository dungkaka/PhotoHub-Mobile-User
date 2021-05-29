import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Image,
  Dimensions,
  KeyboardAvoidingView,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import Polyline from "@mapbox/polyline";
import { useDidMountEffect } from "./../../../utils/custom-hook";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import ModalSearch from "./ModalSearch";
import ModalResult from "./ModalResult";
import { useRoute, useNavigation } from "@react-navigation/native";
import { delay } from "../../../utils/f";
import { hereKeyAPI, directionKey } from "../../../configs/placeAPI";
import axios from "axios";
import request from "./../../../utils/axios";
import { URL } from "./../../../configs/end-points-url";
import ModalLoading from "./ModelLoading";
import ModalSearchbySelect from "./ModalSearchBySelect";
import { ScrollView } from "react-native-gesture-handler";
import { haversine_distance } from "./../../../utils/map";
import { decode } from "./../../../utils/decode-polyline";
import { color } from "./../../../utils/f";
import customAlert from "./../../Common/CustomAlert/index";
const window = Dimensions.get("window");

const photographer = (
  <Image
    source={require("./../../../assets/images/marker-2.png")}
    style={{
      height: 55,
      width: 25,
    }}
    resizeMode="contain"
  />
);

const markerRegion = (
  <View style={{ bottom: -10 }}>
    <Image
      source={require("./../../../assets/images/marker-1.png")}
      style={{
        height: 60,
        width: 25,
      }}
      resizeMode="contain"
    />
  </View>
);

const MapScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const regionRef = useRef({
    longitude: 106.2,
    latitude: 21.45,
    longitudeDelta: 0.015,
    latitudeDelta: 0.015,
  });

  const mapRef = useRef(null);
  const [labelSearch, setLabelSearch] = useState(false);
  const [locationSearch, setLocationSearch] = useState(null);
  const [nears, setNears] = useState([]);
  const [tempDirection, setTempDirection] = useState({ coords: [] });

  const [switchLocationSearch, setSwitchLocationSearch] = useState(false);
  const modalSearchRef = useRef();
  const modalSearchingRef = useRef();
  const modalSearchBySelectRef = useRef();
  const modalResult = useRef();
  const askedPermission = useRef();
  const currentPosition = useRef();

  useEffect(() => {
    modalSearchRef.current.open();
  }, []);

  useEffect(() => {
    const { type, payload } = route.params ? route.params : {};
    switch (type) {
      case "SEARCH":
        handleSearchByAddress(payload);
        break;
      case "SEARCH_VIA_MAP":
        openSelectSearch();
        break;
      default:
        break;
    }
  }, [route]);

  useDidMountEffect(() => {
    if (locationSearch) {
      setTimeout(() => fitNears(locationSearch), 1000);
      if (nears.length == 0)
        goToRegion({
          ...regionRef.current,
          longitudeDelta: 0.05,
          latitudeDelta: 0.05,
        });
      else
        goToRegion({ ...regionRef.current, ...locationSearch }, () =>
          setSwitchLocationSearch(true)
        );
    }
  }, [nears, locationSearch]);

  const goToRegion = useCallback((region, callback) => {
    mapRef.current.animateToRegion(region, 1000);
    setTimeout(() => {
      if (callback) {
        callback();
      }
    }, 1000);
  });

  const searchAdressByLocation = useCallback(async (location) => {
    const searchUrl =
      "https://reverse.geocoder.ls.hereapi.com/6.2/reversegeocode.json?" +
      "&mode=retrieveAddresses" +
      "&maxresults=1&gen=9" +
      "&prox=" +
      location.latitude +
      "," +
      location.longitude +
      "," +
      "250" +
      "&apiKey=" +
      hereKeyAPI;

    axios
      .get(searchUrl)
      .then((response) => {
        const data = response.data.Response.View[0].Result[0].Location.Address;
        const { Street, District, City } = data ? data : {};

        const labelLocation = `${Street ? Street + ", " : ""}${
          District ? District + ", " : ""
        }${City ? City : ""}`;

        setLabelSearch(labelLocation);
      })
      .catch((error) =>
        setLabelSearch(
          "Can not display places now! Try again to display adrress"
        )
      );
  });

  // 1. Handle search By Click on Search Your Location
  const searchMyLocation = useCallback(async () => {
    try {
      modalSearchRef.current.close();
      modalSearchingRef.current.open();
      const location = await askPermision("ASK");
      searchAdressByLocation(location);
      await searchNears(location);
    } catch (error) {
      customAlert(
        error.message,
        () => reset(),
        () => reset()
      );
    }
  });

  // 2. Handle Search Via map
  const handleSearchViaMap = useCallback(async () => {
    try {
      modalSearchBySelectRef.current.close();
      modalSearchingRef.current.open();
      searchAdressByLocation(regionRef.current);
      await searchNears(regionRef.current);
    } catch (error) {
      customAlert(
        error.message,
        () => reset(),
        () => reset()
      );
    }
  });

  // 3. Handle Search By Address. From type search address screen.
  const handleSearchByAddress = useCallback(async (payload) => {
    try {
      modalSearchRef.current.close();
      modalSearchingRef.current.open();
      setLabelSearch(payload.labelLocation);

      const data = await searchLocation(payload.location);
      await searchNears(data);
    } catch (error) {
      customAlert(
        error.message,
        () => reset(),
        () => reset()
      );
    }
  });

  // For handle Search By Address. Need to retrieve location of address to display new region
  const searchLocation = useCallback(async (location) => {
    try {
      const locationId = location.locationId;
      const searchUrl =
        "https://geocoder.ls.hereapi.com/6.2/geocode.json?locationid=" +
        locationId +
        "&jsonattributes=1&gen=9&apiKey=" +
        hereKeyAPI;
      const response = await axios.get(searchUrl);
      const data =
        response.data.response.view[0].result[0].location.displayPosition;

      regionRef.current = { ...regionRef.current, ...data };
      return data;
    } catch (error) {
      throw new Error("Can not retriev location now! Try again");
    }
  });

  const searchNears = useCallback(async (coords) => {
    try {
      const response = await request.server.post(
        URL.SEARCH_NEARBY(),
        {
          coords: {
            latitude: coords.latitude,
            longitude: coords.longitude,
          },
        },
        {
          cancelToken: new axios.CancelToken((cancel) =>
            setTimeout(cancel, 20000)
          ),
        }
      );

      const data = response.data;

      if (data.status) {
        const nears = [];
        data.locations.forEach((location) => {
          if (haversine_distance(location, coords) < 5) nears.push(location);
        });
        setLocationSearch(coords);
        setNears(nears);
      } else {
        throw new Error(data.message);
      }

      modalSearchBySelectRef.current.close();
      modalSearchingRef.current.close();
      await delay(100);
      modalResult.current.open();
    } catch (error) {
      if (axios.isCancel(error)) throw new Error("Timeout, try again !");
      throw new Error(error.message);
    }
  });

  const openSelectSearch = useCallback(async () => {
    modalSearchRef.current.close();
    modalSearchBySelectRef.current.open();
  });

  const renderMarkers = useCallback(() => {
    return (
      <View>
        {nears.map((near, idx) => {
          return (
            <Marker
              key={idx}
              coordinate={near}
              title={near.photographerInfor.name}
              description="I'm photographer"
            >
              {photographer}
            </Marker>
          );
        })}
      </View>
    );
  });

  const askPermision = useCallback(async (method = "GET") => {
    try {
      if (!askedPermission.current) {
        await delay(400);
        const { status: existingStatus } = await Permissions.getAsync(
          Permissions.LOCATION
        );
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
          const { status } = await Permissions.askAsync(
            Permissions.NOTIFICATIONS
          );
          finalStatus = status;
        }
        if (finalStatus !== "granted") {
          throw new Error("No permission to access LOCATION");
        } else {
          askedPermission.current = true;
          currentPosition.current = await Location.getCurrentPositionAsync();
        }
      } else {
        currentPosition.current = await Location.getLastKnownPositionAsync();
      }
      regionRef.current = {
        ...regionRef.current,
        ...currentPosition.current.coords,
      };

      if (method == "GET")
        goToRegion({ ...regionRef.current, ...currentPosition.current.coords });
      return currentPosition.current.coords;
    } catch (error) {
      throw new Error(error.message);
    }
  });

  const onRegionChangeComplete = (region) => {
    regionRef.current = region;
    // setRegion(region);
  };

  const reset = useCallback(() => {
    modalSearchingRef.current.close();
    modalResult.current.close();
    modalSearchBySelectRef.current.close();
    modalSearchRef.current.open();

    setSwitchLocationSearch(false);
    setLocationSearch(null);
    setNears([]);
    setLabelSearch(false);
    setTempDirection({ coords: [] });
  });

  const fitNears = useCallback((locationSearch) => {
    const { latitude, longitude } = locationSearch;
    if (nears.length > 0) {
      const oppositeNears = [];
      for (const near of nears) {
        const oppositeNear = {
          latitude: latitude * 2 - near.latitude,
          longitude: longitude * 2 - near.longitude,
        };
        oppositeNears.push(oppositeNear);
      }

      mapRef.current.fitToCoordinates([...nears, ...oppositeNears], {
        edgePadding: {
          top: window.height * 1.3 * 0.55,
          right: 20,
          left: 20,
          bottom: window.height * 1.3 * 0.55,
        },
        animated: true,
      });
    }
  });

  const getDirections = useCallback(async (start, des) => {
    const hasStartAndEnd = start.latitude !== null && des.latitude !== null;

    if (hasStartAndEnd) {
      const concatStart = `${start.latitude},${start.longitude}`;
      const concatEnd = `${des.latitude},${des.longitude}`;
      _getDirections(concatStart, concatEnd);
      mapRef.current.fitToCoordinates([start, des], {
        edgePadding: {
          top: window.height * 1.3 * 0.65,
          right: 20,
          left: 20,
          bottom: window.height * 1.3 * 0.65,
        },
        animated: true,
      });
    }
  });

  const _getDirections = async (startLoc, desLoc) => {
    const url = `https://router.hereapi.com/v8/routes?transportMode=car&origin=${startLoc}&destination=${desLoc}&return=polyline&apiKey=dUJ5QATKNp_h_OfYqzZVrEUC8ajdw09Cm3xLcA1qIYg`;
    const res = await axios.get(url);
    const data = res.data;
    console.log("DATA", data);
    const route = data.routes[0];
    console.log("ROUTE", route);
    if (route) {
      const points = decode(route.sections[0].polyline);
      const coords = points.polyline.map((point) => {
        return {
          latitude: point[0],
          longitude: point[1],
        };
      });
      setTempDirection({ coords });
    }
    return coords;
  };

  // const _getDirections = async (startLoc, desLoc) => {
  //   try {
  //     const resp = await fetch(
  //       `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${desLoc}&key=${directionKey}`
  //     );

  //     const respJson = await resp.json();
  //     const response = respJson.routes[0];
  //     console.log("RES", response);
  //     const distanceTime = response.legs[0];
  //     const distance = distanceTime.distance.text;
  //     const time = distanceTime.duration.text;
  //     const points = Polyline.decode(
  //       respJson.routes[0].overview_polyline.points
  //     );
  //     const coords = points.map((point) => {
  //       return {
  //         latitude: point[0],
  //         longitude: point[1],
  //       };
  //     });
  //     setTempDirection({ coords, distance, time });
  //   } catch (error) {
  //     console.log("Error: ", error);
  //   }
  // };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      enabled={false}
      style={{ flex: 1, justifyContent: "flex-end" }}
    >
      <MapView
        ref={(ref) => (mapRef.current = ref)}
        moveOnMarkerPress={false}
        // loadingEnabled={searching}
        rotateEnabled={true}
        showsUserLocation={true}
        pointerEvents="none"
        initialRegion={regionRef.current}
        style={{
          position: "absolute",
          height: window.height * 1.3,
          width: window.width,
          bottom: 0,
        }}
        onRegionChangeComplete={onRegionChangeComplete}
      >
        {switchLocationSearch ? (
          <Marker key={123456} coordinate={locationSearch}>
            {markerRegion}
          </Marker>
        ) : null}
        {renderMarkers()}
        <MapView.Polyline
          strokeWidth={3}
          strokeColor={color.blueModern1}
          coordinates={tempDirection.coords}
        />
      </MapView>

      {!switchLocationSearch ? (
        <View style={styles.markerFake}>{markerRegion}</View>
      ) : null}

      <ModalSearch
        ref={modalSearchRef}
        location={route.params}
        labelSearch={labelSearch}
        getMyLocation={askPermision}
        searchMyLocation={searchMyLocation}
      />

      <ModalLoading ref={modalSearchingRef} />

      <ModalSearchbySelect
        ref={modalSearchBySelectRef}
        searchRegion={handleSearchViaMap}
        reset={reset}
      />

      <ModalResult
        reset={reset}
        ref={modalResult}
        nears={nears}
        labelSearch={labelSearch}
        locationSearch={locationSearch}
        getDirections={getDirections}
      />
    </KeyboardAvoidingView>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  markerFake: {
    left: "50%",
    marginLeft: -13,
    marginTop: -56,
    position: "absolute",
    top: window.height * 0.35,
  },
});
