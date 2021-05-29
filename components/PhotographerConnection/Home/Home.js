import React from "react";
import {
  Text,
  StyleSheet,
  Dimensions,
  View,
  ImageBackground,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import {
  AntDesign,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import customAlert from "./../../Common/CustomAlert/index";

const W = Dimensions.get("window").width;
const H = Dimensions.get("window").height;

const ICON_SIZE = 28;

const HeaderBlock = () => (
  <View>
    <LinearGradient
      colors={["#34c5a7", "#4f85d5"]}
      style={styles.headerBlock}
      start={{ x: 0.0, y: 0.25 }}
      end={{ x: 0.5, y: 1.0 }}
    />
  </View>
);

const Item = ({ text, icon, color1, color2, onPress }) => (
  <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
    <LinearGradient
      start={{ x: 0.0, y: 0.25 }}
      end={{ x: 0.5, y: 1.0 }}
      locations={[0, 0.75]}
      colors={[color1, color2]}
      style={styles.iconContainer}
    >
      {icon}
    </LinearGradient>
    <View style={styles.textContainer}>
      <Text style={[styles.text, { color: color2 }]}>{text}</Text>
    </View>
  </TouchableOpacity>
);

const Home = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("./../../../assets/images/background-1.jpg")}
        resizeMode="cover"
        style={{
          flex: 1,
        }}
      >
        <View style={styles.container}>
          <HeaderBlock />

          <View flex={1} style={{ backgroundColor: "transparent" }}></View>
          <View style={styles.headerTextContainer}>
            <View height={20} />
            <Text style={styles.headerText}>SEARCH CAMERAMAN</Text>
            <View height={5} />
            <Text style={styles.subHeaderText}>Let's have fun !</Text>
          </View>

          <View style={styles.block}>
            <View style={styles.row}>
              <Item
                onPress={() => navigation.navigate("MapScreen")}
                color1="#1D976C"
                color2="#93F9B9"
                text="Search"
                icon={
                  <AntDesign
                    name="search1"
                    size={ICON_SIZE}
                    style={styles.icon}
                  />
                }
              />
              <Item
                onPress={() => navigation.navigate("ChatActive")}
                color1="#E94057"
                color2="#F27121"
                text="Active Chat"
                icon={
                  <AntDesign
                    name="message1"
                    size={ICON_SIZE}
                    style={styles.icon}
                  />
                }
              />
            </View>
            <View style={styles.row}>
              <Item
                onPress={() => navigation.navigate("ChatInActive")}
                color1="#2193b0"
                color2="#6dd5ed"
                text="History"
                icon={
                  <MaterialCommunityIcons
                    name="message-bulleted-off"
                    size={ICON_SIZE}
                    style={styles.icon}
                  />
                }
              />
              <Item
                onPress={() =>
                  customAlert("Feature will be implemented in near future!")
                }
                color1="#6a3093"
                color2="#a044ff"
                text="Bills"
                icon={
                  <FontAwesome
                    name="file-text"
                    size={ICON_SIZE}
                    style={styles.icon}
                  />
                }
              />
            </View>
            {/* <View style={styles.row}>
            <Item
              color1="#90caf9"
              color2="#2962ff"
              text="Entertainment"
              icon={
                <FontAwesome
                  name="youtube-play"
                  size={ICON_SIZE}
                  style={styles.icon}
                />
              }
            />
            <Item
              color1="#a5d6a7"
              color2="#00c853"
              text="Grocery"
              icon={
                <SvgIcon color="white" size={ICON_SIZE} data={groceryData} />
              }
            />
          </View> */}
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },

  headerBlock: {
    position: "absolute",
    marginLeft: -W * 0.6,
    marginTop: H * 0.6,
    width: W * 1.3,
    height: H * 0.7,
    backgroundColor: "#ff4081",
    borderRadius: 300,
    transform: [{ rotateX: "0deg" }, { rotateZ: "-45deg" }],
  },

  headerTextContainer: { margin: 30 },
  headerText: { color: "white", fontSize: 24, fontWeight: "700" },
  subHeaderText: { color: "white", fontSize: 16, fontWeight: "400" },

  block: {
    justifyContent: "flex-end",
  },

  row: {
    marginBottom: 24,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },

  iconContainer: {
    marginTop: 16,
    height: 72,
    width: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
  },

  icon: {
    color: "#ffffff",
  },

  itemContainer: {
    justifyContent: "space-evenly",
    alignItems: "center",
    width: W / 2 - 30,
    height: W / 2 - 20,
    backgroundColor: `rgba(60, 50, 100, 0.6)`,
    borderRadius: 24,
  },

  textContainer: {
    paddingVertical: 12,
  },

  text: { fontWeight: "700", fontSize: 16 },
});
