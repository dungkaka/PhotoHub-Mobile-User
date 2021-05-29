import React, { useState, useEffect, useMemo, useRef } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Button } from "react-native";
import request from "./../../../utils/axios";
import { URL } from "../../../configs/end-points-url";
import { ScrollView } from "react-native-gesture-handler";
import { styles } from "./index.style";
import Tag from "./Tag";
import { useSelector, useDispatch } from "react-redux";

const TagSelector = ({ navigation }) => {
  const tags = useSelector((store) => store.tags.tags);
  const dispatch = useDispatch();
  const [resetSelector, setResetSelector] = useState(false);
  const tagSelector = useRef([]);

  const getTags = async () => {
    try {
      const response = await request.server.get(URL.GET_TAGS());
      if (response.data?.status) {
        dispatch({
          type: "GET_TAGS_SUCCESS",
          payload: {
            tags: response.data.tags,
          },
        });
      } else {
        throw new Error("Error! Try again !");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getTags();
  }, []);

  const onSelectTag = (tag) => {
    // let newSelected = tagsSelector.filter((item) => item);
    let newSelected = tagSelector.current;
    const selected = newSelected.includes(tag.id);
    if (selected) {
      newSelected = newSelected.filter((item) => item != tag.id);
    } else {
      newSelected.push(tag.id);
    }
    // setTagsSelector(newSelected);
    tagSelector.current = newSelected;
  };

  const renderTag = (tag) => {
    return (
      <Tag
        key={tag.id}
        tag={tag}
        onSelect={onSelectTag}
        reset={resetSelector}
      ></Tag>
    );
  };

  const renderListCategory = (item) => {
    return (
      <View
        key={item.category}
        style={{
          paddingVertical: 10,
          borderBottomWidth: 1,
          borderBottomColor: "#ebebeb",
        }}
      >
        <View>
          <Text style={{ marginBottom: 3, color: "#0785b0" }}>
            {" "}
            {item.categoryName.en}{" "}
          </Text>
        </View>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {item.tags.map((tag) => renderTag(tag))}
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ margin: 15 }}>
        <View style={{ marginTop: 10 }}>
          <Text style={styles.tagTitle}> FILTER </Text>
        </View>
        <View>{tags.map((item) => renderListCategory(item))}</View>
      </ScrollView>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          marginEnd: 10,
          marginTop: -10,
          marginBottom: 10,
        }}
      >
        <TouchableOpacity
          style={[styles.button, styles.buttonReset]}
          onPress={() => {
            setResetSelector(!resetSelector);
            tagSelector.current = [];
          }}
        >
          <Text style={{ color: "#f74f31" }}> RESET </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.buttonConfirm]}
          onPress={() =>
            navigation.navigate("HubContainer", {
              tags: tagSelector.current,
              fromTagSelector: true,
              fromCategory: false,
            })
          }
        >
          <Text style={{ color: "white" }}> CONFIRM </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TagSelector;
