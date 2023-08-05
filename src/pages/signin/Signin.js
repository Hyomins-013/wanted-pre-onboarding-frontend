import React, { useState } from 'react';
import styled, { css } from 'styled-components';

function SignIn() {
  const [userInfo, setUserInfo] = useState({
    idValue: '',
    pwValue: '',
  });

  const getUserInfo = e => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const isValidate =
    userInfo.idValue.includes('@') && userInfo.pwValue.length >= 8;

  return (
    <Container>
      <InputWrap>
        <UserInput>
          <span>ID</span>
          <TextInput
            data-testid="email-input"
            name="idValue"
            onChange={getUserInfo}
            placeholder="@ 를 포함한 ID"
          />
        </UserInput>
        <UserInput>
          <span>Password</span>
          <TextInput
            data-testid="password-input"
            name="pwValue"
            onChange={getUserInfo}
            placeholder="8자 이상"
          />
        </UserInput>
        <Button data-testid="signin-button" disabled={!isValidate}>
          로그인하기
        </Button>
        <Button data-testid="signup-button">회원가입</Button>
      </InputWrap>
    </Container>
  );
}

export default SignIn;

const Container = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  text-align: center;
  transform: translate(-50%, -50%);
`;

const InputWrap = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  border-radius: 3px;
  border: 2px solid #252525;
  padding: 15px;
  width: 250px;
`;

const UserInput = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  margin: 5px 0;

  span {
    margin-bottom: 5px;
    text-align: left;
  }
`;

const TextInput = styled.input`
  height: 35px;
  padding: 10px 10px;
  font-size: 14px;
  /* color: ${({ isActive }) => (isActive ? '#fff' : '#252525')}; */
  border-radius: 5px;
  border: 3px solid lightgrey;
  box-shadow: none;
  outline: none;
  background-color: transparent;
  flex: 1;
`;

const Button = styled.button`
  width: auto;
  margin-top: 5px;
  padding: 5px;
  font-size: 12px;

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.5;
      cursor: not-allowed;
    `}
`;
