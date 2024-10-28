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
  QuerySnapshot,
} from "firebase/firestore";

// DB 파이어베이스설정//
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyCoTdQtuAwJ5FVMMj1WXxeyTsB6565c_5Q",
  authDomain: "mytodolist-app-aa9c6.firebaseapp.com",
  projectId: "mytodolist-app-aa9c6",
  storageBucket: "mytodolist-app-aa9c6.appspot.com",
  messagingSenderId: "765277374961",
  appId: "1:765277374961:web:64d1a9c5d8de3fd50e9c50",
  measurementId: "G-3MHNM59E2D",
};

// Initialize Firebase

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
  /* todo아이템에 있는 모든 아이템을 읽어오는 코드*/
    useEffect(() => {
        getDocs(collection(db, "todoItem")).then((querySnapshot) => {
          const firestoreTodoItemList = [];
          querySnapshot.forEach((doc) => {
            firestoreTodoItemList.push({
              id: doc.id,
              todoItemContent: doc.data().todoItemContent,
             isFinished: doc.data().isFinished,
           });
          });
          setTodoItemList(firestoreTodoItemList);
        });
      }, []);
    

  const onSubmit = async (newTodoItem) => {
    const docRef = await addDoc(collection(db, "todoItem"), {
      todoItemContent: newTodoItem,
      isFinished: false,
    });
    setTodoItemList([
      ...todoItemList,
      {
        id: docRef.id,
        todoItemContent: newTodoItem,
        isFinished: false,
      },
    ]);
  };

  //클릭했을때 db상태변경
  const onTodoItemClick = async (clickedTodoItem) => {
    const todoItemRef = doc(db, "todoItem", clickedTodoItem.id);
    await setDoc(
      todoItemRef,
      { isFinished: !clickedTodoItem.isFinished },
      { merge: true }
    );

    setTodoItemList(
      todoItemList.map((todoItem) => {
        if (clickedTodoItem.id === todoItem.id) {
          return {
            id: clickedTodoItem.id,
            todoItemContent: clickedTodoItem.todoItemContent,
            isFinished: !clickedTodoItem.isFinished,
          };
        } else {
          return todoItem;
        }
      })
    );
  };

  const onRemoveClick = async (removedTodoItem) => {
    const todoItemRef = doc(db, "todoItem", removedTodoItem.id); //버튼을 이용해 지울때 DB 환경도 같이 삭제되는 로직입니다.//
    await deleteDoc(todoItemRef);

    setTodoItemList(
      todoItemList.filter((todoItem) => {
        return todoItem.id !== removedTodoItem.id;
      })
    );
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
