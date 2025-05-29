import './App.css'
import TodoList from './features/TodoList/TodoList'
import TodoForm from './features/TodoForm'
import { useEffect, useState, useReducer } from 'react'
import TodosViewForm from './features/TodosViewForm'
import { useCallback } from 'react'
import styles from './App.module.css'
import { todosReducer as todosReducer, actions as todoActions, initialState as initialTodosState,} from './reducers/todo.reducer'

const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
const token = `Bearer ${import.meta.env.VITE_PAT}`;



function App() {

const [todoState, dispatch] = useReducer(todosReducer, initialTodosState);

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
    dispatch({ type: todoActions.fetchTodos });

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
      dispatch({ type: todoActions.loadTodos, records: data.records });
    } catch (error) {
      dispatch({ type: todoActions.setLoadError, error });
    }

  };

  fetchTodos();
}, [encodeUrl]);



const handleAddTodo = async (newTodo) => {
  dispatch({ type: todoActions.startRequest });
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
      
    const resp = await fetch(encodeUrl(), options);
    if (!resp.ok) {
      throw new Error(resp.message);
    }
    const { records } = await resp.json()
    dispatch({ type: todoActions.addTodo, record: records[0] });

  } catch (error) {
    dispatch({ type: todoActions.setLoadError, error });
  } finally {
    dispatch({ type: todoActions.endRequest });
  }
};



const completeTodo = async (Id) => {
  const originalTodo = todoState.todoList.find((todo) => todo.id === Id);
  const completedTodo = { ...originalTodo, isCompleted: true };

  dispatch({ type: todoActions.completeTodo, id: completedTodo.id });
  
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
    dispatch({ type: todoActions.updateTodo, updatedTodo: records[0] });
  } catch (error) {
     dispatch({ type: todoActions.setLoadError, error });
    dispatch({ type: todoActions.revertTodo, previousTodos: todoState.todoList });
  }
}


const updateTodo = async (editedTodo) => {
  const originalTodo = todoState.todoList.find((todo) => todo.id === editedTodo.id);

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
    dispatch({ type: todoActions.updateTodo, todo: records[0] });
    
  } catch (error) {
   dispatch({ type: todoActions.setLoadError, error });
    dispatch({ type: todoActions.revertTodo, previousTodos: todoState.todoList });
  } finally {
    dispatch({ type: todoActions.endRequest });
  }
};



  return (
    <div className={styles.appContainer}>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={handleAddTodo}/>
      <TodoList todoList={todoState.todoList} onCompleteTodo={completeTodo} onUpdateTodo={updateTodo} isLoading={todoState.isLoading}/>
      
      <TodosViewForm sortDirection={sortDirection} setSortDirection={setSortDirection} sortField={sortField} setSortField={setSortField} queryString={queryString} setQueryString={setQueryString}/>
      {todoState.errorMessage && (
      <div className={styles.errorMessage}>
        <p>{todoState.errorMessage}</p>
        <button onClick={() => dispatch({ type: todoActions.clearError })}>Dismiss</button>
      </div>
    )}
    </div>
  )
}

export default App
