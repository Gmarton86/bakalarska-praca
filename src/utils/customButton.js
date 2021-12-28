import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";

const CustomButton = (props) => {
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
    color: '#ffffff',
    fontSize: 20,
    letterSpacing: 1
  },
  button: {
    width: 110,
    height: 50,
    alignItems: 'center',
    backgroundColor: 'rgba(37, 99, 235, 1)',
    justifyContent: 'center',
    margin: 10,
    borderRadius: 10,
  },
})

export default CustomButton;
