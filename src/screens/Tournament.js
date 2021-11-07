import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native'
import BackButton from '../utils/backButton'
import SQLite from 'react-native-sqlite-storage'

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
  const [match, setMatch] = useState([{ playerOne: 'a', playerTwo: 'b' }])
  const [player1, setPlayer1] = useState([])
  const [player2, setPlayer2] = useState([])
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
          'SELECT Player1ID, Player2ID FROM Matches WHERE Matches.TournamentName=?',
          [name],
           (err, results) => {
            var len = results.rows.length
        
            for (let i = 0; i < len; i++) {
               tx.executeSql(
                'SELECT Name, Username FROM Players WHERE Players.ID=?',
                [results.rows.item(i).Player1ID],
                 (tx, result1) => {
                  playerOne =
                    result1.rows.item(0).Name +
                    ' ' +
                    result1.rows.item(0).Username

                    player1.push(playerOne)
                }
              )
              if(results.rows.item(i).Player2ID != 0){
                tx.executeSql(
                  'SELECT Name, Username FROM Players WHERE Players.ID=?',
                  [results.rows.item(i).Player2ID],
                  (tx, result2) => {
                    playerTwo =
                      result2.rows.item(0).Name +
                      ' ' +
                      result2.rows.item(0).Username
                    player2.push(playerTwo)
                  }
                )
              } else {
                playerTwo = ''
                player2.push(playerTwo)
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
    for(let i = 0; i < player1.length; i++){
      var playerOne = player1[i]
      var playerTwo = player2[i]
      var c = { playerOne, playerTwo}
      console.log(c)
      match.push(c)
    }
    for (let i = 0; i < match.length; i++) {
      console.log(match[i])
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
          <View style={styles.item}>
            <Text style={styles.text}>{item.playerOne}</Text>
            <Text style={styles.text}>{item.playerTwo}</Text>
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
