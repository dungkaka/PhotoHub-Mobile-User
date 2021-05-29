import React, { useEffect, useState, useRef } from "react";
import { useDidMountEffect } from "./../../../utils/custom-hook";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getListImage } from "../../../redux/actions/list_image";
import ImageThumbnail from "./ImageThumbnail";
import { useHeaderHeight } from "@react-navigation/stack";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import { color } from "../../../utils/f";
import ReloadPage from "../../Common/ReloadPage";

const background = require("./../../../assets/images/logo-2.png");

const LoadingIcon = ({ isIconAnimating }) => (
  <ActivityIndicator
    size="large"
    color="#gray"
    style={{ marginVertical: 5 }}
    animating={isIconAnimating}
  />
);

const HubContainer = ({ drawerAppNavigation, route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const headerHeight = useHeaderHeight();

  const imageList = useSelector((store) => store.listImage);

  const { listImage, pageIndex, error } = useSelector(
    (store) => store.listImage
  );

  const [fetching, setFetching] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(true);
  const tags = useRef([]);

  useEffect(() => {
    dispatch(getListImage(tags.current, ""));
  }, []);

  // Case Tags selector
  useDidMountEffect(() => {
    console.log("PARAMS", route.params);
    const routeTags = route.params ? route.params.tags : [];
    if (routeTags) {
      tags.current = routeTags;
      handleTagsChange();
    }
  }, [route]);

  // When listImage change, actually completed fetching image, set Loading = false
  useDidMountEffect(() => {
    if (fetching) setFetching(false);
    if (fetchingMore) setFetchingMore(false);
  }, [imageList]);

  // Case Tags change
  const handleTagsChange = () => {
    handleRefresh();
  };

  // When refersh data of List
  const handleRefresh = () => {
    setFetching(true);
    dispatch(getListImage(tags.current, ""));
  };

  // Fetch more data append to List
  const fetchMore = () => {
    if (!fetching && !fetchingMore && pageIndex > 0) {
      setFetchingMore(true);
      const afterID = listImage[listImage.length - 1].id;
      dispatch(getListImage(tags.current, afterID));
    }
  };

  return (
    <View style={{ marginTop: 15, flex: 1 }}>
      {/* Custom Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          marginTop: StatusBar.currentHeight,
        }}
      >
        <TouchableOpacity
          style={{ paddingHorizontal: 20 }}
          onPress={() => {
            drawerAppNavigation.openDrawer();
          }}
        >
          <AntDesign name="menufold" size={26} color={color.blueModern1} />
        </TouchableOpacity>

        <View
          style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              paddingEnd: 20,
            }}
          >
            <Image
              source={background}
              style={{
                maxHeight: 35,
                width: "auto",
                aspectRatio: 1,
              }}
              resizeMode="contain"
            />
          </View>
          {tags.current.length == 0 ? null : (
            <TouchableOpacity
              onPress={() => {
                navigation.setParams({
                  tags: [],
                  fromCategory: false,
                  fromTagSelector: false,
                });
              }}
              style={{ justifyContent: "center" }}
            >
              <Text
                style={{
                  marginHorizontal: 8,
                  backgroundColor: color.blueModernDark,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  fontSize: 14,
                  fontWeight: "bold",
                  color: "white",
                  borderRadius: 10,
                  textAlignVertical: "center",
                }}
              >
                RESET
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter */}

      <View
        style={{
          marginHorizontal: 10,
          marginBottom: 6,
          marginTop: 14,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("Category")}
            style={{
              justifyContent: "center",
              backgroundColor: color.blueModernDark,
              paddingHorizontal: 15,
              paddingVertical: 4,
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                textAlignVertical: "center",
                fontSize: 14,
                fontWeight: "bold",
                color: "white",
              }}
            >
              CATEGORY
            </Text>
          </TouchableOpacity>
          <View
            style={{
              justifyContent: "center",
              backgroundColor: color.redOrange,
              paddingHorizontal: 15,
              paddingVertical: 4,
              borderRadius: 10,
              marginLeft: 5,
            }}
          >
            <Text
              style={{
                textAlignVertical: "center",
                fontSize: 14,
                fontWeight: "bold",
                color: "white",
                textTransform: "capitalize",
              }}
            >
              {route.params
                ? route.params.fromCategory
                  ? route.params.tags[0]
                  : route.params.fromTagSelector
                  ? "Poses from filter"
                  : "All Poses"
                : "All Poses"}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "flex-end",
            marginEnd: 4,
          }}
          onPress={() => navigation.openDrawer()}
        >
          <Text style={{ color: color.blueModernDark, marginHorizontal: 1 }}>
            {" "}
            Filter{" "}
          </Text>
          <FontAwesome
            name="filter"
            size={22}
            color={color.blueModernDark}
          ></FontAwesome>
        </TouchableOpacity>
      </View>

      {error ? (
        <ReloadPage
          onReload={handleRefresh}
          error={error}
          exLoading={fetching}
        />
      ) : (
        <FlatList
          style={{ margin: 4, marginBottom: 0 }}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          data={listImage}
          renderItem={({ item }) => (
            <ImageThumbnail
              image={item}
              width={200}
              height={200}
              spaceBetween={5}
            ></ImageThumbnail>
          )}
          onRefresh={handleRefresh}
          refreshing={fetching}
          // extraData={fetching}
          onEndReached={fetchMore}
          onEndReachedThreshold={5}
          ListFooterComponent={() =>
            fetchingMore && !fetching ? (
              <LoadingIcon isIconAnimating={true}></LoadingIcon>
            ) : null
          }
        />
      )}
    </View>
  );
};

export default HubContainer;
