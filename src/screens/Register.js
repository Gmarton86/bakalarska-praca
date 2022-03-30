import React, { useState } from 'react'
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
import tw from 'tailwind-react-native-classnames'
import axios from 'axios'


export default function Register({ navigation }) {

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

  const [repeatPassword, setRepeatPassword] = useState({ value: '', error: '' })
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })

  const onSignUpPressed = () => {
    const nameError = nameValidator(repeatPassword.value)
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    if (emailError || repeatPassword.value !== password.value) {
      Alert.alert('Hesla sa nezhodujú!')
      setRepeatPassword({ ...repeatPassword, error: nameError })
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return
    } else {
      try {
        axios
          .get('http://10.0.2.2:8080/users/' + email.value)
          .then((res) => {
            console.log(res.data)
            Alert.alert(
              'Použivateľ existuje!',
              'Použite iný email alebo obnovte heslo.'
            )
          })
          .catch(() => {
            var trainerUsr = 'trainer'
            var trainerPasswd = generateString(7)
            console.log(trainerPasswd)
            console.log(trainerUsr)

            axios
              .post('http://10.0.2.2:8080/users', {
                username: email.value,
                password: password.value,
                trainerUsr: trainerUsr,
                trainerPasswd: trainerPasswd,
                tournamentID: undefined,
              })
              .then((res) => {
                console.log(res.data)
                Alert.alert(
                  'Úspešné',
                  'Zapíš si trenerové údaje! Meno: ' +
                    trainerUsr +
                    ', Heslo: ' +
                    trainerPasswd
                )
                navigation.replace('Login')
              })
          })
      } catch (error) {
        console.log(error)
      }
    }
  }
  return (
    <View style={styles.body}>
      <BackButton
        goBack={() => {
          navigation.replace('Home')
        }}
      />
      <Text style={styles.text}>Výtvorenie účtu</Text>
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
      <Text style={tw.style('text-xl', 'font-semibold')}>Zoopakuj heslo</Text>
      <TextInput
        style={styles.input}
        label="Name"
        returnKeyType="next"
        value={repeatPassword.value}
        secureTextEntryr
        onChangeText={(text) => setRepeatPassword({ value: text, error: '' })}
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
