import styled from 'styled-components';
import { auth, db, storage } from '../firebase';
import { useEffect, useState } from 'react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { ITweet } from '../components/timeline';
import Tweet from '../components/tweet';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;

const AvatarUpload = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50%;
  background-color: #1d9bf0;
  cursor: pointer;
  svg {
    width: 50px;
  }
`;

const AvatarImg = styled.img`
  width: 100%;
`;

const AvatarInput = styled.input`
  display: none;
`;

const Column = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Name = styled.span`
  font-size: 22px;
`;

const EditButton = styled.button`
  background-color: pink;
  color: white;
  font-weight: 600;
  border: 0;
  border-radius: 5px;
  font-size: 12px;
  padding: 5px 10px;
  cursor: pointer;
`;

const SaveButton = styled.button`
  background-color: green;
  color: white;
  font-weight: 600;
  border: 0;
  border-radius: 5px;
  font-size: 12px;
  padding: 5px 10px;
  cursor: pointer;
`;

const CancelButton = styled.button`
  background-color: gray;
  color: white;
  font-weight: 600;
  border: 0;
  border-radius: 5px;
  font-size: 12px;
  padding: 5px 10px;
  cursor: pointer;
`;

const EditInput = styled.input`
  padding: 20px;
  border: 1px solid white;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  transition: .4s;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
      Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

const Tweets = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
`;

export default function Profile() {
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.displayName ?? "익명");

  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!user) return;
    if (files && files.length === 1) {
      const file = files[0];
      const locationRef = ref(storage, `avatars/${user?.uid}`);
      const result = await uploadBytes(locationRef, file);
      const avatarUrl = await getDownloadURL(result.ref);
      setAvatar(avatarUrl);
      await updateProfile(user, { photoURL: avatarUrl });
    }
  };

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const onEdit = () => {
    setIsEditing(true);
  };

  const onCancel = () => {
    setIsEditing(false);
  };

  const onSave = async () => {
    if (name === "" || !user) return;

    try {
      await updateProfile(user, { displayName: name });
    } catch (e) {
      console.error(e);
    } finally {
      setIsEditing(false);
    }
  };

  const fetchTweets = async () => {
    const tweetQuery = query(
      collection(db, "tweets"),
      where("userId", "==", user?.uid),
      orderBy("createdAt", "desc"),
      limit(25)
    );
    const snapshot = await getDocs(tweetQuery);
    const tweets = snapshot.docs.map(doc => {
      const { tweet, createdAt, userId, username, photo } = doc.data();
        return {
          tweet, 
          createdAt, 
          userId, 
          username, 
          photo,
          id: doc.id,
        }
    });
    setTweets(tweets);
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  return (
    <Wrapper>
      <AvatarUpload htmlFor="avatar">
        {avatar ? (
          <AvatarImg src={avatar} />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
          </svg>
        )}
      </AvatarUpload>
      <AvatarInput
        onChange={onAvatarChange} 
        id="avatar" 
        type="file" 
        accept="image/*" 
      />
      <Column>
        {isEditing ? (
          <>
            <EditInput onChange={onNameChange} value={name} type="text" />
            <>
              <SaveButton onClick={onSave}>저장</SaveButton>
              <CancelButton onClick={onCancel}>취소</CancelButton>
            </>
          </>
        ) : (
          <>
            <Name>{user?.displayName ?? "익명"}</Name>
            <EditButton onClick={onEdit}>수정</EditButton>
          </>
        )}
      </Column>
      <Tweets>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} {...tweet} />
        ))}
      </Tweets>
    </Wrapper>
  );
}
