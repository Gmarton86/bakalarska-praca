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
  const [player, setPlayer] = useState([])
  const { name } = route.params

  useEffect(() => {
    passTournamentData()
  }, [])

  const passTournamentData = () => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT Players.Name, Players.Username, Players.Rank FROM Players JOIN Tournaments ON Tournaments.PlayerID = Players.ID WHERE Tournaments.Name = ?',
          [name],
          (tx, results) => {
            var len = results.rows.length
            for (let i = 0; i < len; i++) {
              let name =
                results.rows.item(i).Name + ' ' + results.rows.item(i).Username
              let rank = results.rows.item(i).Rank
              let c = { name, rank }
              player.push(c)
              //console.log(player[i])
            }
            //console.log('\n')
            player.sort((a, b) => {
              return parseInt(a.rank) - parseInt(b.rank)
            })
            for (let i = 0; i < player.length; i++) {
              console.log(player[i])
            }
            renderMatches()
          }
        )
      })
    } catch (error) {
      console.log(error)
    }
  }

  const renderMatches = () => {
    match.pop()
    var algorithm
    if (player.length <= 16) {
      algorithm = 8
    } else if (player.length <= 32) {
      algorithm = 16
    } else if (player.length <= 64) {
      algorithm = 32
    } else {
      algorithm = 64
    }
    var numberOfFreeMatches = algorithm * 2 - player.length
    var counter = numberOfFreeMatches

    for (var i = 0; i < algorithm; i += 2) {
      let playerOne
      let playerTwo
      if (counter != 0) {
        playerOne = player[i].name
        playerTwo = ''
      } else {
        playerOne = player[i].name
        playerTwo = player[player.length - 1 - i].name
      }
      let war = { playerOne, playerTwo }
      match.push(war)
    }
    for (var i = algorithm - 1; i >= 0; i -= 2) {
      let playerOne
      let playerTwo
      if (counter != 0) {
        playerOne = player[i].name
        playerTwo = ''
      } else {
        playerOne = player[i].name
        playerTwo = player[player.length - 1 - i].name
      }
      let war = { playerOne, playerTwo }
      match.push(war)
    }
    if (counter != 0) {
      for (var i = 0; i < player.length - algorithm; i++) {
        match[match.length - 1 - i].playerTwo =
          player[player.length + i - (player.length - algorithm)].name
      }
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
