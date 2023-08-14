import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { API } from '../../Config';

function Todo() {
  const navigate = useNavigate();
  const isToken = localStorage.getItem('access_token');
  const [userTodoList, setUserTodoList] = useState([]);
  const [addTodo, setAddTodo] = useState('');
  const [isEditMode, setIsEditMode] = useState([]);

  const EditModeHandler = id => {
    setIsEditMode(prevModes => {
      const newModes = [...prevModes];
      newModes[id] = !newModes[id];
      return newModes;
    });
  };

  const WriteTodoHandler = e => {
    setAddTodo(e.target.value);
  };

  const handleCheckboxChange = (e, id) => {
    const updatedList = userTodoList.map(list =>
      list.id === id ? { ...list, isCompleted: e.target.checked } : list,
    );
    setUserTodoList(updatedList);
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

  const CorrectHandler = () => {};

  const DeleteHandler = () => {};

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
      <TodoListWrap>
        {userTodoList?.map(list => {
          return (
            <TodayTask key={list.id}>
              <input
                type="checkbox"
                checked={list.isCompleted}
                onChange={e => handleCheckboxChange(e, list.id)}
              />
              {isEditMode[list.id] ? (
                <EditInputWrap>
                  <EditInput
                    data-testid="modify-input"
                    type="text"
                    placeholder={list.todo}
                  />
                  <ListButtonWrap>
                    <EditButton
                      data-testid="submit-button"
                      onClick={() => CorrectHandler()}
                    >
                      제출
                    </EditButton>
                    <EditButton
                      data-testid="cancel-button"
                      onClick={() => EditModeHandler(list.id)}
                    >
                      취소
                    </EditButton>
                  </ListButtonWrap>
                </EditInputWrap>
              ) : (
                <NonEditInputWrap>
                  <span>{list.todo}</span>
                  <ListButtonWrap>
                    <ListButton
                      data-testid="modify-button"
                      onClick={() => EditModeHandler(list.id)}
                    >
                      수정
                    </ListButton>
                    <ListButton
                      data-testid="delete-button"
                      onClick={() => DeleteHandler(list)}
                    >
                      삭제
                    </ListButton>
                  </ListButtonWrap>
                </NonEditInputWrap>
              )}
            </TodayTask>
          );
        })}
      </TodoListWrap>
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

const TodoListWrap = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  margin-top: 20px;
`;

const TodayTask = styled.li`
  display: flex;
  margin-bottom: 5px;
  justify-content: space-between;
  width: 100%;
  input {
    margin-right: 10px;
  }
`;

const EditInputWrap = styled.div`
  display: flex;
  width: 100%;
  text-align: right;
  align-items: center;
`;

const EditButton = styled.button`
  height: 20px;
  margin-left: 5px;
  font-size: 12px;
`;

const NonEditInputWrap = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  span {
    text-align: left;
  }
`;

const EditInput = styled.input`
  height: 15px;
  padding: 10px 10px;
  font-size: 12px;
  color: #252525;
  border-radius: 5px;
  border: 1px solid lightgrey;
  box-shadow: none;
  outline: none;
  background-color: transparent;
  flex: 1;
`;

const ListButtonWrap = styled.div`
  display: flex;
  text-align: right;
`;

const ListButton = styled.button`
  height: 20px;
  margin-left: 5px;
  font-size: 12px;
`;
