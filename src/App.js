import "./App.css";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  doc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

// Firebase 초기화 코드
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCoTdQtuAwJ5FVMMj1WXxeyTsB6565c_5Q",
  authDomain: "mytodolist-app-aa9c6.firebaseapp.com",
  projectId: "mytodolist-app-aa9c6",
  storageBucket: "mytodolist-app-aa9c6.appspot.com",
  messagingSenderId: "765277374961",
  appId: "1:765277374961:web:64d1a9c5d8de3fd50e9c50",
  measurementId: "G-3MHNM59E2D",
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

const TodoItemInputField = (props) => {
  const [input, setInput] = useState("");

  const onSubmit = () => {
    props.onSubmit(input);
    setInput("");
  };

  return (
    <div>
      <TextField
        id="todo-item-input"
        label="Todo Item"
        variant="outlined"
        onChange={(e) => setInput(e.target.value)}
        value={input}
      />
      <Button variant="outlined" onClick={onSubmit}>
        Submit
      </Button>
    </div>
  );
};

const TodoItem = (props) => {
  const style = props.todoItem.isFinished
    ? { textDecoration: "line-through" }
    : {};
  return (
    <li>
      <span style={style} onClick={() => props.onTodoItemClick(props.todoItem)}>
        {props.todoItem.todoItemContent}
      </span>
      <Button
        variant="outlined"
        onClick={() => props.onRemoveClick(props.todoItem)}
      >
        Remove
      </Button>
    </li>
  );
};

const TodoItemList = (props) => {
  const todoList = props.todoItemList.map((todoItem, index) => {
    return (
      <TodoItem
        key={index}
        todoItem={todoItem}
        onTodoItemClick={props.onTodoItemClick}
        onRemoveClick={props.onRemoveClick}
      />
    );
  });
  return (
    <div>
      <ul>{todoList}</ul>
    </div>
  );
};

function App() {
  const [todoItemList, setTodoItemList] = useState([]);

  const syncTodoItemListStateWithFirestore = () => {
    const q = query(collection(db, "todoItem"), orderBy("createdTime", "desc"));
    getDocs(q).then((querySnapshot) => {
      const firestoreTodoItemList = [];
      querySnapshot.forEach((doc) => {
        firestoreTodoItemList.push({
          id: doc.id,
          todoItemContent: doc.data().todoItemContent,
          isFinished: doc.data().isFinished,
          createdTime: doc.data().createdTime ?? 0,
        });
      });
      setTodoItemList(firestoreTodoItemList);
    });
  };

  useEffect(() => {
    syncTodoItemListStateWithFirestore();
  }, []);

  const onSubmit = async (newTodoItem) => {
    await addDoc(collection(db, "todoItem"), {
      todoItemContent: newTodoItem,
      isFinished: false,
      createdTime: Math.floor(Date.now() / 1000),
    });
    syncTodoItemListStateWithFirestore();
  };

  const onTodoItemClick = async (clickedTodoItem) => {
    const todoItemRef = doc(db, "todoItem", clickedTodoItem.id);
    await setDoc(todoItemRef, { isFinished: !clickedTodoItem.isFinished }, { merge: true });
    syncTodoItemListStateWithFirestore();
  };

  const onRemoveClick = async (removedTodoItem) => {
    const todoItemRef = doc(db, "todoItem", removedTodoItem.id);
    await deleteDoc(todoItemRef);
    syncTodoItemListStateWithFirestore();
  };

  return (
    <div className="App">
      <TodoItemInputField onSubmit={onSubmit} />
      <TodoItemList
        todoItemList={todoItemList}
        onTodoItemClick={onTodoItemClick}
        onRemoveClick={onRemoveClick}
      />
    </div>
  );
}

export default App;
