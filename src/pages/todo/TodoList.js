import React, { useState } from 'react';
import styled from 'styled-components';
import { API } from '../../Config';

function TodoList({
  userTodoList,
  setUserTodoList,
  isEditMode,
  setIsEditMode,
  isToken,
}) {
  const [editText, setEditText] = useState('');

  const handleCheckboxChange = (e, id) => {
    const updatedList = userTodoList.map(list =>
      list.id === id ? { ...list, isCompleted: e.target.checked } : list,
    );
    setUserTodoList(updatedList);

    const index = userTodoList.findIndex(item => item.id === id);
    const todo = userTodoList[index].todo; // 현재 할일 값

    fetch(`${API.todo}/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${isToken}`,
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        todo: todo, // 기존 할일 값
        isCompleted: e.target.checked, // 변경된 체크 여부
      }),
    })
      .then(res => res.json())
      .then(data => {
        const newTodoList = [...userTodoList];
        newTodoList[index] = data;
        setUserTodoList(newTodoList);
      });
  };

  const EditModeHandler = id => {
    setIsEditMode(prevModes => {
      const newModes = [...prevModes];
      newModes[id] = !newModes[id];
      return newModes;
    });
  };

  const EditTextHandler = e => {
    setEditText(e.target.value);
  };

  const CorrectHandler = (id, todo) => {
    const index = userTodoList.findIndex(item => item.id === id);
    if (!todo) {
      todo = userTodoList[index].todo;
    }
    fetch(`${API.todo}/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${isToken}`,
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        todo: todo,
        isCompleted: userTodoList[index].isCompleted,
      }),
    })
      .then(res => res.json())
      .then(data => {
        const newTodoList = [...userTodoList];
        newTodoList[index] = data;
        setUserTodoList(newTodoList);
        setEditText('');
        EditModeHandler(id);
      });
  };

  const DeleteHandler = id => {
    fetch(`${API.todo}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${isToken}`,
      },
    }).then(res => {
      if (res.ok) {
        const updatedList = userTodoList.filter(item => item.id !== id);
        setUserTodoList(updatedList);
      }
    });
  };

  return (
    <TodoListWrap>
      {userTodoList &&
        userTodoList.map(list => {
          return (
            // styled-Component 특성상 TodayTask가 li로 지정되있게끔 하였습니다.
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
                    defaultValue={list.todo}
                    onChange={e => EditTextHandler(e)}
                  />
                  <ListButtonWrap>
                    <EditButton
                      data-testid="submit-button"
                      onClick={() => CorrectHandler(list.id, editText)}
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
                      onClick={() => DeleteHandler(list.id)}
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
  );
}

export default TodoList;

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
