/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo, TodoStatus } from './types/Todo';
import { ErrorNotification } from './ErrorNotification';
import { TodosHeader } from './TodosHeader';
import { TodosList } from './TodosList';
import { TodosFooter } from './TodosFooter';
import { getTodos } from './api/todos';

const USER_ID = 10332;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<TodoStatus>(TodoStatus.All);

  const loadTodos = async () => {
    try {
      const response = await getTodos(USER_ID);

      setTodos(response);
    } catch {
      setError('Unable to load todos');
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const handleStatusFilter = useCallback(
    (status: TodoStatus) => {
      setStatusFilter(status);
    }, [],
  );

  let preparedTodos = todos;

  if (statusFilter) {
    preparedTodos = preparedTodos.filter(todo => {
      switch (statusFilter) {
        case TodoStatus.Uncompleted:
          return !todo.completed;
        case TodoStatus.Completed:
          return todo.completed;
        default:
          return true;
      }
    });
  }

  const completedTodosLength = preparedTodos
    .filter(todo => todo.completed).length;

  const uncompletedTodosLength = preparedTodos
    .filter(todo => !todo.completed).length;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodosHeader
          uncompletedTodosLength={uncompletedTodosLength}
        />

        <TodosList
          todos={preparedTodos}
        />

        {todos.length > 0 && (
          <TodosFooter
            onStatusFilter={handleStatusFilter}
            todosQuantity={todos.length}
            statusFilter={statusFilter}
            completedTodosLength={completedTodosLength}
          />
        )}
      </div>

      {error && (
        <ErrorNotification
          error={error}
        />
      )}
    </div>
  );
};
