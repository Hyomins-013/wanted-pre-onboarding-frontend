import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { API } from '../../Config';
import TodoList from './TodoList';

function Todo() {
  const navigate = useNavigate();
  const isToken = localStorage.getItem('access_token');
  const [userTodoList, setUserTodoList] = useState([]);
  const [isEditMode, setIsEditMode] = useState([]);
  const [addTodo, setAddTodo] = useState('');

  const WriteTodoHandler = e => {
    setAddTodo(e.target.value);
  };

  const AddTodoHandler = () => {
    fetch(`${API.todo}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${isToken}`,
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        todo: addTodo,
      }),
    })
      .then(res => res.json())
      .then(data => {
        setUserTodoList(prevList => [...prevList, data]);
        setAddTodo('');
      });
  };

  useEffect(() => {
    if (!isToken) {
      alert('먼저 로그인해 주시기 바랍니다.');
      navigate('/signin');
    }
  }, []);

  useEffect(() => {
    fetch(`${API.todo}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${isToken}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setUserTodoList(data);
        setIsEditMode(data?.map(() => false));
      });
  }, []);

  return (
    <TodoContainer>
      <InputWrap>
        <TodoInput
          data-testid="new-todo-input"
          onChange={e => WriteTodoHandler(e)}
          value={addTodo}
        />
        <TodoButton data-testid="new-todo-add-button" onClick={AddTodoHandler}>
          쓰기
        </TodoButton>
      </InputWrap>
      <TodoList
        userTodoList={userTodoList}
        setUserTodoList={setUserTodoList}
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
        isToken={isToken}
      />
    </TodoContainer>
  );
}

export default Todo;

const TodoContainer = styled.div`
  position: absolute;
  top: 30%;
  left: 50%;
  height: auto;
  text-align: center;
  padding: 35px;
  transform: translate(-50%, -50%);
  border: 1px solid lightgrey;
`;

const InputWrap = styled.div`
  width: 500px;
  display: flex;
  justify-content: center;
  text-align: center;
`;

const TodoInput = styled.input`
  height: 35px;
  padding: 10px 10px;
  font-size: 14px;
  border-radius: 5px;
  border: 3px solid lightgrey;
  box-shadow: none;
  outline: none;
  background-color: transparent;
  flex: 1;
`;

const TodoButton = styled.button`
  width: auto;
  height: 35px;
  padding: 5px;
  margin-left: 5px;
  font-size: 12px;
`;
