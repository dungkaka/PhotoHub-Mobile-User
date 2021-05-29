import React, { useState } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import DrawerContent from "./DrawerContent";
import styles from "./index.style";
import { ImageBackground, Text } from "react-native";

// import the screen
import About from "../components/About/index";
import PhotoHub from "../components/PhotoHub/index";
import Animated from "react-native-reanimated";
import Collection from "./../components/Collection/index";
import PhotographerConnection from "../components/PhotographerConnection";
import QRCode from "./../components/QRCode/index";

// const image = require("./../assets/images/backround-1.png");
const Drawer = createDrawerNavigator();

const App = ({ navigation }) => {
  const [progress, setProgress] = useState(new Animated.Value(0));
  // create animation for screen scale
  const scale = Animated.interpolate(progress, {
    inputRange: [0, 1],
    outputRange: [1, 0.8],
  });
  const borderRadius = Animated.interpolate(progress, {
    inputRange: [0, 1],
    outputRange: [0, 10],
  });

  const fade = Animated.interpolate(progress, {
    inputRange: [0, 1],
    outputRange: [1, 0.8],
  });

  const animatedStyle = {
    borderRadius,
    // opacity: fade,
    transform: [{ scale }],
  };

  return (
    <ImageBackground
      source={require("./../assets/images/background-back.jpg")}
      resizeMode="cover"
      style={{
        flex: 1,
      }}
    >
      <Drawer.Navigator
        drawerType="slide"
        overlayColor="transparent"
        contentContainerStyle={{ flex: 1 }}
        drawerStyle={styles.drawerStyles}
        drawerContentOptions={{
          activeBackgroundColor: "transparent",
          activeTintColor: "white",
          inactiveTintColor: "white",
        }}
        sceneContainerStyle={{ backgroundColor: "transparent" }}
        initialRouteName="PhotoHub"
        drawerContent={(props) => {
          setProgress(props.progress);
          return <DrawerContent {...props} rootNavigation={navigation} />;
        }}
      >
        <Drawer.Screen name="PhotoHub">{(props) => <PhotoHub {...props} style={animatedStyle} />}</Drawer.Screen>
        <Drawer.Screen name="Collection">{(props) => <Collection {...props} style={animatedStyle} />}</Drawer.Screen>
        <Drawer.Screen name="PhotographerConnection">
          {(props) => <PhotographerConnection {...props} style={animatedStyle} />}
        </Drawer.Screen>
        <Drawer.Screen name="QRCode">{(props) => <QRCode {...props} style={animatedStyle} />}</Drawer.Screen>
        <Drawer.Screen name="About" component={About} />
      </Drawer.Navigator>
    </ImageBackground>
  );
};

export default App;
