import styled from 'styled-components';
import { ITweet } from './timeline';
import { auth, db, storage } from '../firebase';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useState } from 'react';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Column = styled.div`
  
`;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;

const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  border-radius: 5px;
  font-size: 12px;
  padding: 5px 10px;
  cursor: pointer;
`;

const EditButton = styled.button`
  background-color: skyblue;
  color: white;
  font-weight: 600;
  border: 0;
  border-radius: 5px;
  font-size: 12px;
  padding: 5px 10px;
  margin-right: 5px;
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
  margin-right: 5px;
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

const EditInput = styled.textarea`
  margin: 10px 0px;
  padding: 20px;
  border: 1px solid white;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  transition: .4s;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
      Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  &::placeholder {
    font-size: 20px;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

const FileWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const FileInput = styled.input`
  display: none;
`;

const FileInputLabel = styled.label`
  margin-left: 10px;
  padding: 10px 16px;
  color: #1d9bf0;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #1d9bf0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

export default function Tweet({ username, photo, tweet, userId, id }: ITweet) {
  const user = auth.currentUser;
  const [isEditing, setIsEditing] = useState(false);
  const [newTweet, setNewTweet] = useState(tweet);
  const [newPhoto, setNewPhoto] = useState<File | null >(null);

  const onDelete = async () => {
    const ok = confirm("게시을(를) 삭제할까요?");

    if (!ok || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, "tweets", id));
      if (photo) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    } finally {
      //
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewTweet(e.target.value);
  };

  const onEdit = () => {
    setIsEditing(true);
  };

  const onCancel = () => {
    setIsEditing(false);
    setNewTweet(tweet);
    setNewPhoto(null);
  };

  const onSave = async () => {
    if (newTweet === "" || user?.uid !== userId) return;
    const tweetRef = doc(db, `tweets/${id}`);
    const locationRef = ref(storage, `tweets/${user.uid}/${id}`);

    try {
      await updateDoc(tweetRef, { tweet: newTweet  });

      if (newPhoto) {
        if (photo) {
          await deleteObject(locationRef);
        }
  
        const result = await uploadBytes(locationRef, newPhoto);
        const url = await getDownloadURL(result.ref);
        
        await updateDoc(tweetRef, { photo: url });
      }
      setNewTweet("");
      setNewPhoto(null);
      setIsEditing(false);

    } catch (e) {
      console.error(e);
    }
  };

  const onEditPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    const maxSize = 1 * 1024 * 1024;
    if (files && files.length === 1) {
      if (files[0].size > maxSize) {
        alert("1MB 이하의 이미지만 업로드 가능합니다.");
        return;
      }
      setNewPhoto(files[0]);
    }
  };

  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        {isEditing ? (
          <EditInput value={newTweet} onChange={onChange} />
        ) : (
          <Payload>{tweet}</Payload>
        )}
        {user?.uid === userId ? (
          <>
            {isEditing ? (
              <div>
                <SaveButton onClick={onSave}>저장</SaveButton>
                <CancelButton onClick={onCancel}>취소</CancelButton>
              </div>
            ) : (
              <>
                <EditButton onClick={onEdit}>수정</EditButton>
                <DeleteButton onClick={onDelete}>삭제</DeleteButton>
              </>
            )}
          </>
        ) : null}
      </Column>
      <FileWrapper>
        {isEditing ? (
          <>
            <FileInputLabel htmlFor="editPhoto">
              {newPhoto ? "사진 수정됨 ✅" : "사진 수정"}
            </FileInputLabel>
            <FileInput onChange={onEditPhoto} type="file" id="editPhoto" accept="image/*" />
          </>
        ) : photo ? (
          <Photo src={photo} />
        ) : null}
      </FileWrapper>
    </Wrapper>
  );
}
