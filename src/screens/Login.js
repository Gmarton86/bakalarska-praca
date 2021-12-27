import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native'
import CustomButton from '../utils/customButton'
import BackButton from '../utils/backButton'

import SQLite from 'react-native-sqlite-storage'
import { useDispatch, useSelector } from 'react-redux'
import { setUserType, setTrainerPasswd, setAdminID } from '../redux/actions'
import tw from 'tailwind-react-native-classnames'


const db = SQLite.openDatabase(
  {
    name: 'LoginDB',
    location: 'default',
  },
  () => {},
  (error) => {
    console.log(error)
  }
)

export default function Login({ navigation }) {
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })

  const { userType } = useSelector((state) => state.playerReducer)
  const dispatch = useDispatch()

  // useEffect(() => {
  //   getData();
  // }, [])

  // const getData = () => {
  //   try {

  //     db.transaction((tx) => {
  //       tx.executeSql(
  //         "SELECT Username, Password FROM Users",
  //         [],
  //         (tx, results) => {
  //           var len = results.rows.length;
  //           if (len > 0) {
  //             var username = results.rows.item(0).Username;
  //             var password = results.rows.item(0).Password;
  //             setEmailDB(toString(username));
  //               setPasswordDB(toString(password));
  //           }
  //         }
  //       );
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  const validateUser = (userType) => {
    if (userType === 'trainer') {
      dispatch(setUserType('trainer'))
    } else {
      dispatch(setUserType('admin'))
    }
  }

  //admin passwd: bffCyFd
  const onLoginPressed = () => {
    try {
      db.transaction((tx) => {
        if (email.value !== 'trainer') {
          tx.executeSql(
            'SELECT ID, Username, Password, TrainerPasswd, TrainerUsr FROM Users WHERE Username = ? and Password = ?',
            [email.value, password.value],
            (tx, results) => {
              var len = results.rows.length
              if (len > 0) {
                console.log(results.rows.item(0))
                validateUser(email.value)
                dispatch(setTrainerPasswd(results.rows.item(0).TrainerPasswd))
                dispatch(setAdminID(results.rows.item(0).ID))
              } else {
                Alert.alert(
                  'Nesprávne meno alebo heslo!',
                  'Vytvorte konto alebo resetujte heslo.'
                )
              }
            }
          )
        } else {
          tx.executeSql(
            'SELECT ID, Username, Password FROM Users WHERE TrainerUsr = ? and TrainerPasswd = ?',
            [email.value, password.value],
            (tx, results) => {
              var len = results.rows.length
              if (len > 0) {
                validateUser(email.value)
                dispatch(setTrainerPasswd(password.value))
                dispatch(setAdminID(results.rows.item(0).ID))
              } else {
                Alert.alert(
                  'Nesprávne meno alebo heslo!',
                  'Vytvorte konto alebo resetujte heslo.'
                )
              }
            }
          )
        }
      })
    } catch (error) {
      console.log(error)
    } finally {
      navigation.replace('Home')
    }
  }

  const visitHome = () => {
    navigation.replace('Home')
  }

  return (
    <View style={styles.background}>
      <View style={tw.style('flex', 'bg-white', 'pb-1')}>
        <BackButton goBack={visitHome} />
      </View>
      <View style={styles.body}>
        <Text style={styles.text}>Zadaj svoje uživateľské meno:</Text>
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
        <Text style={styles.text}>Zadaj svoje heslo: </Text>
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
        <View style={styles.forgotPassword}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ResetPasswordScreen')}
          >
            <Text style={styles.forgot}>Zabudol si heslo?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.forgot}>Zaregistruj sa</Text>
          </TouchableOpacity>
        </View>

        <CustomButton
          title="Potvrdiť"
          color="#1eb900"
          style={{ width: '30%' }}
          onPressFunction={onLoginPressed}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#000000',
    fontSize: 22,
    fontStyle: 'italic',
    margin: 5,
  },
  input: {
    borderWidth: 1,
    width: 300,
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 20,
  },
  background: {
    flex: 1,
  },
  forgotPassword: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
})
