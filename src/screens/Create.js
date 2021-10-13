import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import BackButton from '../utils/backButton'

export default function Create({ navigation }) {
    const visitHome = () => {
        navigation.replace('Home')
    }

    return ( <
        View style = { styles.body } > {
            /* <View style={styles.backButton}>
                    <BackButton title="back" onPressFunction={visitHome} />
                  </View> */
        } <
        BackButton goBack = { visitHome }
        /> <
        View >
        <
        Text > TTT creation < /Text> <
        /View> <
        /View>
    )
}

const styles = StyleSheet.create({
    backButton: {
        flex: 1,
        backgroundColor: '#000000',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    body: {
        flex: 1,
    },
})