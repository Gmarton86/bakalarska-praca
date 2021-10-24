import React, { useState, useEffect, Component } from 'react'
import { StyleSheet, Text, View, TextInput } from 'react-native'
import BackButton from '../utils/backButton'
//import MultiSelect from 'react-native-multiple-select'
import MultipleSelect from '../utils/MultipleSelect/multipleSelect'
import SQLite from 'react-native-sqlite-storage'
import { useDispatch, useSelector } from 'react-redux'
import { setName, setRank } from '../redux/actions'
import playerReducer from '../redux/reducers'

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

export default function Create({ navigation }) {
  // const { name, age } = useSelector((state) => {state.playerReducer})
  // const dispatch = useDispatch()

  // const [players, setPlayers] = useState([])
  // const [selected, setSelected] = useState([])

  // useEffect(() => {
  //   renderPlayers()
  //   //console.log(name)
  // }, [])

  const visitHome = () => {
    navigation.replace('Home')
  }

  // const renderPlayers = () => {
  //   try {
  //     db.transaction((tx) => {
  //       tx.executeSql('SELECT * FROM Players ', [], (tx, results) => {
  //         var len = results.rows.length
  //         console.log('Number of players: ' + len)
  //         if (len > 1) {
  //           for (let i = 0; i < len; i++) {
  //              var name =
  //                results.rows.item(i).Name + ' ' + results.rows.item(i).Username
  //             console.log(name)
  //              dispatch(setName(name))
  //              console.log('a')
  //              dispatch(setRank(results.rows.item(i).Rank))
  //             players.push(results.rows.item(i))
  //             console.log(players[i].Rank)
  //             // setPlayers[i].Name(results.rows.item(i).Name.toString())
  //             // setPlayers[i].Username(results.rows.item(i).Username.toString())
  //             // setPlayers[i].DateOfBirth(
  //             //   parseInt(results.rows.item(i).DateOfBirth)
  //             // )
  //             // setPlayers[i].Rank(parseInt(results.rows.item(i).Rank))
  //           }
  //         }
  //       })
  //     })
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
  return (
    <View style={styles.body}>
      <BackButton goBack={visitHome} />
      <Text style={styles.text}>Tournament creation</Text>
      <View>
        <Text>Zadaj meno turnaja:</Text>
        <TextInput style={styles.input} label="Name" placeholder="Meno" />
      </View>
      <View>
        <Text>Zadaj počet stolov:</Text>
        <TextInput
          style={styles.input}
          label="NumberIfTables"
          placeholder="Číslo"
        />
      </View>
      <View>
        
        <MultipleSelect></MultipleSelect>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  backButton: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  body: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginLeft: 5,
  },
  text: {
    color: '#000000',
    fontSize: 32,
    fontStyle: 'italic',
    marginTop: 30,
  },
  input: {
    borderWidth: 1,
    width: 300,
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 20,
  },
})
