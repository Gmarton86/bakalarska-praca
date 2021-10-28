import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, FlatList } from 'react-native'
import BackButton from '../utils/backButton'
import SQLite from "react-native-sqlite-storage"

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
  const [match, setMatch] = useState([{ value: 'item' }, {value: 'ok'}])
  const [player, setPlayer] = useState([])
  const { name } = route.params;


  useEffect(() => {
    passTournamentData()
  }, [])

  const passTournamentData = async () => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT Players.Name, Players.Username, Players.Rank FROM Players JOIN Tournaments ON Tournaments.PlayerID = Players.ID WHERE Tournaments.Name = ?',
          [name],
          (tx, results) => {
            var len = results.rows.length
            for(let i = 0; i < len; i++){
              let name = results.rows.item(i).Name + ' ' + results.rows.item(i).Username
              let rank = results.rows.item(i).Rank
              let c = {name, rank}
              player.push(c)
              console.log(player[i])
            }
            console.log('\n')
            player.sort((a, b) => {return parseInt(a.rank) - parseInt(b.rank)})
            for(let i = 0; i < player.length; i++){
              console.log(player[i])
            }
          }
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
          <View style={styles.item}>
            <Text style={styles.text}>{item.value}</Text>
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
