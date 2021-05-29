import React from "react";
import { View, Text, useWindowDimensions } from "react-native";
import HubContainer from "./HubContainer";
import { createDrawerNavigator } from "@react-navigation/drawer";
import TagSelector from "./TagSelector";

const Drawer = createDrawerNavigator();

const Container = ({ drawerAppNavigation }) => {
  const dimensions = useWindowDimensions();
  const widthDrawer = Math.ceil(0.9 * dimensions.width);

  return (
    <Drawer.Navigator
      drawerPosition="right"
      drawerType={dimensions.width > 900 ? "permanent" : "front"}
      drawerStyle={{
        width: widthDrawer,
      }}
      drawerContent={(props) => {
        return <TagSelector {...props} />;
      }}
      sceneContainerStyle={{ backgroundColor: "transparent" }}
    >
      <Drawer.Screen name="HubContainer">
        {(props) => (
          <HubContainer {...props} drawerAppNavigation={drawerAppNavigation} />
        )}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
};

export default Container;
