import Head from "next/head";
import React, {useCallback, useState} from "react";
import {Todo} from "@/types/todo";
import AddTodoForm from "@/components/AddTodoForm"
import TodoList from "@/components/TodoList";
import Banner from "@/components/Banner";
import sampleData from "@/sampleData.json";

/*
 * Home: renders the To Do list page. Which is essentially a form component for creating To Dos and 3 todo lists
 * Each TodoList renders TodoItem components for each todo passed in
 * The 3 lists are for urgent, non-urgent, and completed
 * 
 * There are also several utility functions
 * 
 * AddTodo - create a new To Do
 * deleteTodo - delete a To Do via supplied id
 * toggleProperty - toggles isCompleted or isUrgent for supplied id
 * displayTodoList - renders the TodoList component
 * displayTodos - calls displayTodoList with a filtered To Do selection
 * displayComplete - calls displayTodoList with a filtered To Do selection
 */
export default function Home() {
    const [todos, setTodos] = useState<Todo[]>(sampleData);

    const AddTodo = (title: string, desc: string) => {
        const newTodo: Todo = {
            id: todos.length + 1,
            title: title,
            description: desc,
            isCompleted: false,
            isUrgent: false,
        };
        /*
            todos.push(newTodo);
            setTodos(todos);

         */
        // Create a new array with the added todo to avoid direct mutation
        // Edited by Sina on branch bugfix-4
        setTodos((prevTodos) => [...prevTodos, newTodo]);
    };

    const deleteTodo = (id: number) => {
        setTodos(todos.filter((todo) => todo.id === id));
    };
    /*
        const toggleProperty = useCallback((id: number, property: keyof Pick<Todo, 'isCompleted' | 'isUrgent'>) => {
            const updatedTodos = todos.map((todo) => {
                if (todo.id === id) {
                    todo[property] = !todo[property] as boolean;
                }
                return todo;
            });
            setTodos(updatedTodos);
        }, [setTodos]);
    */
    /**
     * toggleProperty: Toggles a specified property ('isCompleted' or 'isUrgent') for a todo item by its ID.
     *
     * This function finds the todo item with the given ID and creates a new todo object with the specified property toggled.
     * It uses the React useCallback hook to memoize the function, ensuring it only re-creates if its dependencies change.
     *
     * Edited by Sina on branch bugfix-5:
     * - Refactored the function to create a new todo object instead of mutating the existing one, ensuring proper state updates.
     * - Added dependencies to the useCallback hook to optimize performance and prevent unnecessary re-renders.
     *
     * @param {number} id - The ID of the todo item to update.
     * @param {keyof Pick<Todo, 'isCompleted' | 'isUrgent'>} property - The property ('isCompleted' or 'isUrgent') to toggle.
     */
    const toggleProperty = useCallback(
        (id: number, property: keyof Pick<Todo, 'isCompleted' | 'isUrgent'>) => {
            const updatedTodos = todos.map((todo) => {
                if (todo.id === id) {
                    // Create a new todo object with the toggled property
                    return {...todo, [property]: !todo[property]};
                }
                return todo;
            });
            setTodos(updatedTodos);
        },
        [todos, setTodos] // Properly watch state changes
    );
    const displayTodoList = (todoList: Todo[]) => {
        return (
            <TodoList
                todos={todoList}
                deleteTodo={deleteTodo}
                toggleComplete={(id) => toggleProperty(id, 'isCompleted')}
                toggleUrgent={(id) => toggleProperty(id, 'isUrgent')}
            />
        );
    };


    /*
      const displayTodos = (displayUrgent: boolean) => {
        return displayTodoList(todos.filter((x) => {
          if (displayUrgent) {
            return !x.isCompleted && x.isUrgent === displayUrgent;
          } else {
            return !x.isCompleted && x.isUrgent !== displayUrgent;
          }
        }));
      };

    */
    /**
     * displayTodos: Renders a list of todos based on their urgency.
     *
     * This function filters the todos to display either urgent or non-urgent todos that are not completed.
     *
     * Edited by Sina on branch bugfix-2:
     * - Refactored the filtering logic to prevent duplication of todos.
     * - Ensured that todos like 'id: 4' (which are urgent and not completed) are not shown in both categories.
     *
     * @param {boolean} displayUrgent - If true, displays urgent todos; if false, displays non-urgent todos.
     */
    const displayTodos = (displayUrgent: boolean) => {
        if (displayUrgent) {
            // Show todos that are urgent and not completed
            return displayTodoList(todos.filter((x) => !x.isCompleted && x.isUrgent));
        } else {
            // Show todos that are not urgent and not completed
            return displayTodoList(todos.filter((x) => !x.isCompleted && !x.isUrgent));
        }
    };

    const displayComplete = () => {
        return displayTodoList(todos.filter((x) => x.isCompleted));
    };


    return (
        <>
            <Head>
                <title>To Do List</title>
                <meta name="description" content="To Do List App"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="favicon.ico"/>
            </Head>

            <div className="Home">
                <Banner/>
                <AddTodoForm addTodo={AddTodo}/>
                {displayTodos(true)}
                {displayTodos(false)}
                {displayComplete()}
            </div>
        </>
    );
}
