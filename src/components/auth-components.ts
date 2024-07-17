import styled from "styled-components";

export const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 420px;
  padding: 50px 0px;
`;

export const Logo = styled.h1`
  font-size: 42px;
  margin-bottom: 20px;
`;

export const Title = styled.h1`
  margin-bottom: 40px;
  font-size: 36px;
`;

export const Notice = styled.span`
  margin-bottom: 50px;
  font-size: 16px;
  line-height: 20px;
`;

export const Form = styled.form`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

export const Input = styled.input`
  padding: 10px 20px;
  border-radius: 50px;
  border: none;
  width: 100%;
  font-size: 16px;
  &[type="submit"] {
    margin-bottom: 10px;
    font-weight: 500;
    cursor: pointer;
    transition: .3s;
    &:hover {
      opacity: 0.9;
    }
  }
`;

export const Error = styled.span`
  font-weight: 600;
  color: tomato;
`;

export const Switcher = styled.span`
  margin-top: 50px;
  a {
    color: #1d9bf0;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const Seperate = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  hr {
    flex-grow: 1;
    border: 0;
    border-top: 1px solid #464646;
    margin: 0 10px;
  }
`;

export const Reset = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  padding: 10px 20px;
  gap: 5px;
  width: 100%;
  height: 40px;
  background-color: transparent;
  color: white;
  font-weight: 500;
  border-radius: 50px;
  border: 1px solid #464646;
  cursor: pointer;
  transition: .3s;
  &:hover {
    background-color: rgba(66, 66, 66, 0.4);
  }
`;