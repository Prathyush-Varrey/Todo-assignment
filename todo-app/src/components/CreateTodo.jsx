import { useState, useEffect } from 'react';
import axios from 'axios';

export default function CreateTodo() {
  const [task, setTask] = useState("");
  const [desc, setDesc] = useState("");
  const [todos, setTodos] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTodoIndex, setCurrentTodoIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

     // fetching the data using axios and setting it to data.json folder
  useEffect(() => {
    axios.get('http://localhost:3001/todos')
      .then(response => setTodos(response.data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

     // holding the task in setTask
  function handleTaskChange(e) {
    setTask(e.target.value);
  }

     // holding Description in setDesc
  function handleDescChange(e) {
    setDesc(e.target.value);
  }

     // holding search Qurey in the setSearchQuery
  function handleSearchQueryChange(e) {
    setSearchQuery(e.target.value);
  }

     // Adding new todo to the data.json file and displaying it on screen
  function addTodo() {
    if (task && desc) {
      const newTodo = { task, desc, read: false };
      axios.post('http://localhost:3001/todos', newTodo)
        .then(response => {
          setTodos([...todos, response.data]);
          setTask("");
          setDesc("");
        })
        .catch(error => console.error('Error adding todo:', error));
    }
  }

     // deleting the todo from data.json file and window screen
  function deleteTodo(id) {
    axios.delete(`http://localhost:3001/todos/${id}`)
      .then(() => {
        const newTodos = todos.filter(todo => todo.id !== id);
        setTodos(newTodos);
      })
      .catch(error => console.error('Error deleting todo:', error));
  }

     // reading the todo and setting it to data.json file as read
  function markAsRead(id) {
    const todo = todos.find(todo => todo.id === id);
    const updatedTodo = { ...todo, read: true };
    axios.put(`http://localhost:3001/todos/${id}`, updatedTodo)
      .then(response => {
        const newTodos = todos.map(todo =>
          todo.id === id ? response.data : todo
        );
        setTodos(newTodos);
      })
      .catch(error => console.error('Error marking todo as read:', error));
  }

  // updating the todo(making changes in title/description) updating it to json file and displaying
  function updateTodo() {
    const todo = todos.find(todo => todo.id === currentTodoIndex);
    const updatedTodo = { ...todo, task, desc };
    axios.put(`http://localhost:3001/todos/${currentTodoIndex}`, updatedTodo)
      .then(response => {
        const newTodos = todos.map(todo =>
          todo.id === currentTodoIndex ? response.data : todo
        );
        setTodos(newTodos);
        setTask("");
        setDesc("");
        setIsEditing(false);
        setCurrentTodoIndex(null);
      })
      .catch(error => console.error('Error updating todo:', error));
  }

     // editing the todos 
  function editTodo(id) {
    const todo = todos.find(todo => todo.id === id);
    setTask(todo.task);
    setDesc(todo.desc);
    setIsEditing(true);
    setCurrentTodoIndex(id);
  }

     // help function of searchQuery 
  const filteredTodos = todos.filter(todo =>
    todo.task.toLowerCase().includes(searchQuery.toLowerCase())
  );

return (
<div className="p-4">
          {/* Taking Task name as Input */}
          <div className="mb-4">
               <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="taskName">
                    Task Name
               </label>
               <input type="text" value={task} onChange={handleTaskChange} name="taskName" id="taskName" placeholder="Enter Your Task" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline" />
          </div>

          {/* Taking Description as Input */}
          <div className="mb-4">
               <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="taskDescription">
                    Task Description
               </label>
               <input type="text" value={desc} onChange={handleDescChange} name="taskDescription" id="taskDescription" placeholder="Enter Your Task Description"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline" />
          </div>

          {/* Search Todos implementation */}
          <div className="mb-4">
               <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="searchQuery">
                    Search Todos
               </label>
               <input type="text" value={searchQuery} onChange={handleSearchQueryChange} name="searchQuery" id="searchQuery"
                    placeholder="Search Todos" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline" />
          </div>

          {/* Add todo / Update Todo  implementation*/}
          <div>
               <button onClick={isEditing ? updateTodo : addTodo}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    {isEditing ? 'Update Todo' : 'Add Todo'}
               </button>
          </div>
          
          {/* Displaying Todo list here */}
     <div className="mt-4">
               <h2 className="text-xl font-bold">Todo List</h2>
               <ul>
                    {filteredTodos.map((todo) => (
               <li key={todo.id} className="mt-2">
                    <div className={`bg-gray-100 dark:bg-gray-800 p-2 rounded ${todo.read ? 'bg-green-100 dark:bg-green-700' : ''}`}>
                         <h3 className="font-bold">{todo.task}</h3>
                         <p>{todo.desc}</p>
                         {/* "Make as Read" "Update" & "Delete" buttons */}
                         <div className="mt-2">
                              {/* Make as Read Button */}
                              <button onClick={() => markAsRead(todo.id)}
                                   className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2">
                                   Mark As Read
                              </button>
                              {/* Update Todo Button */}
                              <button onClick={() => editTodo(todo.id)}
                                   className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2">
                                   Update
                              </button>
                              
                               {/* Delete Todo Button */}
                              <button onClick={() => deleteTodo(todo.id)}
                                   className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">
                                   Delete
                              </button>
                         </div>
                    </div>
               </li>
                ))}
               </ul>
     </div>
</div>
  );
}
