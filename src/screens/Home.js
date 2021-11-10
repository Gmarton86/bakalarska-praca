import React, { useState, useEffect } from 'react'
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import TextButton from '../utils/textButton'
import SQLite from 'react-native-sqlite-storage'
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

export default function Tournaments({ navigation }) {

  useEffect(() => {
    renderTournaments()
  }, [])

  const [refreshing, setRefreshing] = useState(false)
  const [tournament, setTournament] = useState([])


  const renderTournaments = async () => {
    tournament.pop()
    try {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT Name FROM Tournaments',
          [],
          (tx, results) => {
            var len = results.rows.length
            console.log('Number of tournaments: ' + len)
            if (len > 0) {
              for (let i = 0; i < len; i++) {
                var name = results.rows.item(i).Name
                setTournament(prevState => [...prevState, {name}])
              }
            }
          }
        )
      })
    } catch (error) {
      console.log(error)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    setRefreshing(false)
  }

  const visitLogin = () => {
    navigation.replace('Login')
  }

  return (
    <View style={styles.body}>
      <View style={styles.login}>
        <TextButton title="Prihlásenie" onPressFunction={visitLogin} />
      </View>

      <Text style={styles.text}>Prebiehajúce turnaje</Text>
      <FlatList
        keyExtractor={(item, index) => index.toString()}
        data={tournament}
        renderItem={({ item }) => (
          <View>
            <CustomButton
              title={item.name}
              color="#1eb900"
              style={{ width: '80%', marginTop: 24}}
              onPressFunction={() => {
                /* 1. Navigate to the Details route with params */
                navigation.navigate('Tournament', item);}}
            />
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
    fontSize: 30,
    color: '#000000',
  },
  item: {
    margin: 5,
    backgroundColor: '#4ae',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  login: {
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
})
