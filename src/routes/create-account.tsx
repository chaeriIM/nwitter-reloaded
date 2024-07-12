import { useState } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 420px;
  padding: 50px 0px;
`;

const Logo = styled.h1`
  font-size: 42px;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 36px;
`;

const Form = styled.form`
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const Input = styled.input`
  padding: 10px 20px;
  border-radius: 50px;
  border: none;
  width: 100%;
  font-size: 16px;
  &[type="submit"] {
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
`;

const Error = styled.span`
  font-weight: 600;
  color: tomato;
`;

export default function CreateAccount() {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const onChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    const { target: { name, value } } = e;
    if (name === "name") {
      setName(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  }

  const onSubmit = (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // 계정 생성
      // 사용자 프로필 지정
      // 홈으로 돌아가기
    } catch (e) {
      // setError
    } finally{
      setIsLoading(false);
    }
  }

  return (
    <Wrapper>
      <Logo>𝕏</Logo>
      <Title>계정을 생성하세요</Title>
      <Form onSubmit={onSubmit}>
        <Input onChange={onChange} name="name" value={name} placeholder="이름" type="text" required />
        <Input onChange={onChange} name="email" value={email} placeholder="이메일" type="email" required />
        <Input onChange={onChange} name="password" value={password} placeholder="비밀번호" type="password" required/>
        <Input type="submit" value={isLoading ? "Loading..." : "가입하기"} />
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}
    </Wrapper>
  );
}