import React, { useState, useEffect } from 'react'
import {
  Alert,
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
import tw from 'tailwind-react-native-classnames'
import { useDispatch, useSelector } from 'react-redux'
import { setUserType } from '../redux/actions'

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
  const [trainerCredential, setTrainerCredential] = useState({
    name: 'trainer',
    password: '',
  })
  const { userType, trainerPasswd } = useSelector(
    (state) => state.playerReducer
  )
  const dispatch = useDispatch()

  const renderTournaments = async () => {
    tournament.pop()
    try {
      db.transaction((tx) => {
        tx.executeSql('SELECT Name FROM Tournaments', [], (tx, results) => {
          var len = results.rows.length
          console.log('Number of tournaments: ' + len)
          if (len > 0) {
            for (let i = 0; i < len; i++) {
              var name = results.rows.item(i).Name
              setTournament((prevState) => [...prevState, { name }])
            }
          }
        })
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

  const visitCreate = () => {
    navigation.replace('Create')
  }

  const signOff = () => {
    dispatch(setUserType('player'))
  }

  const showCredentials = () => {
    Alert.alert(`name: ${trainerCredential.name}\npassword: ${trainerPasswd}`)
  }

  return (
    <View style={styles.body}>
      <View style={styles.login}>
        {userType === 'player' ? (
          <TextButton title="Prihlásenie" onPressFunction={visitLogin} />
        ) : (
          <TextButton title="Odhlásenie" onPressFunction={signOff} />
        )}
        {userType === 'admin' ? (
          <TextButton title="Údaje" onPressFunction={showCredentials} />
        ) : (
          <></>
        )}
        {userType === 'admin' ? (
          <TextButton title="Vytvor" onPressFunction={visitCreate} />
        ) : (
          <></>
        )}
      </View>
      <View style={tw.style('ml-3')}>
        <Text style={styles.text}>Prebiehajúce turnaje</Text>
      </View>
      <FlatList
        keyExtractor={(item, index) => index.toString()}
        data={tournament}
        renderItem={({ item }) => (
          <View>
            <CustomButton
              title={item.name}
              color="#1eb900"
              style={{ width: '80%', marginTop: 10 }}
              onPressFunction={() => {
                /* 1. Navigate to the Details route with params */
                navigation.navigate('Tournament', item)
              }}
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
    display: 'flex',
    justifyContent: 'center',
    minHeight: '100%',
  },
  text: {
    fontSize: 30,
    color: '#000000',
  },
  item: {
    margin: 5,
    minWidth: '80%',
    backgroundColor: '#4ae',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  login: {
    backgroundColor: '#000000',
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: 5,
    textAlign: 'center'
  },
})
