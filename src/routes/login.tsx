import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { 
  Input,
  Form,
  Switcher, 
  Title, 
  Error, 
  Wrapper,
  Seperate,
  Reset
} from "../components/auth-components";
import GithubButton from "../components/github-btn";

export default function CreateAccount() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const onChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    const { target: { name, value } } = e;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (isLoading || email === "" || password === "") return;
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (e) {
      if (e instanceof FirebaseError) {
        setError(e.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onClick = async () => {
    navigate("/reset-password")
  };

  return (
    <Wrapper>
      <Title>𝕏에 로그인하기</Title>
      <GithubButton />
      <Seperate><hr />또는<hr /></Seperate>
      <Form onSubmit={onSubmit}>
        <Input onChange={onChange} name="email" value={email} placeholder="이메일" type="email" required />
        <Input onChange={onChange} name="password" value={password} placeholder="비밀번호" type="password" required/>
        <Input type="submit" value={isLoading ? "Loading..." : "로그인하기"} />
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}
      <Reset onClick={onClick}>비밀번호를 잊으셨나요?</Reset>
      <Switcher>
        계정이 없으신가요?{" "} <Link to="/create-account">가입하기</Link>
      </Switcher>
    </Wrapper>
  );
}