// import React, { useState } from "react";
// import {
//   View,
//   StyleSheet,
//   TouchableOpacity,
//   Text,
//   TextInput,
// } from "react-native";
// import BackButton from "../utils/backButton";
// import CustomButton from "../utils/customButton";
// import { emailValidator } from "../helpers/emailValidator";
// import { passwordValidator } from "../helpers/passwordValidator";
// import { nameValidator } from "../helpers/nameValidator";

// export default function Register({ navigation }) {
//   const [name, setName] = useState({ value: "", error: "" });
//   const [email, setEmail] = useState({ value: "", error: "" });
//   const [password, setPassword] = useState({ value: "", error: "" });

//   const onSignUpPressed = () => {
//     const nameError = nameValidator(name.value);
//     const emailError = emailValidator(email.value);
//     const passwordError = passwordValidator(password.value);
//     if (emailError || passwordError || nameError) {
//       setName({ ...name, error: nameError });
//       setEmail({ ...email, error: emailError });
//       setPassword({ ...password, error: passwordError });
//       return;
//     }
//     // navigation.reset({
//     //   index: 0,
//     //   routes: [{ name: "Dashboard" }],
//     // });
//   };

//   return (
//     <View>
//       <BackButton goBack={navigation.replace("Home")} />
//       <Text>Create Account</Text>
//       <TextInput
//         label="Name"
//         returnKeyType="next"
//         value={name.value}
//         onChangeText={(text) => setName({ value: text, error: "" })}
//         error={!!name.error}
//         errorText={name.error}
//       />
//       <TextInput
//         label="Email"
//         returnKeyType="next"
//         value={email.value}
//         onChangeText={(text) => setEmail({ value: text, error: "" })}
//         error={!!email.error}
//         errorText={email.error}
//         autoCapitalize="none"
//         autoCompleteType="email"
//         textContentType="emailAddress"
//         keyboardType="email-address"
//       />
//       <TextInput
//         label="Password"
//         returnKeyType="done"
//         value={password.value}
//         onChangeText={(text) => setPassword({ value: text, error: "" })}
//         error={!!password.error}
//         errorText={password.error}
//         secureTextEntry
//       />
//       <CustomButton
//         title="Potvrdiť"
//         color="#1eb900"
//         style={{ width: "30%", marginTop: 24 }}
//         onPressFunction={onSignUpPressed}
//       />

//       <View style={styles.row}>
//         <Text>Already have an account? </Text>
//         <TouchableOpacity onPress={() => navigation.replace("Login")}>
//           <Text style={styles.link}>Login</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   row: {
//     flexDirection: "row",
//     marginTop: 4,
//   },
//   link: {
//     fontWeight: "bold",
//   },
// });
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import BackButton from "../utils/backButton";
import { emailValidator } from "../helpers/emailValidator";
import { passwordValidator } from "../helpers/passwordValidator";
import { nameValidator } from "../helpers/nameValidator";
import CustomButton from "../utils/customButton";

export default function Register({ navigation }) {
  const [name, setName] = useState({ value: "", error: "" });
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });

  const onSignUpPressed = () => {
    const nameError = nameValidator(name.value);
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    if (emailError || passwordError || nameError) {
      setName({ ...name, error: nameError });
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }
    navigation.replace("Login");
    // navigation.reset({
    //   index: 0,
    //   routes: [{ name: "Dashboard" }],
    // });
  };
  return (
    <View style={styles.body}>
      <BackButton
        goBack={() => {
          navigation.replace("Home");
        }}
      />
      <Text style={styles.text}>Výtvorenie účtu</Text>
      <Text>Zadaj meno</Text>
      <TextInput
        style={styles.input}
        label="Name"
        returnKeyType="next"
        value={name.value}
        onChangeText={(text) => setName({ value: text, error: "" })}
        error={!!name.error}
        errorText={name.error}
      />
      <Text>Zadaj email</Text>
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
      <Text>Zadaj heslo</Text>
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
      <CustomButton
        title="Potvrdiť"
        color="#1eb900"
        style={{ width: "30%", marginTop: 24 }}
        onPressFunction={onSignUpPressed}
      />

      <View style={styles.row}>
        <Text>Máš už vytvorený účet? </Text>
        <TouchableOpacity onPress={() => navigation.replace("Login")}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    margin: 5,
    backgroundColor: "#FFFFFF",
  },
  text: {
    color: "#000000",
    textAlign: "center",
    fontSize: 30,
  },
  input: {
    borderWidth: 1,
    width: 300,
    borderRadius: 5,
    textAlign: "center",
    fontSize: 20,
    margin: 5,
  },
});
