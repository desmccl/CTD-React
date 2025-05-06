import { useEffect } from "react"

function preventRefresh(event) {
    event.preventDefault()
}

const TodosViewForm = ({sortDirection, setSortDirection, sortField, setSortField, queryString, setQueryString}) => {
    return (
        <form onSubmit={preventRefresh}>
            <div>
                <label htmlFor="queryString">Search Todos</label>
                <input type="text" value={queryString} onChange={((e)=> {setQueryString(e.target.value)})}/>
                <button type="button" onClick={() => setQueryString("")}>Clear</button>
            </div>
            <div>
                <label htmlFor="sortField">Sort by</label>
                <select id="sortField" value={sortField} onChange={(event) => setSortField(event.target.value)}>
                    <option value="title">Title</option>
                    <option value="createdTime">Time added</option>
                </select>
            </div>
        </form>
    )
}

export default TodosViewForm