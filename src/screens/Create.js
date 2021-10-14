import React from 'react'
import { StyleSheet, Text, View, TextInput } from 'react-native'
import BackButton from '../utils/backButton'

export default function Create({ navigation }) {
  const visitHome = () => {
    navigation.replace('Home')
  }

  return (
    <View style={styles.body}>
      <BackButton goBack={visitHome} />
      <Text style={styles.text}>Tournament creation</Text>
      <Text>Zadaj meno turnaja:</Text>
      <TextInput
        style={styles.input}
        label="Name"
        placeholder="Majstrovstva Oravy"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  backButton: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  body: {
    flex:1,
    backgroundColor: "#FFFFFF",
  },
  text: {
    color: "#000000",
    fontSize: 32,
    fontStyle: "italic",
    marginTop: 30,
  },
  input: {
    borderWidth: 1,
    width: 300,
    borderRadius: 5,
    textAlign: "center",
    fontSize: 20,
  }
})
