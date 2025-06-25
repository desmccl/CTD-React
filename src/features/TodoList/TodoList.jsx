import TodoListItem from "./TodoListItem";
import styles from "./TodoList.module.css";
import {  useNavigate,useSearchParams } from "react-router";
import { useEffect } from "react";


function TodoList({todoList, onCompleteTodo, onUpdateTodo, isLoading}) {
    const filteredTodoList = todoList.filter(todo => !todo.isCompleted);
    const [searchParams, setSearchParams] = useSearchParams();
    
    const itemsPerPage = 10;
    
    const currentPage = parseInt(searchParams.get('page') || '1', 10);
    const indexOfFirstTodo = (currentPage - 1) * itemsPerPage;
    const totalPages = Math.ceil(filteredTodoList.length / itemsPerPage);
    const navigate = useNavigate();

const handlePreviousPage = () => {
    const prevPage = Math.max(currentPage - 1, 1);
    setSearchParams({ page: prevPage.toString() });
};

const handleNextPage = () => {
  const nextPage = Math.min(currentPage + 1, totalPages);
  setSearchParams({ page: nextPage.toString() });
};

useEffect(() => {
    if (totalPages > 0) {
  const isInvalid = isNaN(currentPage) || currentPage < 1 || currentPage > totalPages;

  if (isInvalid) {
    navigate("/");
  }
}
}, [currentPage, totalPages, navigate]);

    return (
        <> 
        {isLoading ? (<p>Todo list loading...</p>) : filteredTodoList.length === 0 ? (<p>Add todo above to get started</p>) : (<ul className={styles.todoList}>
            {filteredTodoList.slice(indexOfFirstTodo, indexOfFirstTodo + itemsPerPage).map(todo => (<TodoListItem key={todo.id} todo={todo} onCompleteTodo={onCompleteTodo} onUpdateTodo={onUpdateTodo}/>))}
        </ul>) } 
        <div>
            <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                Previous
            </button>
            <span>
                Page {currentPage} of {totalPages}
            </span>

            <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                Next
                </button>
        </div>
        </>
    );
}

export default TodoList