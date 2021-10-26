import React, { useState, useEffect, Component } from 'react'
import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native'
import BackButton from '../utils/backButton'
import MultiSelect from 'react-native-multiple-select'
import SQLite from 'react-native-sqlite-storage'
import { useDispatch, useSelector } from 'react-redux'
import { setName, setRank } from '../redux/actions'
import playerReducer from '../redux/reducers'
import CustomButton from '../utils/customButton'

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

  const [players, setPlayers] = useState([])
  const [selected, setSelected] = useState([])
  const [reference, setReference] = useState()
  const [name, setName] = useState({value: ''})
  const [NumberOfTables, setNumberOfTables] = useState()

  useEffect(() => {
    renderPlayers()
    createTable()
    //console.log(name)
  }, [])

  const createTable = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS ' +
          'Tournaments ' +
          '(ID INTEGER PRIMARY KEY AUTOINCREMENT, Name UNIQUE TEXT, Tables NUMBER, AdminID NUMBER, PlayerID NUMBER); '
      )
    })
  }

  const visitHome = () => {
    navigation.replace('Home')
  }

  const renderPlayers = () => {
    try {
      db.transaction((tx) => {
        tx.executeSql('SELECT * FROM Players ', [], (tx, results) => {
          var len = results.rows.length
          console.log('Number of players: ' + len)
          if (len > 1) {
            for (let i = 0; i < len; i++) {
              var name =
                results.rows.item(i).Name + ' ' + results.rows.item(i).Username
              var id = results.rows.item(i).ID.toString()
              let player = { name, id }
              //console.log(player)
              players.push(player)
            }
          }
        })
      })
    } catch (error) {
      console.log(error)
    }
  }

  const createTournament = () => {

    var tables = parseInt(NumberOfTables.value)

    try {
      db.transaction((tx) => {
        tx.executeSql('SELECT * FROM Users ', [], (tx, results) => {
          var len = results.rows.length
          console.log('Number of users: ' + len)
          if (len >= 1) {
            for (let i = 0; i < len; i++) {
              console.log(results.rows.item(i))
            }
          }
        })

        for(var i = 0; i < selected.length; i++){
          tx.executeSql(
            'INSERT INTO Tournaments (Name, Tables, AdminID, PlayerID) VALUES (?, ?, ?, ?)',
            [name.value, tables , 1, selected[i]]
          )
        }
        

        tx.executeSql('SELECT * FROM Tournaments ', [], (tx, results) => {
          var len = results.rows.length
          console.log('Number of tournaments: ' + len)
          if (len >= 1) {
            for (let i = 0; i < len; i++) {
              console.log(results.rows.item(i))
            }
          }
        })
      })
    } catch (error) {
      console.log(error)
    }
    
    console.log(selected[2])
    console.log(name.value)
    console.log(NumberOfTables.value)
  }

  const onSelectedItemsChange = (selectedItems) => {
    setSelected(selectedItems)
  }


  return (
    <View style={styles.body}>
      <ScrollView>
        <BackButton goBack={visitHome} />
        <Text style={styles.text}>Tournament creation</Text>
        <View>
          <Text>Zadaj meno turnaja:</Text>
          <TextInput
            id="nameInput"
            style={styles.input}
            label="Name"
            placeholder="Meno"
            value={name.value}
            onChangeText={(text) => setName({ value: text })}
          />
        </View>
        <View>
          <Text>Zadaj počet stolov:</Text>
          <TextInput
            id="numberOfTableInput"
            style={styles.input}
            label="NumberIfTables"
            placeholder="Číslo"
            keyboardType="numeric"
            maxLength={2}
            value={Number}
            onChangeText={(text) => setNumberOfTables({ value: text })}
          />
        </View>
        <View style={styles.searchInput}>
          <MultiSelect
            items={players}
            uniqueKey="id"
            ref={(component) => {
              setReference(component)
            }}
            onSelectedItemsChange={onSelectedItemsChange}
            selectedItems={selected}
            selectText="Vyber hračov"
            searchInputPlaceholderText="Hľadaj hračov..."
            altFontFamily="ProximaNova-Light"
            tagRemoveIconColor="#CCC"
            tagBorderColor="#CCC"
            tagTextColor="#CCC"
            selectedItemTextColor="#CCC"
            selectedItemIconColor="#CCC"
            itemTextColor="#000"
            displayKey="name"
            searchInputStyle={{ color: '#CCC' }}
            submitButtonColor="#CCC"
            submitButtonText="Potvrdiť"
          />
        </View>
        <CustomButton
          title="Potvrdiť"
          color="#1eb900"
          style={{ width: '30%', marginTop: 24 }}
          onPressFunction={createTournament}
        />
      </ScrollView>
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
  searchInput: {
    borderWidth: 1,
    width: 300,
    borderRadius: 5,
    marginTop: 30,
  },
})
