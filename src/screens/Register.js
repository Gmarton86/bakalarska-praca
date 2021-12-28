import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native'
import BackButton from '../utils/backButton'
import { emailValidator } from '../helpers/emailValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import { nameValidator } from '../helpers/nameValidator'
import CustomButton from '../utils/customButton'
import SQLite from 'react-native-sqlite-storage'
import tw from 'tailwind-react-native-classnames'

const db = SQLite.openDatabase(
  {
    name: 'LoginDB',
    location: 'default',
    createFromLocation: '../db/LoginDB.db',
  },
  () => {},
  (error) => {
    console.log(error)
  }
)

export default function Register({ navigation }) {
  

  useEffect(() => {
    createTable()
  }, [])

  const createTable = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS ' +
          'Users ' +
          '(ID INTEGER PRIMARY KEY AUTOINCREMENT, Username TEXT, Password TEXT, TrainerUsr TEXT, TrainerPasswd TEXT, tournamentID INTEGER); '
      )
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS ' +
          'Players ' +
          '(ID INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT, Username TEXT, DateOfBirth INTEGER, Rank INTEGER); '
      )
    })
  }

  // const addPlayers = () => {
  //   db.transaction((tx) => {
  //     for(var i = 0; i < players.length; i++){
  //       tx.executeSql('INSERT INTO Players (Name, Username, DateOfBirth, Rank) VALUES (?, ?, ?, ?)', 
  //         [players[i].Name, players[i].Username, players[i].DateOfBirth, players[i].Rank]
  //     )
  //     }
  //   })
  // }

  const generateString = (length) => {
    var result = ''
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    var charactersLength = characters.length
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
  }

  const [name, setName] = useState({ value: '', error: '' })
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })

  const onSignUpPressed = () => {
    const nameError = nameValidator(name.value)
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    if (emailError || passwordError || nameError) {
      setName({ ...name, error: nameError })
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return
    } else {
      try {
        db.transaction((tx) => {
          tx.executeSql(
            'SELECT Username FROM Users WHERE Username = ?',
            [email.value],
            (tx, results) => {
              var len = results.rows.length
              console.log('item:', results.rows.length)
              if (len > 0) {
                Alert.alert(
                  'Použivateľ existuje!',
                  'Použite iný email alebo obnovte heslo.'
                )
              } else {
                var trainerUsr = 'trainer'
                var trainerPasswd = generateString(7)
                console.log(trainerPasswd)
                console.log(trainerUsr)
                tx.executeSql(
                  'INSERT INTO Users (Username, Password, TrainerUsr, TrainerPasswd) VALUES (?, ?, ?, ?)',
                  [email.value, password.value, trainerUsr, trainerPasswd]
                )
                Alert.alert(
                  'Úspešné',
                  'Zapíš si trenerové údaje! Meno: ' +
                    trainerUsr +
                    ', Heslo: ' +
                    trainerPasswd
                )
              }
            }
          )
        })

        //  db.transaction( (tx) => {
        //    tx.executeSql(
        //     "INSERT INTO Users (Username, Password) VALUES (?, ?)",
        //     ['erikzurvalec86@gmail.com', 'admin']
        //   );
        // });

        // db.transaction((tx) => {
        //   tx.executeSql(
        //     "SELECT * FROM Users", [],
        //     (tx, results) => {
        //       var len = results.rows.length;
        //       console.log('item:', results.rows.length);
        //       console.log(results.rows.item(0).Username);
        //       console.log(results.rows.item(0).Password)
        //       // if (len > 0) {
        //       //   var userName = results.rows.item(0).Username;
        //       //   var pass = results.rows.item(0).Password;
        //       //   setEmailDB(userName);
        //       //   setPasswordDB(pass);
        //       //   console.log(emailDB);
        //       // }
        //     }
        //   );
        // });
        // db.transaction((tx) => {
        //   tx.executeSql(
        //     "DELETE FROM Users", [], () => {console.log('success')}, error => {console.log(error)}
        //   )
        // })

        navigation.replace('Login')
      } catch (error) {
        console.log(error)
      }
    }

    // navigation.reset({
    //   index: 0,
    //   routes: [{ name: "Dashboard" }],
    // });
  }
  return (
    <View style={styles.body}>
      <BackButton
        goBack={() => {
          navigation.replace('Home')
        }}
      />
      <Text style={styles.text}>Výtvorenie účtu</Text>
      <Text style={tw.style('text-xl', 'font-semibold')}>Zadaj meno</Text>
      <TextInput
        style={styles.input}
        label="Name"
        returnKeyType="next"
        value={name.value}
        onChangeText={(text) => setName({ value: text, error: '' })}
        error={!!name.error}
        errorText={name.error}
      />
      <Text style={tw.style('text-xl', 'font-semibold')}>Zadaj email</Text>
      <TextInput
        style={styles.input}
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <Text style={tw.style('text-xl', 'font-semibold')}>Zadaj heslo</Text>
      <TextInput
        style={styles.input}
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <CustomButton
        title="Potvrdiť"
        color="#1eb900"
        style={{ width: '30%', marginTop: 24 }}
        onPressFunction={onSignUpPressed}
      />

      <View style={styles.row}>
        <Text style={tw.style('text-xl', 'font-semibold')}>
          Máš už vytvorený účet?{' '}
        </Text>
        <TouchableOpacity
          style={tw.style(
            'bg-green-500',
            'h-10',
            'rounded-md',
            'm-1.5',
            'items-center',
            'justify-center'
          )}
          onPress={() => navigation.replace('Login')}
        >
          <Text
            style={tw.style(
              'text-xl',
              'font-semibold',
              'text-white',
              'tracking-wide'
            )}
          >
            Prihlásenie
          </Text>
        </TouchableOpacity>
      </View>

      {/* <CustomButton
        title="Add players"
        color="#1eb900"
        style={{ width: '30%', marginTop: 24 }}
        onPressFunction={addPlayers}
      /> */}
    </View>
  )
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    padding: 5,
    backgroundColor: '#FFFFFF',
  },
  text: {
    color: '#000000',
    textAlign: 'center',
    fontSize: 30,
  },
  input: {
    borderWidth: 1,
    width: 300,
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 20,
    margin: 5,
  },
})
