const TodoListItem = ({todo, onCompleteTodo}) => {
    return ( 
        <li>
            
                <input 
                type="checkbox"
                checked={todo.isCompleted}
                onChange={() => onCompleteTodo(todo.id)}
                />
        {todo.title.text}
        
        </li>
    )
}

export default TodoListItem