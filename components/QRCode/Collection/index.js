import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useNavigation } from "@react-navigation/native";
import { URL } from "../../../configs/end-points-url";
import request from "../../../utils/axios";
import customAlert from "../../Common/CustomAlert";
const { width } = Dimensions.get("window");
import Spinner from "react-native-loading-spinner-overlay";
import { delay } from "../../../utils/f";
import * as axios from "axios";
const qrSize = width * 0.7;

export default function ScannerQR() {
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    (async () => {
      await delay(400);
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setFetching(true);
    setScanned(true);

    try {
      const response = await request.server.get(data, {
        cancelToken: new axios.CancelToken((cancel) =>
          setTimeout(cancel, 8000)
        ),
      });

      console.log("RES", response.data);
      if (response.data.status == true) {
        setFetching(false);

        navigation.push("QR Collection Detail", {
          collection: response.data.collection,
        });
      } else {
        setFetching(false);
        throw new Error("Invalid QR Code");
      }
    } catch (error) {
      setFetching(false);
      if (axios.isCancel(error)) return customAlert("Timeout, try again !");
      customAlert(error.message);
    }
  };

  if (hasPermission === null) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "black",
        }}
      >
        <Text style={{ color: "white" }}>Requesting for camera permission</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "black",
        }}
      >
        {customAlert("No access to camera")}
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      <Spinner
        visible={fetching}
        textStyle={{ color: "black" }}
        cancelable={true}
        animation="fade"
      />

      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={[StyleSheet.absoluteFillObject, styles.container]}
      >
        <View style={styles.layerTop}>
          <Text style={styles.description}>Scan your QR code</Text>
        </View>
        <View style={styles.layerCenter}>
          <View style={styles.layerLeft} />
          <View style={styles.focused} />
          <View style={styles.layerRight} />
        </View>
        <View style={styles.layerBottom}>
          {scanned && !fetching && (
            <TouchableOpacity
              style={styles.scanAgain}
              onPress={() => setScanned(false)}
            >
              <Text style={{ color: "white", fontSize: 20 }}>
                Tap To Scan Again
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </BarCodeScanner>
    </View>
  );
}
const opacity = "rgba(0, 0, 0, .6)";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  layerTop: {
    flex: 2,
    justifyContent: "flex-end",
    paddingBottom: 30,
    backgroundColor: opacity,
  },
  layerCenter: {
    flex: 3,
    flexDirection: "row",
  },
  layerLeft: {
    flex: 1,
    backgroundColor: opacity,
  },
  focused: {
    flex: 6,
  },
  layerRight: {
    flex: 1,
    backgroundColor: opacity,
  },
  layerBottom: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: opacity,
  },
  description: {
    fontSize: 26,
    textAlign: "center",
    color: "white",
  },
  scanAgain: {
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: `rgba(255,255,255, 0.1)`,
  },
});
