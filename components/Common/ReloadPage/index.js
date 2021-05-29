import React, { useState, useEffect } from "react";
import { View, Text, Button, ActivityIndicator } from "react-native";
import { color } from "./../../../utils/f";

const LoadingIcon = ({ isIconAnimating }) => (
  <ActivityIndicator
    size="large"
    color="#gray"
    style={{ marginVertical: 5 }}
    animating={isIconAnimating}
  />
);

const ReloadPage = ({ onReload, error, exLoading }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (exLoading == false) {
      setLoading(false);
    }
  }, [exLoading]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 50,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          textAlign: "center",
          color: color.gray8,
          textDecorationStyle: "dotted",
          fontStyle: "italic",
          marginBottom: 10,
        }}
      >
        Connection may not work right. Check your internet !
      </Text>

      <View style={{ height: 100, marginTop: 10 }}>
        {loading ? (
          <LoadingIcon isIconAnimating={loading}></LoadingIcon>
        ) : (
          <Button
            title="Reload"
            onPress={() => {
              setLoading(true);
              onReload();
            }}
          ></Button>
        )}
      </View>
    </View>
  );
};

export default ReloadPage;
