import { useRef } from "react";
import { useState } from 'react'
import TextInputWithLabel from "../shared/TextInputWithLabel";


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
            <TextInputWithLabel labelText="Todo" ref={todoTitleInput} value={workingTodo}
          onChange={(e) => setWorkingTodo(e.target.value)} elementId={"todoTitle"}></TextInputWithLabel>
            <button disabled={workingTodo===''}>Add Todo</button>
        </form>
    </div>
}

export default TodoForm