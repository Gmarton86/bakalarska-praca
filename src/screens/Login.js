import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import CustomButton from "../utils/customButton";
import BackButton from "../utils/backButton";
import { emailValidator } from "../helpers/emailValidator";
import { passwordValidator } from "../helpers/passwordValidator";

export default function Login({ navigation }) {
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });

  const onLoginPressed = () => {
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }
    //after successful login
    navigation.replace("Create");
  };

  const visitHome = () => {
    navigation.replace("Home");
  };

  return (
    <View style={styles.body}>
      <BackButton goBack={visitHome} />
      <Text style={styles.text}>Zadaj svoje uživateľské meno:</Text>
      <TextInput
        style={styles.input}
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: "" })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <Text style={styles.text}>Zadaj svoje heslo:</Text>
      <TextInput
        style={styles.input}
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: "" })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate("ResetPasswordScreen")}
        >
          <Text style={styles.forgot}>Zabudol si heslo?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.forgot}>Zaregistruj sa</Text>
        </TouchableOpacity>
      </View>

      <CustomButton
        title="Potvrdiť"
        color="#1eb900"
        style={{ width: "30%" }}
        onPressFunction={onLoginPressed}
      />
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
  forgotPassword: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
});
