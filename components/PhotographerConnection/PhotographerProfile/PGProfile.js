import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Image,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { gradient } from "../../../utils/gradient";
import { color } from "../../../utils/f";
import { firestoreRef } from "../../../configs/firebase-config";

const W = Dimensions.get("window").width;
const H = Dimensions.get("window").height;
const avatar_1 =
  "https://firebasestorage.googleapis.com/v0/b/photohub-e7e04.appspot.com/o/avatar%2Favatar_1.jpg?alt=media&token=3efbdede-a9ca-4bd6-95f3-9cd9383e6379";
const cover = require("./../../../assets/category/background.jpg");

const HeaderBlock = () => (
  <View>
    <View style={styles.headerBlock}>
      {/* <LinearGradient
        colors={gradient.blue_purple}
        style={{ width: W, height: W, position: "absolute", bottom: 0 }}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
      /> */}
      <Image
        source={cover}
        style={{
          position: "absolute",
          bottom: -100,
          height: "50%",
          width: "50%",
        }}
        resizeMode="cover"
      ></Image>
    </View>
  </View>
);

const PGProfile = () => {
  const route = useRoute();
  const photographer = route.params?.photographer;
  const [publicCollection, setPublicCollection] = useState([]);

  useEffect(() => {
    const collectionRef = firestoreRef
      .collection("users")
      .doc(photographer.id)
      .collection("collections");
    const publicCollection = collectionRef
      .where("name", "==", "Problem")
      .get()
      .then((snapshot) => {
        let publicCLT = [];
        for (let doc of snapshot.docs) {
          publicCLT = [...publicCLT, ...doc.data().images_snippet];
        }
        setPublicCollection(publicCLT);
      });
  }, []);

  console.log("CLT", publicCollection);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <HeaderBlock></HeaderBlock>
          <View
            activeOpacity={0.9}
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              height: 100,
              width: W * 0.9,
              backgroundColor: "white",
              marginTop: -70,
              borderRadius: 50,
            }}
          >
            <Image
              style={{ height: 100, width: 100, borderRadius: 50 }}
              source={{
                uri: avatar_1,
              }}
            />
            <View style={{ paddingHorizontal: 15 }}>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 20,
                  letterSpacing: 0.5,
                  color: "#393d50",
                }}
              >
                {photographer
                  ? photographer.name
                    ? photographer.name
                    : photographer.username
                  : null}
              </Text>
              <Text style={{ color: color.gray6 }}>
                Gender: {photographer.gender}
              </Text>
              <Text style={{ color: color.gray6 }}>
                Age: {photographer.age}
              </Text>
              <Text style={{ color: color.gray6 }}>
                Email: {photographer.email}
              </Text>
            </View>
          </View>

          <View style={{ marginVertical: 10 }}>
            <Text>Public Collection</Text>
          </View>
          <View style={styles.containerCLT}>
            {publicCollection.map((image) => (
              <View style={styles.containerChild} key={image.image_id}>
                <View>
                  <Image
                    source={{
                      uri: image.thumbnail_url,
                      height: "100%",
                      width: "100%",
                    }}
                    resizeMode="cover"
                  ></Image>
                  <Text>{image.image_id}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PGProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },

  headerBlock: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: -W * 1.35,
    width: W * 2,
    height: W * 2,
    backgroundColor: "transparent",
    borderRadius: W * 0.8,
    overflow: "hidden",
  },

  containerCLT: {
    padding: 2,
    flex: 1,
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  containerChild: {
    width: "33%",
    height: 105,
    padding: 2,
  },
});
