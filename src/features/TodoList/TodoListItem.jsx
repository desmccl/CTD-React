import TextInputWithLabel from "../../shared/TextInputWithLabel";
import { useState } from "react";

const TodoListItem = ({todo, onCompleteTodo, onUpdateTodo}) => {
    const [isEditing, setIsEditing] = useState (false)
    const [workingTitle, setWorkingTitle] = useState (todo.title.text)

    function handleCancel (){
        setWorkingTitle(todo.title.text)
        setIsEditing(false)
    }

    function handleEdit (event) {
        setWorkingTitle(event.target.value)
    }

    function handleUpdate (event) {
        if (!isEditing) return 
        event.preventDefault()

        onUpdateTodo({...todo, title: {text: workingTitle}})
        setIsEditing(false);
            
    }
    return ( 
        <li>
            <form onSubmit={handleUpdate}>
                {isEditing ? (
                    <>
                    <TextInputWithLabel value={workingTitle} onChange={handleEdit}/>
                    <button type="button" onClick={handleCancel}>Cancel</button>
                    <button type="button" onClick={handleUpdate}>Update</button>
                </>) : (
                <>
                <label>
                    <input 
                type="checkbox"
                id={`checkbox${todo.id}`}
                checked={todo.isCompleted}
                onChange={() => onCompleteTodo(todo.id)}
                />
                </label>
                
        <span onClick={() => setIsEditing(true)}>{todo.title.text}</span> 
                
                </>
                )}
                
            </form>
              
        
        </li>
    )
}

export default TodoListItem