import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native'
import BackButton from '../utils/backButton'
import SQLite from 'react-native-sqlite-storage'
import tw from 'tailwind-react-native-classnames'
import { useDispatch, useSelector } from 'react-redux'
import { setMatches, setUserType } from '../redux/actions'

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
  const [match, setMatch] = useState([])
  const [player1, setPlayer1] = useState([])
  const [player2, setPlayer2] = useState([])
  const [tables, setTables] = useState([])
  const [winners, setWinners] = useState([])
  const [winnerVisibility, setWinnerVisibility] = useState(true)
  const [isWinner, setIsWinner] = useState(true)
  const [freeTables, setFreeTables] = useState({ value: 0 })
  const { name } = route.params

  const { matches, userType } = useSelector((state) => state.playerReducer)
  const dispatch = useDispatch()

  useEffect(() => {
    SQLite.enablePromise(true)
    passTournamentData()
    if(userType !== 'player') {
      setWinnerVisibility(true)
    } else {
      setWinnerVisibility(false)
    }
  }, [])

  function wait() {
    //match.pop()
    //console.log(winners)
    let newMatch = []
    for (let i = 0; i < player1.length; i++) {
      var playerOne = player1[i]
      var playerTwo = player2[i]
      var table = tables[i]
      var winner = winners.find((pos) => pos.pos === i).winner
      //console.log(winner)
      var c = { playerOne, playerTwo, table, winner }
      //console.log(playerTwo)
      // if(playerTwo.id != 0){
      //   c = { playerOne, playerTwo, table, winner }
      // } else {
      //   winner = playerOne.name + ' ' + playerOne.username;
      //   c = { playerOne, playerTwo, table, winner }
      // }
      //console.log(c)
      newMatch = [...newMatch, c]
      setMatch((prevState) => [
        ...prevState,
        { playerOne, playerTwo, table, winner },
      ])
      //match.push(c)
    }
    dispatch(setMatches(newMatch))
    //console.log(matches)
    let a = match.filter((m) => m.table !== '')
    freeTables.value = freeTables.value - a.length
    return 0
  }

  const passTournamentData = async () => {
    var playerOne
    var playerTwo
    try {
      await db.transaction((tx) => {
        tx.executeSql(
          'Select Tables FROM Tournaments WHERE Name = ?',
          [name],
          (tx, results) => {
            freeTables.value = results.rows.item(0).Tables
          }
        )
        tx.executeSql(
          'SELECT Player1ID, Player2ID, Stol, WinnerID FROM Matches WHERE Matches.TournamentName=?',
          [name],
          async (err, results) => {
            var len = results.rows.length
            for (let i = 0; i < len; i++) {
              //console.log('ix')
              tx.executeSql(
                'SELECT Name, Username, ID FROM Players WHERE Players.ID=?',
                [results.rows.item(i).Player1ID],
                (tx, result1) => {
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
              if (results.rows.item(i).Stol === null) {
                tables.push('')
              } else {
                tables.push(results.rows.item(i).Stol)
              }

              //console.log(results.rows.item(i).WinnerID)
              if (
                results.rows.item(i).WinnerID != null &&
                results.rows.item(i).WinnerID != 0
              ) {
                tx.executeSql(
                  'SELECT ID, Name, Username FROM Players WHERE Players.ID=?',
                  [results.rows.item(i).WinnerID],

                  (tx, result3) => {
                    if (result3.rows.length === 0) {
                      console.log(results.rows.item(i).WinnerID)
                    }
                    let id = result3.rows.item(0).ID
                    let name = result3.rows.item(0).Name
                    let username = result3.rows.item(0).Username
                    let winner = { id, name, username }
                    let syncWinner = { pos: i, winner: winner }
                    //console.log(syncWinner)
                    winners.push(syncWinner)
                  }
                )
                //console.log('i')
              } else {
                let id = 0
                let name = ''
                let username = ''
                let winner = { id, name, username }
                let syncWinner = { pos: i, winner: winner }
                //console.log(syncWinner)
                winners.push(syncWinner)
              }
              //console.log('i')
            }
          }
        )
      })
      // wait();
      //console.log('no takr')
    } catch (error) {
      console.log(error)
    } finally {
      wait()
    }
  }

  function findRounds() {
    var i = 2
    var counter = 1
    //console.log('match len ' + matches.length)
    while (i ** counter <= matches.length) {
      counter++
    }
    return counter
  }

  function findCurrentRound() {
    var allRounds = findRounds()
    var allMatches = 2 ** allRounds
    var matchesLeft = allMatches - matches.length
    var counter = allRounds
    while (matchesLeft <= 2 ** counter) {
      counter--
    }
    //console.log('current: ' + counter)
    return allRounds - counter
  }

  const nextRoundGenerator = () => {
    var round = findRounds() - findCurrentRound()

    let a = 2 ** round
    var arr = matches
    for (let i = a; i > 0; i--) {
      let posOne = matches.length - i * 2
      let posTwo = matches.length - i * 2 + 1
      //console.log('pos ' + posOne + ' ' + posTwo)
      //console.log(matches[posOne].winner + ' ' + matches[posTwo].winner)
      let c = {
        playerOne: matches[posOne].winner,
        playerTwo: matches[posTwo].winner,
        table: '',
        winner: { id: 0, name: '', username: '' },
      }
      db.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO Matches (TournamentName, Player1ID, Player2ID, WinnerID) VALUES (?, ?, ?, ?)',
          [name, matches[posOne].winner.id, matches[posTwo].winner.id, 0]
        )
      })

      arr = [...arr, c]
      //console.log(c)
      //console.log(matches)
      //dispatch(setMatches(...matches, c))
    }
    dispatch(setMatches(arr))
  }

  const setWinner = (winnerID, player1ID, player2ID) => {
    //console.log(winnerID)
    try {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT ID, Name, Username FROM Players WHERE ID = ?',
          [parseInt(winnerID)],
          (err, result) => {
            var len = result.rows.length
            if (len == 0) {
              alert('winner doesnt exist')
            } else {
              let id = result.rows.item(0).ID
              let name = result.rows.item(0).Name
              let username = result.rows.item(0).Username
              let winner = { id, name, username }
              //console.log(winner)
              matches
                .reverse()
                .find(
                  (match) =>
                    match.playerOne.id === parseInt(winnerID) ||
                    match.playerTwo.id === parseInt(winnerID)
                ).winner = winner
              dispatch(setMatches(matches.reverse()))
              //console.log(matches)
              tx.executeSql(
                'UPDATE Matches SET WinnerID = ? WHERE Player1ID = ? AND Player2ID = ?',
                [parseInt(winnerID), parseInt(player1ID), parseInt(player2ID)]
              )
              if (
                matches.find((match) => match.winner.id === 0) === undefined
              ) {
                nextRoundGenerator()
              }
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

  function deleteTournament() {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          'DELETE FROM Tournaments WHERE Name=?',
          [name],
          function (tx, results) {
            console.error('Successfully Emptied')
          },
          function (tx, error) {
            console.error('Error: ' + error.message)
          }
        )
        tx.executeSql(
          'DELETE FROM Matches WHERE TournamentName=?',
          [name],
          function (tx, results) {
            console.error('Successfully Emptied')
          },
          function (tx, error) {
            console.error('Error: ' + error.message)
          }
        )
      })
    } catch (error) {
      console.log(error)
    }
    navigation.replace('Home')
  }

  return (
    <View style={styles.body}>
      <View>
        <BackButton goBack={visitHome} />
      </View>
      <View>
        <TouchableOpacity
          style={tw.style(
            'bg-yellow-500',
            'h-10',
            'rounded-md',
            'm-1.5',
            'items-center',
            'justify-center'
          )}
          onPress={() => deleteTournament()}
        >
          <Text style={tw.style('text-xl', 'font-bold', 'text-center')}>
            Zrušenie turnaju
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.text}>Rozpis zapasov</Text>
      <FlatList
        keyExtractor={(item, index) => index.toString()}
        data={matches}
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
              <Text style={styles.text}>
                Hráč 1:{' '}
                {(
                  item.playerOne.name +
                  ' ' +
                  item.playerOne.username
                ).toString()}
              </Text>
              <Text style={styles.text}>
                Hráč 2: {item.playerTwo.name + ' ' + item.playerTwo.username}
              </Text>
            </View>
            <View style={tw.style('flex-1')}>
              <Text style={styles.text}>Stôl: {item.table}</Text>
            </View>
            <View style={tw.style('flex-1')}>
              {isWinner ? (
                <View>
                  <Text style={styles.text}>
                    Víťaz: {item.winner.name + ' ' + item.winner.username}
                  </Text>
                </View>
              ) : (
                <></>
              )}
              {winnerVisibility ? (
                <View>
                  <Text style={styles.text}>Zvoľ víťaza:</Text>
                  <View>
                    <TouchableOpacity
                      style={tw.style(
                        'bg-yellow-500',
                        'h-10',
                        'rounded-md',
                        'm-1.5',
                        'items-center',
                        'justify-center'
                      )}
                      onPress={() =>
                        setWinner(
                          item.playerOne.id,
                          item.playerOne.id,
                          item.playerTwo.id
                        )
                      }
                    >
                      <Text
                        style={tw.style('text-xl', 'font-bold', 'text-center')}
                      >
                        Hráč 1.
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View>
                    <TouchableOpacity
                      style={tw.style(
                        'bg-yellow-500',
                        'h-10',
                        'rounded-md',
                        'm-1.5',
                        'items-center',
                        'justify-center'
                      )}
                      onPress={() =>
                        setWinner(
                          item.playerTwo.id,
                          item.playerOne.id,
                          item.playerTwo.id
                        )
                      }
                    >
                      <Text
                        style={tw.style('text-xl', 'font-bold', 'text-center')}
                      >
                        Hráč 2.
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <></>
              )}
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
