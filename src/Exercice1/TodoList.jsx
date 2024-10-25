import React, { useReducer, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import './todo.css';

const initialState = {
  todos: [],
  editIndex: null,
};

function todoReducer(state, action) {
  switch (action.type) {
    case 'SET_TODOS':
      return { ...state, todos: action.payload };
    case 'ADD_TODO':
      return { ...state, todos: [...state.todos, action.payload], editIndex: null };
    case 'UPDATE_TODO':
      return {
        ...state,
        todos: state.todos.map((todo, idx) =>
          idx === state.editIndex ? action.payload : todo
        ),
        editIndex: null,
      };
    case 'DELETE_TODO':
      return { ...state, todos: state.todos.filter((_, idx) => idx !== action.payload) };
    case 'SET_EDIT_INDEX':
      return { ...state, editIndex: action.payload };
    default:
      return state;
  }
}

export default function Todo() {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  const [input, setInput] = useState('');

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos')
      .then((response) => response.json())
      .then((data) =>
        dispatch({ type: 'SET_TODOS', payload: data.slice(0, 6).map((todo) => todo.title) })
      )
      .catch((error) => console.error(error));
  }, []);

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (input.trim()) {
      if (state.editIndex !== null) {
        dispatch({ type: 'UPDATE_TODO', payload: input });
      } else {
        dispatch({ type: 'ADD_TODO', payload: input });
      }
      setInput('');
    }
  };

  const handleDeleteTodo = (index) => {
    dispatch({ type: 'DELETE_TODO', payload: index });
  };

  const handleEditTodo = (index) => {
    setInput(state.todos[index]);
    dispatch({ type: 'SET_EDIT_INDEX', payload: index });
  };

  return (
    <div className='container mt-5'>
      <h1 className='text-center my-4 text-light'>What's the Plan for Today?</h1>
      <form onSubmit={handleAddTodo} className='d-flex justify-content-center mb-4'>
        <input
          type='text'
          className='form-control w-50 me-3 custom-input'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Add a todo'
        />
        <button type='submit' className='btn custom-add-btn'>
          {state.editIndex !== null ? 'Update' : 'Add Todo'}
        </button>
      </form>

      <ul className='list-group'>
        {state.todos.map((todo, index) => (
          <li key={index} className='list-group-item d-flex justify-content-between align-items-center mb-2 custom-todo-item'>
            {todo}
            <div>
              <button onClick={() => handleDeleteTodo(index)} className='btn custom-delete-btn me-2'>
                <MdDelete />
              </button>
              <button onClick={() => handleEditTodo(index)} className='btn custom-edit-btn'>
                <FaEdit />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}