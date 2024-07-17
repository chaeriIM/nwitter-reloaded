import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import styled from "styled-components";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const Button = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
  padding: 10px 20px;
  gap: 5px;
  width: 100%;
  background-color: white;
  color: black;
  font-weight: 500;
  border-radius: 50px;
  border: 0;
  cursor: pointer;
  transition: .3s;
  &:hover {
    opacity: 0.9;
  }
`;

const Logo = styled.img`
  height: 20px;
`;

export default function GithubButton() {
  const navigate = useNavigate();
  
  const onClick = async () => {
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Button onClick={onClick}>
      <Logo src="/github-logo.svg" />
      Github 계정으로 가입하기
    </Button>
  );
}