import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { API } from '../../Config';

function SignIn() {
  const navigate = useNavigate();
  const isToken = localStorage.getItem('access_token');

  const [userInfo, setUserInfo] = useState({
    idValue: '',
    pwValue: '',
  });
  const { idValue, pwValue } = userInfo;

  const getUserInfo = e => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const isValidate =
    userInfo.idValue.includes('@') && userInfo.pwValue.length >= 8;

  const signinFetch = () => {
    fetch(`${API.signin}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        email: idValue,
        password: pwValue,
      }),
    })
      .then(res => {
        if (res.status !== 200) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then(data => {
        localStorage.setItem('access_token', data.access_token);
        navigate('/todo');
      })
      .catch(error => {
        alert('아이디가 존재하지 않습니다.');
        navigate('/signup');
      });
  };

  useEffect(() => {
    if (isToken) {
      alert('이미 로그인이 되어 있으므로 Todo페이지로 이동합니다.');
      navigate('/todo');
    }
  }, []);

  return (
    <Container>
      <Header>환영합니다!</Header>
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
            type="password"
            onChange={getUserInfo}
            placeholder="8자 이상"
          />
        </UserInput>
        <Button
          data-testid="signin-button"
          disabled={!isValidate}
          onClick={signinFetch}
        >
          로그인하기
        </Button>
        <Button
          onClick={() => {
            navigate('/signup');
          }}
        >
          회원가입
        </Button>
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

const Header = styled.p`
  font-size: 24px;
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
