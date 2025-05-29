import { useEffect, useState } from "react"
import styled from 'styled-components';

function preventRefresh(event) {
    event.preventDefault()
}

const TodosViewForm = ({sortDirection, setSortDirection, sortField, setSortField, queryString, setQueryString}) => {
    const [localQueryString, setLocalQueryString] = useState(queryString)

const StyledForm = styled.form`
  padding: 12px;
`;

    useEffect(()=> {
        const debounce = setTimeout(()=>{
            setQueryString(localQueryString)
        }, 500)
        return () => clearTimeout(debounce)
    }, [localQueryString, setQueryString])

    return (
        <StyledForm onSubmit={preventRefresh}>
            <div>
                <label htmlFor="queryString">Search Todos</label>
                <input type="text" value={localQueryString} onChange={((e)=> {setLocalQueryString(e.target.value)})}/>
                <button type="button" onClick={() => setLocalQueryString("")}>Clear</button>
            </div>
            <div>
                <label htmlFor="sortField">Sort by</label>
                <select id="sortField" value={sortField} onChange={(event) => setSortField(event.target.value)}>
                    <option value="title">Title</option>
                    <option value="createdTime">Time added</option>
                </select>
            </div>
        </StyledForm>
    )
}

export default TodosViewForm