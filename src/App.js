import React, { useState, useRef, useEffect } from "react";
import Todo from "./components/Todo";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import {nanoid} from "nanoid";

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
	  console.log('ref curr: '+ref.current);
    ref.current = value;
  });
  return ref.current;
}

const FILTER_MAP = {
		All: ()=>true,
		Done: (task)=>(task.completed),
		Todo: (task)=>(!task.completed),
	};

const FILTER_NAMES = Object.keys(FILTER_MAP);

function App(props) {
	
	const [tasks, setTasks] = useState(props.tasks);
	const [filter, setFilter] = useState('All');
		
	
	const taskList = tasks
	.filter(FILTER_MAP[filter])
	.map(task => 
	{
		console.log('h123');
		return (<Todo 
		  name={task.name} 
		  id={task.id} 
		  completed={task.completed}
		  key={task.id}
		  toggleTaskCompleted={toggleTaskCompleted}
		  deleteTask={deleteTask}
		  editTask={editTask}
	/>)}
	);
	
	const filterButtons = FILTER_NAMES.map((name)=>
	<FilterButton 
	key={name} 
	name={name}
	setFilter={setFilter}
	isPressed={name===filter}
	/>
	);
	
	const tasksNoun = taskList.length !== 1 ? "tasks" : "task";
	const headingText = `${taskList.length} ${tasksNoun} remaining`;
	

	function editTask(id, newName){
		const updateTasks = tasks.map(task=>{
			if(task.id === id){
				return {...task, name:newName}; 
			}
			else
				return task;
		});
		setTasks(updateTasks);
	}

	function addTask(name){
		const id = `todo-${nanoid()}`;
		const last = {id, name, completed: false};
		setTasks([...tasks, last]);
	}
	
	function toggleTaskCompleted(id){
		const updatedTasks  = tasks.map(task => {
			if(task.id === id) 
				return {...task, completed:!task.completed}
			else 
				return task
		});
		setTasks(updatedTasks );
	}
	
	function deleteTask(id){
		const updatedTasks = tasks.filter(task=> id !== task.id);
		setTasks(updatedTasks);
	}
	const listHeadingRef = useRef(null);
	
	const prevTaskLength = usePrevious(tasks.length);
	
	useEffect(() => {
	  if (tasks.length - prevTaskLength === -1) {
		listHeadingRef.current.focus();
	  }
	  else{
		  console.log('ELSE!h'+tasks.length - prevTaskLength);
	  }
	}, [tasks.length, prevTaskLength]);
  return (
    <div className="todoapp stack-large">
      <h1>TodoMatic</h1>
      <Form addTask={addTask}/>
      <div className="filters btn-group stack-exception">
	  {filterButtons}
      </div>
      <h2 id="list-heading" tabIndex="-1" ref={listHeadingRef}>{headingText}</h2>
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading">
        {taskList}
      </ul>
    </div>
  );
}

export default App;
