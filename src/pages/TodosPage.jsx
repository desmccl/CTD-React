import React from 'react';
import TodoForm from '../features/TodoForm';
import TodoList from '../features/TodoList/TodoList';
import TodosViewForm from '../features/TodosViewForm';
import styles from '../App.module.css';

const TodosPage = ({
    todoState,
    handleAddTodo,
    completeTodo,
    updateTodo,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    queryString,
    setQueryString,
    dispatch,
    todoActions,
}) => {
   

    return (
        <>
        
      <TodoForm onAddTodo={handleAddTodo}/>
      <TodoList 
      todoList={todoState.todoList} 
      onCompleteTodo={completeTodo} 
      onUpdateTodo={updateTodo} 
      isLoading={todoState.isLoading}/>
      
      <TodosViewForm 
      sortDirection={sortDirection} 
      setSortDirection={setSortDirection} 
      sortField={sortField} 
      setSortField={setSortField} 
      queryString={queryString} 
      setQueryString={setQueryString}/>

      {todoState.errorMessage && (
      <div className={styles.errorMessage}>
        <p>{todoState.errorMessage}</p>
        <button onClick={() => dispatch({ type: todoActions.clearError })}>Dismiss</button>
      </div>
    )}
        </>
    );
};

export default TodosPage;