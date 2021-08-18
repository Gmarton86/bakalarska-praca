import React, { useState } from "react";
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Tournaments() {
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
  return (
    <View style={styles.body}>
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
  },
});
