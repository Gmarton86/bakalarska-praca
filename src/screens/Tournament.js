import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native'
import BackButton from '../utils/backButton'
import SQLite from 'react-native-sqlite-storage'
import tw from 'tailwind-react-native-classnames'
import CustomButton from '../utils/customButton'
import { useDispatch, useSelector } from 'react-redux'
import { setMatches, setUserType } from '../redux/actions'
import Icon from 'react-native-vector-icons/FontAwesome5'
import ImageModal from 'react-native-image-modal'

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
  const [scores, setScores] = useState([])
  const [winners, setWinners] = useState([])
  const [winnerVisibility, setWinnerVisibility] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const [isWinner, setIsWinner] = useState(true)
  const [freeTables, setFreeTables] = useState([])
  const [numberOfTables, setNumberOfTables] = useState({ value: 0 })
  const [player1Input, setPlayer1Input] = useState(false)
  const [player2Input, setPlayer2Input] = useState(false)
  const [round, setRound] = useState(1)
  const [rounds, setRounds] = useState(4)
  const [lines, setLines] = useState([])
  const [adminsID, setAdminsID] = useState(0)
  const [score, setScore] = useState({ value: '' })
  const { name } = route.params
  const [spider8, setSpider8] = useState(false)
  const [spider16, setSpider16] = useState(false)
  const [spider32, setSpider32] = useState(false)

  const { matches, userType, adminID } = useSelector(
    (state) => state.playerReducer
  )
  const dispatch = useDispatch()

  useEffect(() => {
    SQLite.enablePromise(true)
    passTournamentData()
  }, [])

  function wait() {
    //match.pop()
    //console.log(winners)
    let newMatch = []
    for (let i = 0; i < player1.length; i++) {
      var playerOne = player1[i]
      var playerTwo = player2[i]
      var table = tables[i]
      var score = scores[i]
      var player1Input = false
      var player2Input = false
      var winner = winners.find((pos) => pos.pos === i).winner
      //console.log(winner)
      var c = {
        playerOne,
        playerTwo,
        table,
        winner,
        score,
        player1Input,
        player2Input,
      }
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
        {
          playerOne,
          playerTwo,
          table,
          winner,
          score,
          player1Input,
          player2Input,
        },
      ])
      //match.push(c)
    }
    setRounds(find(player1))
    setRound(findCurrentRound(newMatch) - 1)

    dispatch(setMatches(newMatch))
    //console.log(matches)
    let a = newMatch.filter((m) => m.winner.id === 0 && m.table !== '')
    for (i = 1; i <= numberOfTables.value; i++) {
      if (a.find((match) => match.table === i) === undefined) {
        freeTables.push(i)
      }
    }
    setRoundLines(rounds)
    console.log(freeTables)
    return 0
  }

  const setRoundLines = () => {
    let i = rounds - 1
    let sum = 0
    while (sum < 2 ** rounds && i > 0) {
      sum += 2 ** i
      setLines((oldArray) => [...oldArray, sum])
      i--
      console.log(sum)
    }
  }

  const find = (competitor) => {
    if (competitor.length < 8) {
      return 3
    }
    if (competitor.length < 16) {
      return 4
    } else if (competitor.length < 32) {
      return 5
    } else if (competitor.length < 64) {
      return 6
    } else {
      return 7
    }
  }

  const passTournamentData = async () => {
    var playerOne
    var playerTwo
    try {
      await db.transaction((tx) => {
        tx.executeSql(
          'Select Tables, AdminID FROM Tournaments WHERE Name = ?',
          [name],
          (tx, results) => {
            console.log(results.rows.item(0))
            numberOfTables.value = results.rows.item(0).Tables
            setAdminsID(results.rows.item(0).AdminID)
            console.log('admin ID: ' + results.rows.item(0).AdminID)
            console.log('usertype: ' + userType)
            console.log('logged admin: ' + adminID)
            if (
              userType !== 'player' &&
              adminID === results.rows.item(0).AdminID
            ) {
              setWinnerVisibility(true)
              setIsOwner(true)
            }
          }
        )
        tx.executeSql(
          'SELECT Player1ID, Player2ID, Stol, WinnerID, Score FROM Matches WHERE Matches.TournamentName=?',
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
              if (results.rows.item(i).Score === null) {
                scores.push('')
              } else {
                scores.push(results.rows.item(i).Score)
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

  function findRounds(matches) {
    var i = 2
    var counter = 1
    //console.log('match len ' + matches.length)
    while (i ** counter <= matches.length) {
      counter++
    }
    return counter
  }

  function findCurrentRound(matches) {
    var allRounds = findRounds(matches)
    var allMatches = 2 ** allRounds
    var matchesLeft = allMatches - matches.length
    var counter = allRounds
    while (matchesLeft <= 2 ** counter) {
      counter--
    }
    return allRounds - counter
  }

  const nextRoundGenerator = (table) => {
    var round = findRounds(matches) - findCurrentRound(matches)
    console.log('round ' + round)
    if (round === -1) {
      setRound(findCurrentRound(matches) - 1)
    } else {
      setRound(findCurrentRound(matches))
    }
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
        score: '',
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
    setNextMatch(table, arr, -1)
    dispatch(setMatches(arr))
    //setNextMatch()
  }

  const setWinner = (winnerID, player1ID, player2ID, table) => {
    console.log(table)
    try {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT ID, Name, Username FROM Players WHERE ID = ?',
          [parseInt(winnerID)],
          (err, result) => {
            var len = result.rows.length
            if (len == 0) {
              Alert.alert('winner doesnt exist')
            } else {
              let id = result.rows.item(0).ID
              let name = result.rows.item(0).Name
              let username = result.rows.item(0).Username
              let winner = { id, name, username }
              //console.log(winner)
              //find if the winner is set
              let currentWinner = matches
                .reverse()
                .find(
                  (match) =>
                    match.playerOne.id === parseInt(player1ID) &&
                    match.playerTwo.id === parseInt(player2ID)
                )
              if (currentWinner.winner.id !== 0) {
                matches.reverse()
                let index = matches.indexOf(currentWinner)
                let sliceArray = matches.slice(index + 1)
                sliceArray.forEach((element) => {
                  if (element.playerOne.id === currentWinner.winner.id) {
                    tx.executeSql(
                      'UPDATE Matches SET WinnerID = ?, Player1ID = ?, Stol = ?, Score = ? WHERE Player1ID = ? AND Player2ID = ?',
                      [
                        0,
                        winner.id,
                        null,
                        null,
                        element.playerOne.id,
                        element.playerTwo.id,
                      ],
                      (trans, result) => {
                        console.log(result.rows.item(0))
                      },
                      (error) => {
                        console.log(error)
                      }
                    )
                    element.playerOne = winner
                    element.table = ''
                    element.winner = { id: 0, name: '', username: '' }
                    element.score = ''
                  }
                  if (element.playerTwo.id === currentWinner.winner.id) {
                    tx.executeSql(
                      'UPDATE Matches SET WinnerID = ?, Player2ID = ?, Stol = ?, Score = ? WHERE Player1ID = ? AND Player2ID = ?',
                      [
                        0,
                        winner.id,
                        null,
                        null,
                        element.playerOne.id,
                        element.playerTwo.id,
                      ],
                      (trans, result) => {
                        console.log(result.rows.item(0))
                      },
                      (error) => {
                        console.log(error)
                      }
                    )
                    element.playerTwo = winner
                    element.table = ''
                    element.winner = { id: 0, name: '', username: '' }
                    element.score = ''
                  }
                })
                tx.executeSql(
                  'UPDATE Matches SET WinnerID = ?, Score = ? WHERE Player1ID = ? AND Player2ID = ?',
                  [
                    parseInt(winner.id),
                    score.value,
                    parseInt(currentWinner.playerOne.id),
                    parseInt(currentWinner.playerTwo.id),
                  ],
                  (trans, result) => {
                    console.log(result.rows.item(0))
                  },
                  (error) => {
                    console.log(error)
                  }
                )
                console.log(winner)
                currentWinner.winner = winner
                currentWinner.score = score.value
                dispatch(setMatches(matches))
              } else {
                matches.find(
                  (match) =>
                    match.playerOne.id === parseInt(player1ID) &&
                    match.playerTwo.id === parseInt(player2ID)
                ).winner = winner
                matches.find(
                  (match) =>
                    match.playerOne.id === parseInt(player1ID) &&
                    match.playerTwo.id === parseInt(player2ID)
                ).score = score.value
                dispatch(setMatches(matches.reverse()))
                //console.log(matches)
                tx.executeSql(
                  'UPDATE Matches SET WinnerID = ?, Score = ? WHERE Player1ID = ? AND Player2ID = ?',
                  [
                    parseInt(winnerID),
                    score.value,
                    parseInt(player1ID),
                    parseInt(player2ID),
                  ]
                )
                if (
                  matches.find((match) => match.winner.id === 0) === undefined
                ) {
                  nextRoundGenerator(table)
                } else {
                  setNextMatch(table, matches, winnerID)
                }
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

  const updateMatchDb = (table, playerOneID, playerTwoID) => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          'UPDATE Matches SET Stol = ? WHERE Player1ID = ? AND Player2ID = ?',
          [parseInt(table), parseInt(playerOneID), parseInt(playerTwoID)]
        )
      })
    } catch (error) {
      console.log(error)
    }
  }

  function setNextMatch(table, matches, winnerID) {
    console.log(table + 'a')
    if (table !== undefined && table !== '' && table !== ' ') {
      console.log('push')

      freeTables.push(parseInt(table))
    }
    console.log(freeTables)
    matches.filter((match) => {
      if (
        match.winner.name === '' &&
        match.table === '' &&
        freeTables.length > 0 &&
        match.playerOne.id !== parseInt(winnerID) &&
        match.playerTwo.id !== parseInt(winnerID)
      ) {
        match.table = freeTables[freeTables.length - 1].toString()
        updateMatchDb(
          freeTables[freeTables.length - 1],
          match.playerOne.id,
          match.playerTwo.id
        )
        freeTables.pop()
      }
    })
    dispatch(setMatches(matches))
  }

  return (
    <View style={styles.body}>
      <View>
        <BackButton goBack={visitHome} />
      </View>
      <View style={tw.style('flex', 'flex-row')}>
        <Text style={styles.text}>
          Kolo zápasov: {round}/{rounds}
        </Text>
        <View>
          <TouchableOpacity
            onPress={() => {
              if (rounds === 6) {
                setSpider32(true)
              } else if (rounds === 5) {
                setSpider16(true)
              } else {
                setSpider8(true)
              }
            }}
          >
            <Icon name="spider" size={30} style={tw.style('pl-32', 'pt-2')} />
          </TouchableOpacity>
        </View>
      </View>
      {spider8 ? (
        <ImageModal
          resizeMode="contain"
          imageBackgroundColor="#000000"
          style={{
            width: 400,
            height: 500,
          }}
          source={{
            uri: 'https://www.linkpicture.com/q/8rounds_2.png',
          }}
          onClose={() => {
            setSpider8(false)
          }}
        />
      ) : (
        <></>
      )}
      {spider16 ? (
        <ImageModal
          resizeMode="contain"
          imageBackgroundColor="#000000"
          style={{
            width: 400,
            height: 500,
          }}
          source={{
            uri: 'https://www.linkpicture.com/q/16rounds_1.png',
          }}
          onClose={() => {
            setSpider16(false)
          }}
        />
      ) : (
        <></>
      )}
      {spider32 ? (
        <ImageModal
          resizeMode="contain"
          imageBackgroundColor="#000000"
          style={{
            width: 400,
            height: 500,
          }}
          source={{
            uri: 'https://www.linkpicture.com/q/32rounds_1.png',
          }}
          onClose={() => {
            setSpider32(false)
          }}
        />
      ) : (
        <></>
      )}
      <FlatList
        keyExtractor={(item, index) => index.toString()}
        data={matches}
        inverted={true}
        initialNumToRender={4}
        renderItem={({ item, index }) => (
          <View>
            {lines.find((e) => e === index + 1) !== undefined &&
            index + 1 !== matches.length ? (
              <View
                style={tw.style(
                  'bg-green-500',
                  'h-5',
                  'w-full',
                  'mb-2',
                  'mt-2'
                )}
              >
                <Text style={tw.style('text-center')}>Ďalšie kolo</Text>
              </View>
            ) : (
              <></>
            )}
            <View
              style={tw.style(
                'flex',
                'flex-col',
                'bg-blue-400',
                'm-1',
                'rounded-md'
              )}
            >
              {item.table !== '' && item.winner.name === '' ? (
                <View
                  style={tw.style(
                    'w-5',
                    'h-5',
                    'bg-green-300',
                    'flex-1',
                    'mt-2',
                    'self-center',
                    'rounded-full'
                  )}
                >
                  <Text style={tw.style('text-center', 'font-bold')}>
                    {(index + 1).toString()}
                  </Text>
                </View>
              ) : (
                <View
                  style={tw.style(
                    'w-5',
                    'h-5',
                    'bg-red-600',
                    'flex-1',
                    'mt-2',
                    'self-center',
                    'rounded-full'
                  )}
                >
                  <Text style={tw.style('text-center', 'font-bold')}>
                    {(index + 1).toString()}
                  </Text>
                </View>
              )}

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
              {item.winner.name === '' ? (
                <View style={tw.style('flex-1')}>
                  <Text style={styles.text}>Stôl: {item.table}</Text>
                </View>
              ) : (
                <></>
              )}

              <View style={tw.style('flex-1')}>
                {isWinner ? (
                  <View>
                    <Text style={styles.text}>
                      Víťaz:{' '}
                      {item.winner.name +
                        ' ' +
                        item.winner.username +
                        ' ' +
                        item.score}
                    </Text>
                  </View>
                ) : (
                  <></>
                )}
                {winnerVisibility && item.playerTwo.username !== '' ? (
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
                          // setWinner(
                          //   item.playerOne.id,
                          //   item.playerOne.id,
                          //   item.playerTwo.id,
                          //   item.table
                          // )
                          {
                            item.player1Input = true
                            setPlayer1Input(true)
                            console.log(item.player1Input)
                          }
                        }
                      >
                        <Text
                          style={tw.style(
                            'text-xl',
                            'font-bold',
                            'text-center'
                          )}
                        >
                          Hráč 1.
                        </Text>
                      </TouchableOpacity>

                      {item.player1Input && player1Input ? (
                        <View style={tw.style('m-1.5')}>
                          <Text style={tw.style('text-xl', 'font-semibold')}>
                            Zadaj skóre zápasu:
                          </Text>
                          <TextInput
                            id="scoreInput"
                            style={styles.input}
                            label="Name"
                            placeholder="Meno"
                            value={score.value}
                            onChangeText={(text) => setScore({ value: text })}
                          />
                          <CustomButton
                            title="Potvrdiť"
                            style={{ width: '80%', marginTop: 24 }}
                            onPressFunction={() => {
                              const regex = /^([0-9]{1})+:([0-9]{1})$/
                              if (!regex.test(score.value)) {
                                Alert.alert('Error', 'Zlý format')
                              } else {
                                setWinner(
                                  item.playerOne.id,
                                  item.playerOne.id,
                                  item.playerTwo.id,
                                  item.table
                                )
                                setPlayer1Input(false)
                                item.player1Input = false
                              }
                            }}
                          />
                        </View>
                      ) : (
                        <></>
                      )}
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
                        onPress={() => {
                          item.player2Input = true
                          setPlayer2Input(true)
                        }}
                      >
                        <Text
                          style={tw.style(
                            'text-xl',
                            'font-bold',
                            'text-center'
                          )}
                        >
                          Hráč 2.
                        </Text>
                      </TouchableOpacity>
                      {item.player2Input && player2Input ? (
                        <View style={tw.style('m-1.5')}>
                          <Text style={tw.style('text-xl', 'font-semibold')}>
                            Zadaj skóre zápasu:
                          </Text>
                          <TextInput
                            id="score2Input"
                            style={styles.input}
                            label="Name"
                            placeholder="Meno"
                            value={score.value}
                            onChangeText={(text) => setScore({ value: text })}
                          />
                          <CustomButton
                            title="Potvrdiť"
                            style={{ width: '80%', marginTop: 24 }}
                            onPressFunction={() => {
                              const regex = /^([0-9]{1})+:([0-9]{1})$/
                              if (!regex.test(score.value)) {
                                Alert.alert('Error', 'Zlý format')
                              } else {
                                setWinner(
                                  item.playerTwo.id,
                                  item.playerOne.id,
                                  item.playerTwo.id,
                                  item.table
                                )
                                item.player2Input = false
                                setPlayer2Input(false)
                              }
                            }}
                          />
                        </View>
                      ) : (
                        <></>
                      )}
                    </View>
                  </View>
                ) : (
                  <></>
                )}
              </View>
            </View>
          </View>
        )}
      />
      <View>
        {userType === 'admin' && isOwner ? (
          <TouchableOpacity
            style={tw.style(
              'bg-red-500',
              'h-14',
              'p-1.5',
              'items-center',
              'justify-center'
            )}
            onPress={() => deleteTournament()}
          >
            <Text style={tw.style('text-xl', 'font-bold', 'text-center')}>
              Zrušenie turnaju
            </Text>
          </TouchableOpacity>
        ) : (
          <></>
        )}
      </View>
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
  input: {
    borderWidth: 1,
    width: 300,
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 20,
  },
})
