import { useRef } from "react";


function TodoForm ({onAddTodo}) {

    const todoTitleInput = useRef(null)
    function handleAddTodo(event){
        event.preventDefault()
        const title = event.target.title.value.trim();
        onAddTodo({ id: Date.now(), text: title });
        event.target.title.value = ""
        todoTitleInput.current.focus();
    }

    return <div>
        <form onSubmit={handleAddTodo}>
            <label htmlFor="todoTitle">Todo</label>
            <input id="todoTitle" name="title" ref={todoTitleInput}></input>
            <button>Add Todo</button>
        </form>
    </div>
}

export default TodoForm