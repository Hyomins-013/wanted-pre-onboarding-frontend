import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { API } from '../../Config';

function Todo() {
  const navigate = useNavigate();
  const isToken = localStorage.getItem('access_token');

  useEffect(() => {
    if (!isToken) {
      alert('먼저 로그인해 주시기 바랍니다.');
      navigate('/signin');
    }
  }, []);

  return <>안녕하세요</>;
}

export default Todo;
