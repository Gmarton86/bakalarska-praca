import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import CustomButton from "../utils/customButton";
import BackButton from "../utils/backButton";

export default function Login({ navigation }) {
  const login = () => {
    //after successful login
    navigation.replace("Create");
  };

  const visitHome = () => {
    navigation.replace("Home");
  };

  return (
    <View style={styles.background}>
      <View style={styles.backButton}>
        <BackButton title="back" onPressFunction={visitHome} />
      </View>
      <View style={styles.body}>
        <Text style={styles.text}>Zadaj svoje uživateľské meno:</Text>
        <TextInput
          style={styles.input}
          placeholder="napr. stolnyTenis"
          maxLength={20}
        />
        <Text style={styles.text}>Zadaj svoje heslo:</Text>
        <TextInput style={styles.input} maxLength={30} secureTextEntry />

        <CustomButton
          title="Potvrdiť"
          color="#1eb900"
          style={{ width: "30%" }}
          onPressFunction={login}
        />
      </View>
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
  backButton: {
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  background: {
    flex: 1,
  },
});
