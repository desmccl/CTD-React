import TodoList from "../features/TodoList/TodoList"

export const actions = {
  fetchTodos: 'fetchTodos',
  loadTodos: 'loadTodos',
  setLoadError: 'setLoadError',
  startRequest: 'startRequest',
  addTodo: 'addTodo',
  endRequest: 'endRequest',
  updateTodo: 'updateTodo',
  completeTodo: 'completeTodo',
  revertTodo: 'revertTodo',
  clearError: 'clearError',
}

export function todosReducer(state, action) {
  switch (action.type) {
    case actions.fetchTodos:
      return { ...state, isLoading: true, errorMessage: null };
    case actions.loadTodos:
      return { ...state, todoList: action.payload, isLoading: false };
    case actions.setLoadError:
      return { ...state, isLoading: false, isSaving: false, errorMessage: action.payload };
    case actions.startRequest:
      return { ...state, isSaving: true, errorMessage: null };
    case actions.addTodo:
      return { ...state, todoList: [...state.todoList, action.payload] };
    case actions.endRequest:
      return { ...state, isSaving: false };
    case actions.updateTodo:
      return {
        ...state,
        todoList: state.todoList.map(todo =>
          todo.id === action.payload.id ? action.payload : todo
        ),
      };
    case actions.completeTodo:
      return {
        ...state,
        todoList: state.todoList.map(todo =>
          todo.id === action.payload
            ? { ...todo, isCompleted: !todo.isCompleted }
            : todo
        ),
      };
    case actions.revertTodo:
      return { ...state, todoList: action.payload, isSaving: false };
    case actions.clearError:
      return { ...state, errorMessage: null };
    default:
      return state;
  }
}

export const initialState = {
    todoList: [],
    isLoading: false,
    isSaving: false,
    errorMessage: null,
}