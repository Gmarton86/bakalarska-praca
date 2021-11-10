import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TextInput,
} from 'react-native'
import BackButton from '../utils/backButton'
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

export default function Tournament({ route, navigation }) {
  const [match, setMatch] = useState([
    { playerOne: {id: 0, name: '', username: ''}, playerTwo: {id: 0, name: '', username: ''}, table: 0, winner: '0' },
  ])
  const [player1, setPlayer1] = useState([])
  const [player2, setPlayer2] = useState([])
  const [tables, setTables] = useState([])
  const [winners, setWinners] = useState([])
  const { name } = route.params

  useEffect(() => {
    SQLite.enablePromise(true)
    passTournamentData()
  }, [])

  const passTournamentData = async () => {
    var playerOne
    var playerTwo
    try {
      await db.transaction(async (tx) => {
        tx.executeSql(
          'SELECT Player1ID, Player2ID, Stol, WinnerID FROM Matches WHERE Matches.TournamentName=?',
          [name],
          (err, results) => {
            var len = results.rows.length

            for (let i = 0; i < len; i++) {
              tx.executeSql(
                'SELECT Name, Username, ID FROM Players WHERE Players.ID=?',
                [results.rows.item(i).Player1ID],
                (tx, result1) => {
                  // playerOne =
                  //   result1.rows.item(0).Name +
                  //   ' ' +
                  //   result1.rows.item(0).Username
                  let id = result1.rows.item(0).ID
                  let name = result1.rows.item(0).Name
                  let username = result1.rows.item(0).Username
                  playerOne = { id, name, username }
                  player1.push(playerOne)
                }
              )
              if (results.rows.item(i).Player2ID != 0) {
                tx.executeSql(
                  'SELECT Name, Username, ID FROM Players WHERE Players.ID=?',
                  [results.rows.item(i).Player2ID],
                  (tx, result2) => {
                    // playerTwo =
                    //   result2.rows.item(0).Name +
                    //   ' ' +
                    //   result2.rows.item(0).Username
                    let id = result2.rows.item(0).ID
                    let name = result2.rows.item(0).Name
                    let username = result2.rows.item(0).Username
                    playerTwo = { id, name, username }
                    player2.push(playerTwo)
                  }
                )
              } else {
                let id = 0
                let name = ''
                let username = ''
                playerTwo = { id, name, username }
                player2.push(playerTwo)
              }
              if(results.rows.item(i).Stol === null){
                tables.push('')
              } else {
                tables.push(results.rows.item(i).Stol)
              }

              if(results.rows.item(i).Stol === null){
                winners.push('')
              } else {
                winners.push(results.rows.item(i).WinnerID.toString())
              }
            }
          }
        )
      })
    } catch (error) {
      console.log(error)
    }
    wait()
  }

  const wait = () => {
    match.pop()
    for (let i = 0; i < player1.length; i++) {
      var playerOne = player1[i]
      var playerTwo = player2[i]
      var table = tables[i]
      var winner = winners[i]
      var c = { playerOne, playerTwo, table, winner }
      //console.log(c)
      match.push(c)
    }
    for (let i = 0; i < match.length; i++) {
      console.log(match[i])
    }
  }

  const setWinner = (winner, player1ID, player2ID) => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          'UPDATE Matches SET WinnerID = ? WHERE Player1ID = ? AND Player2ID = ?',
          [winner, player1ID, player2ID]
        )
      })
    } catch (error) {
      console.log(error)
    }
  }

  const visitHome = () => {
    navigation.replace('Home')
  }

  return (
    <View style={styles.body}>
      <View>
        <BackButton goBack={visitHome} />
      </View>
      <Text style={styles.text}>Rozpis zapasov</Text>
      <FlatList
        keyExtractor={(item, index) => index.toString()}
        data={match}
        renderItem={({ item }) => (
          <View
            style={tw.style(
              'flex',
              'flex-col',
              'bg-blue-400',
              'm-1',
              'rounded-md'
            )}
          >
            <View style={tw.style('flex-1')}>
              <Text style={styles.text}>Hráč 1: {(item.playerOne.name + ' ' + item.playerOne.username).toString()}</Text>
              <Text style={styles.text}>Hráč 2: {item.playerTwo.name + ' ' + item.playerTwo.username}</Text>
            </View>
            <View style={tw.style('flex-1')}>
              <Text style={styles.text}>Stôl: {item.table}</Text>
            </View>
            <View style={tw.style('flex-1')}>
              <Text style={(styles.text, tw.style('hidden'))}>
                Víťaz: {item.winner}
              </Text>
              <Text style={styles.text}>Zadaj víťaza:</Text>
              <View style={tw.style('bg-yellow-500', 'h-10')}>
                <TextInput
                  style={tw.style('w-full', 'text-3xl')}
                  label="Víťaz"
                  returnKeyType="next"
                  value={item.winner}
                  onChangeText={(text) => {
                    item.winner = text
                    if (
                      item.winner === (item.playerOne.name + ' ' + item.playerOne.username) ||
                      item.winner === (item.playerTwo.name + ' ' + item.playerTwo.username)
                    ) {
                      console.log('Postupujes')
                    }
                  }}
                  placeholder="Meno víťaza"
                />
              </View>
            </View>
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  text: {
    color: '#000000',
    fontSize: 26,
    fontStyle: 'italic',
    margin: 5,
  },
  item: {
    margin: 5,
    backgroundColor: '#4ae',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    height: 70,
  },
  login: {
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
})
