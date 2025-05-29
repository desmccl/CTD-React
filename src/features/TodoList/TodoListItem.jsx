import TextInputWithLabel from "../../shared/TextInputWithLabel";
import { useEffect, useState } from "react";
import styles from "./TodoListItem.module.css";

const TodoListItem = ({todo, onCompleteTodo, onUpdateTodo}) => {
    const [isEditing, setIsEditing] = useState (false)
    const [workingTitle, setWorkingTitle] = useState (todo.title)

    useEffect(() => {
        setWorkingTitle(todo.title);
    }, [todo]);
 
    function handleCancel (){
        setWorkingTitle(todo.title)
        setIsEditing(false)
    }

    function handleEdit (event) {
        setWorkingTitle(event.target.value)
    }

    function handleUpdate (event) {
        if (!isEditing) return 
        event.preventDefault()

        onUpdateTodo({...todo, title: workingTitle})
        setIsEditing(false);
            
    }
    return ( 
        <li className={styles.todoItem}>
            <form onSubmit={handleUpdate}>
                {isEditing ? (
                    <>
                    <TextInputWithLabel value={workingTitle} onChange={handleEdit}/>
                    <button type="button" onClick={handleCancel}>Cancel</button>
                    <button type="button" onClick={handleUpdate}>Update</button>
                </>) : (
                <>
                <label className={styles.label}>
                    <input 
                type="checkbox"
                id={`checkbox${todo.id}`}
                checked={todo.isCompleted}
                onChange={() => onCompleteTodo(todo.id)}
                />
                </label>
                
        <span onClick={() => setIsEditing(true)}>{todo.title}</span> 
                
                </>
                )}
                
            </form>
              
        
        </li>
    )
}

export default TodoListItem