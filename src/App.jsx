import './App.css'
import { useEffect, useState, useReducer } from 'react'
import TodosPage from './pages/TodosPage';
import About from './pages/About';
import NotFound from './pages/NotFound';
import Header from './shared/Header';
import { useLocation,Route,Routes } from 'react-router';
import { useCallback } from 'react';
import styles from './App.module.css';
import { todosReducer as todosReducer, actions as todoActions, initialState as initialTodosState,} from './reducers/todo.reducer'


const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
const token = `Bearer ${import.meta.env.VITE_PAT}`;



function App() {

const [todoState, dispatch] = useReducer(todosReducer, initialTodosState);

const [sortField,setSortField] = useState("createdTime");
const [sortDirection, setSortDirection] = useState("desc");
const [queryString, setQueryString] = useState("");

const location = useLocation();
const [title, setTitle] = useState("My Todos");




const encodeUrl = useCallback(()=>{
  
  let searchQuery = "";

  let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
  
  if (queryString) {
    searchQuery = `&filterByFormula=SEARCH("${queryString}",title)`;
  }

  return encodeURI(`${url}?${sortQuery}${searchQuery}`);
}, [queryString, sortDirection, sortField]);

useEffect(()=> {
  switch (location.pathname) {
    case "/":
      setTitle("My Todos");
      break;
      case "/about":
        setTitle("About");
        break;
        default:
          setTitle("Not Found");
          break;
  }
}, [location])



useEffect(() => {
  const fetchTodos = async () => {
    dispatch({ type: todoActions.fetchTodos });

    const options = {
      method: "GET",
      headers: {
        "Authorization": token
      },
    };

    try {
      const resp = await fetch(encodeUrl(), options);
      if (!resp.ok) {
        throw new Error(resp.message);
      };

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
      <Header title={title}/>
      <Routes>
        <Route
        path="/"
        element={
          <TodosPage
      todoState={todoState}
      handleAddTodo={handleAddTodo}
      completeTodo={completeTodo}
      updateTodo={updateTodo}
      sortDirection={sortDirection} 
      setSortDirection={setSortDirection} 
      sortField={sortField} 
      setSortField={setSortField} 
      queryString={queryString}
      setQueryString={setQueryString}
      dispatch={dispatch}
      todoActions={todoActions}/>
        }
        />
        <Route path="/about" element = {<About/>}/>
        <Route path="/\*" element={<NotFound/>}/>
      </Routes>
      
    </div>
  )
}

export default App
