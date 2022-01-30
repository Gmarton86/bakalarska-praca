import React, { useState, useEffect, Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native'
import BackButton from '../utils/backButton'
import MultiSelect from 'react-native-multiple-select'
import SQLite from 'react-native-sqlite-storage'
import CustomButton from '../utils/customButton'
import { LogBox } from 'react-native'
import { useSelector } from 'react-redux'
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

export default function Create({ navigation }) {
  // const { name, age } = useSelector((state) => {state.playerReducer})
  // const dispatch = useDispatch()
  const { adminID } = useSelector((state) => state.playerReducer)

  const [players, setPlayers] = useState([])
  const [selected, setSelected] = useState([])
  const [competitor, setCompetitor] = useState([])
  const [reference, setReference] = useState()
  const [name, setName] = useState({ value: '' })
  const [place, setPlace] = useState({ value: '' })
  const [date, setDate] = useState({ value: '' })
  const [time, setTime] = useState({ value: '' })
  const [NumberOfTables, setNumberOfTables] = useState({ value: '0' })
  const [match, setMatch] = useState([])
  var counterOfTables = 0

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested'])
    createTable()
    renderPlayers()
    //console.log(name)
  }, [])

  const createTable = () => {
    db.transaction((tx) => {
      // tx.executeSql(
      //   'CREATE TABLE IF NOT EXISTS ' +
      //     'Tournaments ' +
      //     '(ID INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT, Tables INTEGER, AdminID INTEGER); '
      // )
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS ' +
          'Matches ' +
          '(ID INTEGER PRIMARY KEY AUTOINCREMENT, TournamentName TEXT, Player1ID INTEGER, Player2ID INTEGER, WinnerID INTEGER, Stol INTEGER); '
      )
    })
  }

  const visitHome = () => {
    navigation.replace('Home')
  }

  const sortPlayers = () => {
    competitor.sort((a, b) => {
      return parseInt(a.rank) - parseInt(b.rank)
    })
  }

  const selectAlgorithm = () => {
    if (competitor.length <= 8) {
      return 0
    }
    if (competitor.length <= 16) {
      return 8
    } else if (competitor.length <= 32) {
      return 16
    } else if (competitor.length <= 64) {
      return 32
    } else {
      return 64
    }
  }

  const renderMatches = () => {
    var algorithm = selectAlgorithm()

    var counter = algorithm * 2 - competitor.length

    var playerOne
    var playerTwo
    var war
    for (var i = 0; i < algorithm; i += 2) {
      if (counter != 0) {
        playerOne = competitor[i].id
        playerTwo = 0
      } else {
        playerOne = competitor[i].id
        playerTwo = competitor[competitor.length - 1 - i].id
      }
      war = { playerOne, playerTwo }
      match.push(war)
    }
    for (var i = algorithm - 1; i >= 0; i -= 2) {
      if (counter != 0) {
        playerOne = competitor[i].id
        playerTwo = 0
      } else {
        playerOne = competitor[i].id
        playerTwo = competitor[competitor.length - 1 - i].id
      }
      war = { playerOne, playerTwo }
      match.push(war)
    }
    if (counter != 0) {
      for (var i = 0; i < competitor.length - algorithm; i++) {
        match[match.length - 1 - i].playerTwo =
          competitor[competitor.length + i - (competitor.length - algorithm)].id
      }
    }
  }

  const renderPlayers = () => {
    try {
      db.transaction((tx) => {
        tx.executeSql('SELECT * FROM Players ', [], (tx, results) => {
          var len = results.rows.length
          console.log('Number of players: ' + len)
          if (len > 0) {
            for (let i = 0; i < len; i++) {
              var name =
                results.rows.item(i).Name + ' ' + results.rows.item(i).Username
              var id = results.rows.item(i).ID.toString()
              let rank = results.rows.item(i).Rank
              let player = { id, name, rank }
              //console.log(player)
              players.push(player)
            }
          }
        })

        tx.executeSql(
          'SELECT * FROM sqlite_master WHERE type=?',
          ['table'],
          (tx, results) => {
            var len = results.rows.length
            for (let i = 0; i < len; i++) {
              console.log('exist: ' + results.rows.item(i).name)
            }
          }
        )
        // tx.executeSql(
        //   'INSERT INTO Tournaments (Name, Tables, AdminID) VALUES (?, ?, ?)',
        //   //insert adminID
        //   ['ok', 3, 1]
        // )
        //  tx.executeSql(
        //   "DELETE FROM Matches", [], () => {console.log('success')}, error => {console.log(error)}
        // )
        // tx.executeSql(
        //   "DELETE FROM Tournaments", [], () => {console.log('success')}, error => {console.log(error)}
        // )
        tx.executeSql('SELECT Name FROM Tournaments', [], (tx, results) => {
          var len = results.rows.length
          console.log('Number of tournaments: ' + len)
        })
        tx.executeSql('SELECT * FROM Matches', [], (tx, results) => {
          var len = results.rows.length
          console.log('Number of Matches: ' + len)
        })
      })
    } catch (error) {
      console.log(error)
    }
  }

  const generateTournamentMatches = () => {
    for (let i = 0; i < selected.length; i++) {
      let a = players.filter((player) => player.id === selected[i])
      competitor.push(a[0])
    }
    sortPlayers()
    renderMatches()
  }

  const createTournament = () => {
    var tables = parseInt(NumberOfTables.value)
    if (
      tables <= 0 ||
      name.value === '' ||
      date.value === '' ||
      place.value === '' ||
      time.value === '' ||
      selected.length < 8
    ) {
      Alert.alert('Chyba', 'Udaje turnaja sú chybné')
      return -1
    }
    //console.log(tables)
    //console.log(name.value)
    try {
      db.transaction((tx) => {
        // tx.executeSql('SELECT * FROM Users ', [], (tx, results) => {
        //   var len = results.rows.length
        //   console.log('Number of users: ' + len)
        //   if (len >= 1) {
        //     for (let i = 0; i < len; i++) {
        //       console.log(results.rows.item(i))
        //     }
        //   }
        // })

        tx.executeSql(
          'INSERT INTO Tournaments (Name, Tables, AdminID, Time, Date, Place) VALUES (?, ?, ?, ?, ?, ?)',
          //insert adminID
          [name.value, tables, adminID, time.value, date.value, place.value]
        )

        generateTournamentMatches()

        for (var i = 0; i < match.length; i++) {
          if (match[i].playerTwo == 0) {
            tx.executeSql(
              'INSERT INTO Matches (TournamentName, Player1ID, Player2ID, WinnerID) VALUES (?, ?, ?, ?)',
              [
                name.value,
                match[i].playerOne,
                match[i].playerTwo,
                match[i].playerOne,
              ]
            )
          } else {
            if (counterOfTables < NumberOfTables.value) {
              counterOfTables++
            } else {
              counterOfTables = undefined
            }
            tx.executeSql(
              'INSERT INTO Matches (TournamentName, Player1ID, Player2ID, Stol) VALUES (?, ?, ?, ?)',
              [
                name.value,
                match[i].playerOne,
                match[i].playerTwo,
                counterOfTables,
              ]
            )
          }
        }
        // console.log('success')

        visitHome()
      })
    } catch (error) {
      console.log(error)
    }
  }

  const onSelectedItemsChange = (selectedItems) => {
    setSelected(selectedItems)
  }

  return (
    <View style={styles.body}>
      <ScrollView nestedScrollEnabled={true}>
        <BackButton goBack={visitHome} />
        <Text style={styles.text}>Tvorba turnaja</Text>
        <View>
          <Text style={tw.style('text-xl', 'font-semibold')}>
            Zadaj meno turnaja:
          </Text>
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
          <Text style={tw.style('text-xl', 'font-semibold')}>
            Zadaj počet stolov:
          </Text>
          <TextInput
            id="numberOfTableInput"
            style={styles.input}
            label="NumberIfTables"
            placeholder="Číslo"
            keyboardType="numeric"
            maxLength={2}
            value={NumberOfTables.value}
            onChangeText={(text) => setNumberOfTables({ value: text })}
          />
        </View>
        <View>
          <Text style={tw.style('text-xl', 'font-semibold')}>
            Zadaj miesto turnaja:
          </Text>
          <TextInput
            id="placeInput"
            style={styles.input}
            label="Name"
            placeholder="miesto"
            value={place.value}
            onChangeText={(text) => setPlace({ value: text })}
          />
        </View>
        <View>
          <Text style={tw.style('text-xl', 'font-semibold')}>
            Zadaj dátum turnaja:
          </Text>
          <TextInput
            id="dateInput"
            style={styles.input}
            label="Name"
            placeholder="dátum"
            value={date.value}
            onChangeText={(text) => setDate({ value: text })}
          />
        </View>
        <View>
          <Text style={tw.style('text-xl', 'font-semibold')}>
            Zadaj čas turnaja:
          </Text>
          <TextInput
            id="timeInput"
            style={styles.input}
            label="Name"
            placeholder="čas"
            value={time.value}
            onChangeText={(text) => setTime({ value: text })}
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
    flex: 1,
  },
})
