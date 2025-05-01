import TodoListItem from "./TodoListItem";

{/*extract from TodoList.jsx*/}

function TodoList({todoList, onCompleteTodo, onUpdateTodo, isLoading}) {
    const filteredTodoList = todoList.filter(todo => !todo.isCompleted);

    return (
        <> 
        {isLoading ? (<p>Todo list loading...</p>) : filteredTodoList.length === 0 ? (<p>Add todo above to get started</p>) : (<ul>
            {filteredTodoList.map(todo => (<TodoListItem key={todo.id} todo={todo} onCompleteTodo={onCompleteTodo} onUpdateTodo={onUpdateTodo}/>))}
        </ul>) } 
        </>
    );
}

export default TodoList