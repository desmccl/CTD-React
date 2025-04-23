import './App.css'
import TodoList from './features/TodoList/TodoList'
import TodoForm from './features/TodoForm'
import { useState } from 'react'

function App() {

const [todoList, setTodoList] = useState([])

const handleAddTodo = (newTodoTitle) => {

  const newTodo = {
    id: Date.now(),
    title: newTodoTitle,
    isCompleted: false,
  };


  setTodoList([...todoList, newTodo]);
};

function completeTodo(Id) {
  const updatedTodos = todoList.map((todo) => {
    if (todo.id === Id) {
      return {...todo, isCompleted: true};
    }
    return todo;
  });
  setTodoList(updatedTodos);
};



  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={handleAddTodo}/>
      <TodoList todoList={todoList} onCompleteTodo={completeTodo}/>
    </div>
  )
}

export default App
