import React from "react";
import { StyleSheet, Text, View } from "react-native";
import BackButton from "../utils/backButton";

export default function Create({ navigation }) {
  const visitHome = () => {
    navigation.replace("Home");
  };

  return (
    <View>
      <View style={styles.backButton}>
        <BackButton title="back" onPressFunction={visitHome} />
      </View>
      <Text>TTT creation</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "flex-start",
  },
});
