import React, {
  useRef,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import BottomSheet from "reanimated-bottom-sheet";
import { delay, color } from "../../../utils/f";
import { stickRef } from "./createRefModal";
const window = Dimensions.get("window");
import ContentLoader, {
  Rect,
  Circle,
  Facebook,
} from "react-content-loader/native";

const ModalLoading = forwardRef((props, ref) => {
  const refSearch = useRef();

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
      <View style={styles.contentContainer}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          Wait a moment ...
        </Text>

        <View style={{ marginVertical: 10 }}>
          <ContentLoader
            speed={1}
            width="100%"
            height="100%"
            backgroundColor={color.gray1}
            foregroundColor="#ffffff"
          >
            <Rect x="0" y="10" rx="5" ry="5" width="100%" height="10" />
            <Rect x="0" y="30" rx="5" ry="5" width="100%" height="10" />
            <Rect x="0" y="50" rx="5" ry="5" width="100%" height="10" />
            <Rect x="0" y="70" rx="5" ry="5" width="100%" height="10" />
          </ContentLoader>
        </View>
      </View>
    </View>
  );

  const renderContent = () => <View />;

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
        snapPoints={["30%", 0]}
        renderContent={renderContent}
        renderHeader={renderSearch}
        enabledGestureInteraction={false}
        enabledBottomInitialAnimation={true}
      />
    </View>
  );
});

export default stickRef(ModalLoading);

const styles = StyleSheet.create({
  headerContainer: {
    height: window.height * 0.5,
    width: "100%",
    backgroundColor: "transparent",
  },
  contentContainer: {
    backgroundColor: "white",
    flex: 1,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    paddingHorizontal: 30,
    paddingVertical: 20,
    elevation: 10,
  },
});
