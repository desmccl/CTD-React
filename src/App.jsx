import './App.css'
import TodoList from './features/TodoList/TodoList'
import TodoForm from './features/TodoForm'
import { useEffect, useState } from 'react'
import TodosViewForm from './features/TodosViewForm'
import { useCallback } from 'react'
import styles from './App.module.css'

const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
const token = `Bearer ${import.meta.env.VITE_PAT}`;



function App() {

const [todoList, setTodoList] = useState([])
const [isLoading, setIsLoading] = useState(false)
const [errorMessage, setErrorMessage] = useState("")
const [isSaving, setIsSaving] = useState(false)
const [sortField,setSortField] = useState("createdTime")
const [sortDirection, setSortDirection] = useState("desc")
const [queryString, setQueryString] = useState("")

const encodeUrl = useCallback(()=>{let searchQuery = ""

  let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
  
  if (queryString) {
    searchQuery = `&filterByFormula=SEARCH("${queryString}",title)`
  }

  return encodeURI(`${url}?${sortQuery}${searchQuery}`);},[queryString, sortDirection, sortField])



useEffect(() => {
  const fetchTodos = async () => {
    setIsLoading(true)

    const options = {
      method: "GET",
      headers: {
        "Authorization": token
      }
    }

    try {
      const resp = await fetch(encodeUrl(), options);
      if (!resp.ok) {
        throw new Error(resp.message);
      }

      const data = await resp.json();
  
      const records = data.records;
      const todos = records.map(record => ({
        id: record.id,
        title: record.fields.title,
        isCompleted: record.fields.isCompleted || false
      }));
      setTodoList(todos);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }

  };

  fetchTodos();
}, [encodeUrl]);



const handleAddTodo = async (newTodo) => {
  
  const payload = {
      records: [
        {
          fields: {
            title: newTodo.title,
            isCompleted: newTodo.isCompleted,
          },
        },
      ],
    };
    const options = {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    try {
      setIsSaving(true)

    const resp = await fetch(encodeUrl(), options);
    if (!resp.ok) {
      throw new Error(resp.message);
    }
    const { records } = await resp.json()

    const savedTodo = {
      id: records[0].id,
      ...records[0].fields
    }

    if (!records[0].fields.isCompleted) {
      savedTodo.isCompleted = false;
    }

    setTodoList([...todoList, savedTodo])
  } catch (error) {
    console.error(error);
   setErrorMessage(error.message);
  } finally {
    setIsSaving(false);
  }
};

const completeTodo = async (Id) => {
  const originalTodo = todoList.find((todo) => todo.id === Id);
  const completedTodo = { ...originalTodo, isCompleted: true };
  const optimisticTodos = todoList.map((todo) =>
    todo.id === Id ? completedTodo : todo
  );
  setTodoList(optimisticTodos);

  const payload = {
    records: [
      {
        id: completedTodo.id,
        fields: {
          title: completedTodo.title,
          isCompleted: true,
        },
      },
    ],
  };

  const options = {
    method: "PATCH",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };

  try {
    const resp = await fetch(encodeUrl(), options);
    if (!resp.ok) {
      throw new Error(resp.message || "Failed to update todo");
    }

    const { records } = await resp.json();
    const updatedTodo = {
      id: records[0].id,
      ...records[0].fields,
    };

    if (!records[0].fields.isCompleted) {
      updatedTodo.isCompleted = false;
    }

    const updatedTodos = todoList.map((todo) =>
      todo.id === updatedTodo.id ? { ...updatedTodo } : todo
    );

    setTodoList(updatedTodos);
  } catch (error) {
    console.error("CompleteTodo Error:", error);
    setErrorMessage(`${error.message}. Reverting todo...`);

    const revertedTodos = todoList.map((todo) =>
      todo.id === originalTodo.id ? originalTodo : todo
    );
    setTodoList(revertedTodos);
  }
}


const updateTodo = async (editedTodo) => {
  const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);
  if (!originalTodo) return;

  const payload = {
    records: [
      {
        id: editedTodo.id,
        fields: {
          title: editedTodo.title,
          isCompleted: editedTodo.isCompleted
        }
      }
    ]
  };

  const options = {
    method: 'PATCH',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  };

  try {
    const resp = await fetch(encodeUrl(), options);
    if (!resp.ok) {
      throw new Error("Failed to update todo.");
    }

    const { records } = await resp.json();
    const updatedTodo = {
      id: records[0].id,
      ...records[0].fields
    };

    

    if (!records[0].fields.isCompleted) {
      updatedTodo.isCompleted = false;
    }
    
    const updatedTodos = todoList.map((todo) =>
      todo.id === updatedTodo.id ? {...updatedTodo}  : todo
    );

    setTodoList(updatedTodos);
  } catch (error) {
    console.error(error);
    setErrorMessage(`${error.message}. Reverting todo...`);

    const revertedTodos = todoList.map((todo) =>
      todo.id === originalTodo.id ? originalTodo : todo
    );
    setTodoList([...revertedTodos])
  } finally {
    setIsSaving(false)
  }
};



  return (
    <div className={styles.appContainer}>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={handleAddTodo}/>
      <TodoList todoList={todoList} onCompleteTodo={completeTodo} onUpdateTodo={updateTodo} isLoading={isLoading}/>
      
      <TodosViewForm sortDirection={sortDirection} setSortDirection={setSortDirection} sortField={sortField} setSortField={setSortField} queryString={queryString} setQueryString={setQueryString}/>
      {errorMessage && (
      <div className={styles.errorMessage}>
        <p>{errorMessage}</p>
        <button onClick={() => setErrorMessage("")}>Dismiss</button>
      </div>
    )}
    </div>
  )
}

export default App
