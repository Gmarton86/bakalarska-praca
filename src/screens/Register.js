import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import BackButton from "../utils/backButton";
import { emailValidator } from "../helpers/emailValidator";
import { passwordValidator } from "../helpers/passwordValidator";
import { nameValidator } from "../helpers/nameValidator";
import CustomButton from "../utils/customButton";
import SQLite from "react-native-sqlite-storage";

const db = SQLite.openDatabase(
  {
    name: "LoginDB",
    location: "default",
    createFromLocation: '../db/LoginDB.db'
  },
  () => {},
  (error) => {
    console.log(error);
  }
);

export default function Register({ navigation }) {
  useEffect(() => {
    createTable();
  }, []);

  const createTable = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS " +
          "Users " +
          "(ID INTEGER PRIMARY KEY AUTOINCREMENT, Username TEXT, Password TEXT); "
      );
    });
  };

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
    } else {
      try {

        db.transaction((tx) => {
          tx.executeSql(
            "SELECT Username FROM Users WHERE Username = ?", [email.value],
            (tx, results) => {
              var len = results.rows.length;
              console.log('item:', results.rows.length);
              if (len > 0) {
                Alert.alert('Použivateľ existuje!', 'Použite iný email alebo obnovte heslo.')
              } else {
                tx.executeSql(
                       "INSERT INTO Users (Username, Password) VALUES (?, ?)",
                       [email.value, password.value]
                );
                Alert.alert('Úspešné', 'Použivateľ bol vytvorený úspešne.')
              }
            }
          );
        });


        //  db.transaction( (tx) => {
        //    tx.executeSql(
        //     "INSERT INTO Users (Username, Password) VALUES (?, ?)",
        //     ['erikzurvalec86@gmail.com', 'admin']
        //   );
        // });

        // db.transaction((tx) => {
        //   tx.executeSql(
        //     "SELECT Username, Password FROM Users", [],
        //     (tx, results) => {
        //       var len = results.rows.length;
        //       console.log('item:', results.rows.length);
        //       if (len > 0) {
        //         var userName = results.rows.item(0).Username;
        //         var pass = results.rows.item(0).Password;
        //         setEmailDB(userName);
        //         setPasswordDB(pass);
        //         console.log(emailDB);
        //       }
        //     }
        //   );
        // });
        // db.transaction((tx) => {
        //   tx.executeSql(
        //     "DELETE FROM USERS", [], () => {console.log('success')}, error => {console.log(error)} 
        //   )
        // })
        navigation.replace("Login");
      } catch (error) {
        console.log(error);
      }
    }

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
