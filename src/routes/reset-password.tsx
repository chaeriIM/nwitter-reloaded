import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { 
  Input, 
  Form,
  Logo,
  Title,
  Notice,
  Error, 
  Wrapper
} from "../components/auth-components";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  
  const onChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    const { target: { name, value } } = e;
    if (name === "email") {
      setEmail(value);
    }
  }

  const onSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (isLoading || email === "") return;
    try {
      setIsLoading(true);
      await sendPasswordResetEmail(auth, email);
      alert("메일이 전송되었습니다.");
      navigate("/login");
    } catch (e) {
      if (e instanceof FirebaseError) {
        setError(e.message);
      }
    } finally{
      setIsLoading(false);
    }
  }

  return (
    <Wrapper>
      <Logo>𝕏</Logo>
      <Title>비밀번호를 재설정하세요</Title>
      <Notice>𝕏에 가입했던 이메일을 입력해주세요.<br />비밀번호 재설정 메일을 보내드립니다.</Notice>
      <Form onSubmit={onSubmit}>
        <Input onChange={onChange} name="email" value={email} placeholder="이메일" type="email" required />
        <Input type="submit" value={isLoading ? "Loading..." : "이메일 보내기"} />
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}
    </Wrapper>
  );
}