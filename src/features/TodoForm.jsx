import { useRef } from "react";
import { useState } from 'react'
import TextInputWithLabel from "../shared/TextInputWithLabel";
import styled from 'styled-components';

function TodoForm ({onAddTodo}) {

const StyledForm = styled.form`
  padding: 12px;
`;

const StyledButton = styled.button`
  padding: 8px 12px;
  font-style: ${(props) => (props.disabled ? 'italic' : 'normal')};
`;

    const [workingTodo, setWorkingTodo] = useState('')

    const todoTitleInput = useRef(null)

    function handleAddTodo(event){
        event.preventDefault()
        onAddTodo({ id: Date.now(), title: workingTodo, isCompleted: false});
        setWorkingTodo('')
        todoTitleInput.current.focus();
    }

    return <div>
        <StyledForm onSubmit={handleAddTodo}>
            <TextInputWithLabel labelText="Todo" ref={todoTitleInput} value={workingTodo}
          onChange={(e) => setWorkingTodo(e.target.value)} elementId={"todoTitle"}></TextInputWithLabel>
            <StyledButton disabled={workingTodo===''}>Add Todo</StyledButton>
        </StyledForm>
    </div>
}

export default TodoForm