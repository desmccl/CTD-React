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
      return { ...state, isLoading: true};
    case actions.loadTodos:
      return { ...state, todoList: action.records.map(record => ({
        id: record.id,
        title: record.fields.title,
        isCompleted: record.fields.isCompleted ?? false
      })), isLoading: false };
    case actions.setLoadError:
      return { ...state, isLoading: false, errorMessage: action.error.message };
    case actions.startRequest:
      return { ...state, isSaving: true};
    case actions.addTodo: {
        const savedTodo = {
            id: action.record.id,
            title: action.record.fields.title,
            isCompleted: action.record.fields.isCompleted ?? false
        }
      return { ...state, todoList: [...state.todoList, savedTodo], isSaving: false}};
    case actions.endRequest:
      return { ...state, isLoading: false, isSaving: false };
    case actions.updateTodo:
      return {
        ...state,
        todoList: state.todoList.map(todo =>
          todo.id === action.id ? {id: action.id,
            title: action.todo.fields.title,
            isCompleted: action.todo.fields.isCompleted ?? false} : todo
        ),
      };
    case actions.completeTodo:
      return {
        ...state,
        todoList: state.todoList.map(todo =>
          todo.id === action.id
            ? { ...todo, isCompleted: !todo.isCompleted }
            : todo
        ),
      };
    case actions.revertTodo:
      return { ...state, todoList: action.previousTodos, isSaving: false };
    case actions.clearError:
      return { ...state, errorMessage: "" };
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