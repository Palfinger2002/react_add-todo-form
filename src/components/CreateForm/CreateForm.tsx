import { useState } from 'react';
import { User } from '../../entities/user/domain/User';
import { TodoAggregate } from '../../entities/todo/domain/TodoAggregate';

type CreateFormProps = {
  users: User[];
  onSubmit: (todo: TodoAggregate) => void;
};

export function CreateForm({ users, onSubmit }: CreateFormProps) {
  const [newTitle, setNewTitle] = useState('');
  const [titleError, setTitleError] = useState('');

  const [newTodoUserId, setNewTodoUserId] = useState(0);
  const [todoUserIdError, setTodoUserIdError] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setNewTitle('');
    setTodoUserIdError('');

    const preparedTitle = newTitle.trim();

    let hasErrors = false;

    if (!preparedTitle) {
      setTitleError('Please enter a title');

      hasErrors = true;
    }

    if (!newTodoUserId) {
      setTodoUserIdError('Please choose a user');

      hasErrors = true;
    }

    if (hasErrors) {
      return;
    }

    const newTodo: TodoAggregate = {
      id: Date.now(),
      title: preparedTitle,
      completed: false,
      userId: newTodoUserId,
      user: users.find(user => user.id === newTodoUserId) as User,
    };

    onSubmit(newTodo);

    setNewTitle('');
    setNewTodoUserId(0);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="field">
        <input
          type="text"
          data-cy="titleInput"
          value={newTitle}
          onChange={event => setNewTitle(event.target.value.trimStart())}
        />

        {titleError && <span className="error">{titleError}</span>}
      </div>

      <div className="field">
        <select
          data-cy="userSelect"
          value={newTodoUserId}
          onChange={event => setNewTodoUserId(Number(event.target.value))}
        >
          <option value={0} disabled>
            Choose a user
          </option>

          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>

        {todoUserIdError && <span className="error">{todoUserIdError}</span>}
      </div>

      <button type="submit" data-cy="submitButton">
        Add
      </button>
    </form>
  );
}
