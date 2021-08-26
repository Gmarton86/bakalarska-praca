import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";

const TextButton = (props) => {
  return (
    <Pressable
      onPress={props.onPressFunction}
      hitSlop={{ top: 10, bottom: 10, right: 10, left: 10 }}
      android_ripple={{ color: "#00000050" }}
      style={({ pressed }) => [
        { backgroundColor: pressed ? "#dddddd" : props.color },
        styles.button,
        { ...props.style },
      ]}
    >
      <Text style={styles.text}>{props.title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  text: {
    color: "#ffffff",
    fontSize: 20,
    marginRight: 10,
  },
  button: {
    width: 110,
    height: 50,
    alignItems: "flex-end",
    justifyContent: "center",
    backgroundColor: "#000000",
  },
});

export default TextButton;
