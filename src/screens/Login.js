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
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setUserType, setTrainerPasswd, setAdminID } from '../redux/actions'
import tw from 'tailwind-react-native-classnames'



export default function Login({ navigation }) {
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })

  const { userType } = useSelector((state) => state.playerReducer)
  const dispatch = useDispatch()


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
      if(email.value !== 'trainer'){
        axios
          .get(
            'http://10.0.2.2:8080/users/login/' +
              email.value +
              '/' +
              password.value
          )
          .then((res) => {
            console.log(res.data)
            validateUser(email.value)
            dispatch(setTrainerPasswd(res.data.trainerPasswd))
            dispatch(setAdminID(res.data.id))
            navigation.replace('Home')
          })
          .catch(() => {
            Alert.alert(
              'Nesprávne meno alebo heslo!',
              'Vytvorte konto alebo resetujte heslo.'
            )
          })
      } else {
        axios
          .get(
            'http://10.0.2.2:8080/users/loginTrainer/' +
              email.value +
              '/' +
              password.value
          )
          .then((res) => {
            console.log(res.data)
            validateUser(email.value)
            dispatch(setTrainerPasswd(res.data.TrainerPasswd))
            dispatch(setAdminID(res.data.ID))
            navigation.replace('Home')
          })
          .catch(() => {
            Alert.alert(
              'Nesprávne meno alebo heslo!',
              'Vytvorte konto alebo resetujte heslo.'
            )
          })
      }
    } catch (error) {
      console.log(error)
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
