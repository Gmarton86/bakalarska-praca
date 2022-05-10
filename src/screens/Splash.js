import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";

const Splash = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace("Home");
    }, 2000);
  }, []);

  return (
    <View style={styles.body}>
      <Image style={styles.logo} source={require("../../assets/logo.png")} />
      <Text style={styles.text}>Table Tennis Tournament</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  logo: {
    width: 150,
    height: 150,
    margin: 20,
    alignSelf: "center",
  },
  text: {
    fontSize: 30,
    color: "#000000",
  },
});

export default Splash;
