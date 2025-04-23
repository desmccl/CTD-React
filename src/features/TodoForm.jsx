import { useRef } from "react";
import { useState } from 'react'


function TodoForm ({onAddTodo}) {

    const [workingTodo, setWorkingTodo] = useState('')

    const todoTitleInput = useRef(null)

    function handleAddTodo(event){
        event.preventDefault()
        onAddTodo({ id: Date.now(), text: workingTodo });
        setWorkingTodo('')
        todoTitleInput.current.focus();
    }

    return <div>
        <form onSubmit={handleAddTodo}>
            <label htmlFor="todoTitle">Todo</label>
            <input id="todoTitle" name="title" ref={todoTitleInput} value={workingTodo}
          onChange={(e) => setWorkingTodo(e.target.value)}
          ></input>
            <button disabled={workingTodo===''}>Add Todo</button>
        </form>
    </div>
}

export default TodoForm