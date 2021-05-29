import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import request from "./../../../utils/axios";
import { URL } from "./../../../configs/end-points-url";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

const collectionEmpty =
  "https://firebasestorage.googleapis.com/v0/b/photohub-e7e04.appspot.com/o/assets%2Fcollection-empty.jpg?alt=media&token=d41df555-fb95-4b8a-9951-a7ffe06f5cca";

const categoryThumnail = {
  posture: require("./../../../assets/category/posture.jpg"),
  costume: require("./../../../assets/category/costume.jpg"),
  number: require("./../../../assets/category/number.jpg"),
  accessories: require("./../../../assets/category/accessories.jpg"),
  background: require("./../../../assets/category/background.jpg"),
  gender: require("./../../../assets/category/gender.jpg"),
  age: require("./../../../assets/category/age.jpg"),
  topic: require("./../../../assets/category/topic.jpg"),
  splash: require("./../../../assets/images/splash.png"),
};

const Category = () => {
  const navigation = useNavigation();
  const categories = useSelector((store) => store.tags.tags);
  const [error, setError] = useState(false);

  useEffect(() => {
    // getTags();
  }, []);

  const getTags = async () => {
    try {
      const response = await request.server.get(URL.GET_TAGS());
      if (response.data?.status == true) {
        setCategories(response.data.tags);
      } else {
        throw new Error("Try again !");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        {categories.map((item) => {
          return (
            <View style={styles.categoryContainer} key={item.category}>
              <TouchableOpacity
                style={styles.categoryView}
                onPress={() =>
                  navigation.navigate("HubContainer", {
                    tags: [item.category],
                    fromCategory: true,
                    fromTagSelector: false,
                  })
                }
              >
                <Image
                  source={categoryThumnail[item.category]}
                  style={{
                    height: "100%",
                    width: "100%",
                  }}
                  resizeMode="cover"
                ></Image>
                <Text style={styles.categoryName}> {item.category} </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default Category;

const styles = StyleSheet.create({
  container: {
    padding: 4,
    flex: 1,
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  categoryContainer: {
    width: "50%",
    height: 150,
    padding: 4,
  },
  categoryView: {
    borderRadius: 10,
    overflow: "hidden",
  },
  categoryName: {
    position: "absolute",
    width: "100%",
    height: "100%",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textTransform: "capitalize",
  },
});
