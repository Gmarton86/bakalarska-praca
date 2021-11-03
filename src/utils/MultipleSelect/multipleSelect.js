import React, { Component, useState, useEffect } from 'react'
import { View } from 'react-native'
import MultiSelect from 'react-native-multiple-select'
import SQLite from 'react-native-sqlite-storage'
import { setRank } from '../../redux/actions'

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

export default function MultipleSelect([{selected, setSelected}]) {
  const [players, setPlayers] = useState([])
  //const [selected, setSelected] = useState([])
  const [reference, setReference] = useState()

  useEffect(() => {
    renderPlayers()
    //console.log(name)
  }, [])

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

  const onSelectedItemsChange = (selectedItems) => {
    setSelected(selectedItems)
  }

  return (
    <View>
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
  )
}
