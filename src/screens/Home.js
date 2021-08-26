import React, { useState } from "react";
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import TextButton from "../utils/textButton";

export default function Tournaments({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [Items, setItems] = useState([
    { name: "turnaj 1" },
    { name: "turnaj 2" },
    { name: "turnaj 3" },
  ]);

  const onRefresh = () => {
    setRefreshing(true);
    //function
    setRefreshing(false);
  };

  const visitLogin = () => {
    navigation.replace("Login");
  };

  return (
    <View style={styles.body}>
      <View style={styles.login}>
        <TextButton title="Prihlásenie" onPressFunction={visitLogin} />
      </View>

      <Text style={styles.text}>Prebiehajúce turnaje</Text>
      <FlatList
        keyExtractor={(item, index) => index.toString()}
        data={Items}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.text}>{item.name}</Text>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: "#FFFFFF",
    flex: 1,
  },
  text: {
    fontSize: 30,
    color: "#000000",
  },
  item: {
    margin: 5,
    backgroundColor: "#4ae",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  login: {
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "flex-end",
  },
});
