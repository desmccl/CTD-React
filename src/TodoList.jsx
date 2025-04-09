import TodoListItem from "./TodoListItem";

{/*extract from TodoList.jsx*/}

function TodoList({todoList}){

    return (
        <ul>
            {todoList.map(todo => <TodoListItem key={todo.id} todo={todo} />)}
        </ul>
    );
}

export default TodoList