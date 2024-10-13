import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View,FlatList, SafeAreaView } from "react-native";

export default function App() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const response = await fetch("http://localhost:8000/todos/1");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <FlatList
          data={todos}
          keyExtractor={(todo) => todo.id.toString()}
          renderItem={({ item }) => <Text style={styles.todoItem}>{item.title}</Text>}
          ListHeaderComponent={() => <Text style={styles.title}>Today</Text>}
          contentContainerStyle={styles.contentContainerStyle}
        />
      </SafeAreaView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:"#E9E9EF",
  }, contentContainerStyle:{
    padding:15,
  }, title:{
    fontWeight:"800",
    fontSize:28,
    marginBottom:15,
  }

});
