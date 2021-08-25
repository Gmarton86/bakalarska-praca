import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

export default function Login() {
  return (
    <View style={styles.body}>
      <Text style={styles.text}>Zadaj svoje uživateľské meno:</Text>
      <TextInput
        style={styles.input}
        placeholder="napr. stolnyTenis"
        maxLength={20}
      />
      <Text style={styles.text}>Zadaj svoje heslo:</Text>
      <TextInput style={styles.input} maxLength={30} secureTextEntry />
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#000000",
    fontSize: 22,
    fontStyle: "italic",
    margin: 5,
  },
  input: {
    borderWidth: 1,
    width: 300,
    borderRadius: 5,
    textAlign: "center",
    fontSize: 20,
  },
});
