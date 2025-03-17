import { Text, TextInput, Linking, Pressable, View, StyleSheet, FlatList, Modal } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { data } from '@/data/todos';
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function Index() {
  const [todos, setTodos] = useState(data.sort((a, b) => b.id - a.id));
  const [text, setText] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editText, setEditText] = useState('');

  const addTodo = () => {
    if (text.trim()) {
      const newId = todos.length > 0 ? todos[0].id + 1 : 1;
      setTodos([{ id: newId, title: text, completed: false }, ...todos]);
      setText('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const removeTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const openEditModal = (todo) => {
    setEditingTodo(todo);
    setEditText(todo.title);
    setModalVisible(true);
  };

  const handleSaveEdit = () => {
    if (editingTodo) {
      setTodos(todos.map(todo =>
        todo.id === editingTodo.id ? { ...todo, title: editText } : todo
      ));
      setModalVisible(false);
      setEditingTodo(null);
      setEditText('');
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const renderItem = ({ item }) => (
    <View style={[styles.todoItem, { borderBottomColor: darkMode ? 'gray' : 'lightgray' }]}>
      <Text
        style={[
          styles.todoText,
          { color: darkMode ? "white" : "black" },
          item.completed && { textDecorationLine: 'line-through', color: 'gray' }
        ]}
        onPress={() => toggleTodo(item.id)}
      >
        {item.title}
      </Text>
      <Pressable 
        onPress={() => openEditModal(item)}
        style={[styles.button, { backgroundColor: darkMode ? "#444" : "#ddd"}]}
      >
        <AntDesign name="edit" size={24} color={darkMode ? "white" : "black"} />
      </Pressable>
      <Pressable 
        onPress={() => removeTodo(item.id)} 
        style={[styles.button, { backgroundColor: darkMode ? "#444" : "#ddd"}]}
      >
        <MaterialIcons name="delete-forever" size={24} color={darkMode ? "white" : "black"} />
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: darkMode ? "black" : "white" }]}>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { color: darkMode ? "white" : "black", borderColor: darkMode ? "gray" : "black" }]}
          placeholder="Add a new todo"
          placeholderTextColor={darkMode ? "gray" : "darkgray"}
          value={text}
          onChangeText={setText}
        />
        <Pressable 
          onPress={addTodo} 
          style={[styles.button, { backgroundColor: darkMode ? "#444" : "#ddd" }]}
        >
          <Text style={[styles.buttonText, { color: darkMode ? "white" : "black" }]}>Add</Text>
        </Pressable>
        <Pressable 
          onPress={toggleDarkMode} 
          style={[styles.button, { backgroundColor: darkMode ? "#444" : "#ddd" }]}
        >
          {darkMode ? (
            <Feather name="sun" size={24} color="white" />
          ) : (
            <Feather name="moon" size={24} color="black" />
          )}
        </Pressable>
      </View>
      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ flexGrow: 1 }}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: darkMode ? "#333" : "white" }]}>
            <Text style={[styles.modalTitle, { color: darkMode ? "white" : "black" }]}>
              Edit this Todo
            </Text>
            <TextInput 
              style={[styles.modalInput, { color: darkMode ? "white" : "black", borderColor: darkMode ? "gray" : "black" }]}
              value={editText}
              onChangeText={setEditText}
            />
            <View style={styles.modalButtonContainer}>
              <Pressable 
                onPress={handleSaveEdit} 
                style={[styles.modalButton, { backgroundColor: darkMode ? "#444" : "#ddd"}]}
              >
                <Text style={[styles.buttonText, { color: darkMode ? "white" : "black" }]}>Save</Text>
              </Pressable>
              <Pressable 
                onPress={() => setModalVisible(false)} 
                style={[styles.modalButton, { backgroundColor: darkMode ? "#444" : "#ddd"}]}
              >
                <Text style={[styles.buttonText, { color: darkMode ? "white" : "black" }]}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <View style={{padding: 10, borderTopWidth: 1, borderTopColor: darkMode ? "white" : "black" }}>
        <Text style={{color: darkMode ? "white" : "black", display: 'flex', gap: 5, justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
          Developed by Milyaz Kamil
          <Pressable onPress={() => Linking.openURL('https://github.com')}>
            <AntDesign name="github" size={24} color={darkMode ? "white" : "black"} />
          </Pressable>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    width: '100%',
    maxWidth: 1024,
    marginHorizontal: 'auto',
    pointerEvents: 'auto',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    fontSize: 18,
    minWidth: 0,
  },
  button: {
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    width: '100%',
    maxWidth: 1024,
    marginHorizontal: 'auto',
    pointerEvents: 'auto',
  },
  todoText: {
    flex: 1,
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    fontSize: 18,
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
});