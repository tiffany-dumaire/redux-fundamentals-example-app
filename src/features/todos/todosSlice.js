import { client } from '../../api/client'

const initialState = []
  
/*function nextTodoId(todos) {
    const maxId = todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1)
    return maxId + 1
}*/

export default function todosReducer(state = initialState, action) {
    switch (action.type) {
      case 'todos/todoAdded': {
        // Can return just the new todos array - no extra object around it
        return [
          ...state,
          action.payload
        ]
      }
      case 'todos/todoToggled': {
        return state.map(todo => {
          if (todo.id !== action.payload) {
            return todo
          }
  
          return {
            ...todo,
            completed: !todo.completed
          }
        })
      }
      case 'todos/todosLoaded': {
        // Replace the existing state entirely by returning the new value
        return action.payload
      }
      case 'todos/colorSelected': {
        const { color, todoId } = action.payload
        return state.map((todo) => {
          if (todo.id !== todoId) {
            return todo
          }
  
          return {
            ...todo,
            color,
          }
        })
      }
      case 'todos/todoDeleted': {
        return state.filter((todo) => todo.id !== action.payload)
      }
      case 'todos/allCompleted': {
        return state.map((todo) => {
          return { ...todo, completed: true }
        })
      }
      case 'todos/completedCleared': {
        return state.filter((todo) => !todo.completed)
      }
      default:
        return state
    }
}

export const todosLoaded = todos => {
  return {
    type: 'todos/todosLoaded',
    payload: todos
  }
}

export const todoAdded = todo => ({ type: 'todos/todoAdded', payload: todo })

/*export async function fetchTodos(dispatch, getState) {
  const response = await client.get('/fakeApi/todos')
  //const stateBefore = getState()
  //console.log('Todos before dispatch: ', stateBefore.todos.length)
  dispatch(todosLoaded(response.todos))

  //const stateAfter = getState()
  //console.log('Todos after dispatch: ', stateAfter.todos.length)
}*/

export const fetchTodos = () => async dispatch => {
  const response = await client.get('/fakeApi/todos')
  dispatch(todosLoaded(response.todos))
}

// Write a synchronous outer function that receives the `text` parameter:
export function saveNewTodo(text) {
  // And then creates and returns the async thunk function:
  return async function saveNewTodoThunk(dispatch, getState) {
    // ✅ Now we can use the text value and send it to the server
    const initialTodo = { text }
    const response = await client.post('/fakeApi/todos', { todo: initialTodo })
    dispatch(todoAdded(response.todo))
  }
}