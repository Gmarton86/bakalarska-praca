import React, { useState } from 'react'
import { StyleSheet, Text, View, TextInput, Alert } from 'react-native'
import BackButton from '../utils/backButton'
import CustomButton from '../utils/customButton'
import tw from 'tailwind-react-native-classnames'
import axios from 'axios'

export default function ResetPasswordScreen({ navigation }) {
  const [name, setName] = useState({ value: '' })
  const [password, setPassword] = useState({ value: '' })
  const [repeatPassword, setRepeatPassword] = useState({ value: '' })

  function updatePassword() {
    try {
      axios
        .get(
          'http://10.0.2.2:8080/users/' +
            name.value +
            '/' +
            password.value
        )
        .then((res) => {
          console.log(res.data)
        }).catch(error => {
          console.log(error)
        })
    } catch (error) {
      console.log(error)
    }
  }

  const onPressed = () => {
    if (password.value === repeatPassword.value) {
      updatePassword()
      navigation.replace('Home')
    } else {
      Alert.alert('Hesla sa nezhodujú!')
    }
  }

  return (
    <View style={styles.body}>
      <View style={tw.style('')}>
        <BackButton
          goBack={() => {
            navigation.replace('Home')
          }}
        />
      </View>
      <Text style={styles.text}>Obnova hesla</Text>
      <Text style={tw.style('text-xl', 'font-semibold')}>Zadaj meno:</Text>
      <TextInput
        style={styles.input}
        label="Name"
        returnKeyType="next"
        value={name.value}
        onChangeText={(text) => setName({ value: text })}
        error={!!name.error}
        errorText={name.error}
      />
      <Text style={tw.style('text-xl', 'font-semibold')}>
        Zadaj nové heslo:
      </Text>
      <TextInput
        style={styles.input}
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text })}
        secureTextEntry
      />
      <Text style={tw.style('text-xl', 'font-semibold')}>Zoopakuj heslo:</Text>
      <TextInput
        style={styles.input}
        label="Password"
        returnKeyType="done"
        value={repeatPassword.value}
        onChangeText={(text) => setRepeatPassword({ value: text })}
        secureTextEntry
      />
      <CustomButton
        title="Potvrdiť"
        color="#1eb900"
        style={{ width: '30%', marginTop: 24 }}
        onPressFunction={onPressed}
      />
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
    fontWeight: 'bold',
    fontStyle: 'italic',
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
