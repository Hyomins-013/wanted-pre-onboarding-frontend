import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { css, keyframes } from 'styled-components';
import { API } from '../../Config';

function SignUp() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    idValue: '',
    pwValue: '',
    pwvfValue: '',
  });
  const { idValue, pwValue } = userInfo;

  const getUserInfo = e => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const isValidate = ({ userInfo }) => {
    const isIdValid = userInfo.idValue.includes('@');
    const isPWValid = userInfo.pwValue.length >= 8;
    const pwvfValid = userInfo.pwvfValue === userInfo.pwValue;
    const verificationResult = {
      alarmText: '',
      isValid: false,
    };

    if (!isIdValid) {
      verificationResult.alarmText = 'Id에 @를 포함시켜주세요';
      verificationResult.isValid = false;
    } else if (!isPWValid) {
      verificationResult.alarmText = 'PW는 8자 이상 입력해주세요';
      verificationResult.isValid = false;
    } else if (!pwvfValid) {
      verificationResult.alarmText = 'PW와 일치하지 않습니다';
      verificationResult.isValid = false;
    } else {
      verificationResult.isValid = true;
    }

    return verificationResult;
  };

  const result = isValidate({ userInfo });

  const signupFetch = () => {
    fetch(`${API.signup}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        email: idValue,
        password: pwValue,
      }),
    }).then(res =>
      res.status === 201
        ? (alert('회원가입에 성공하셨습니다!!'), navigate('/signin'))
        : alert('회원가입에 실패하였습니다. 다시한번 시도해 주세요'),
    );
  };

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
            type="password"
            onChange={getUserInfo}
            placeholder="8자 이상"
          />
        </UserInput>
        <UserInput>
          <span>Password Verification</span>
          <TextInput
            data-testid="password-input"
            name="pwvfValue"
            type="password"
            onChange={getUserInfo}
            placeholder="패스워드 재입력"
          />
        </UserInput>
        {result.isValid ? (
          <Button data-testid="signup-button" onClick={signupFetch}>
            회원가입하기
          </Button>
        ) : (
          <WarningText>{result.alarmText}</WarningText>
        )}
      </InputWrap>
    </Container>
  );
}

export default SignUp;

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
  border-radius: 5px;
  border: 3px solid lightgrey;
  box-shadow: none;
  outline: none;
  background-color: transparent;
  flex: 1;
`;

const shakeAnimation = keyframes`
  0%, 100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(15px);
  }
  75% {
    transform: translateX(-15px);
  }
`;

const WarningText = styled.span`
  margin-top: 10px;
  font-size: 16px;
  font-weight: 500;
  color: #c51605;
  animation:
    ${shakeAnimation} 1s,
    pauseAnimation 2s;
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
