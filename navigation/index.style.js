import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  stack: {
    flex: 1,
    shadowColor: "#FFF",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 1,
    shadowRadius: 10.32,
    elevation: 5,
    // overflow: 'scroll',
    // borderWidth: 1,
  },
  drawerStyles: { flex: 1, width: "50%", backgroundColor: "transparent" },
  drawerItem: { alignItems: "flex-start", marginVertical: 0, paddingStart: 10 },
  drawerLabel: {
    color: "white",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  avatar: {
    borderRadius: 60,
    marginBottom: 16,
    borderColor: "white",
    borderWidth: StyleSheet.hairlineWidth,
  },
});

export default styles;
