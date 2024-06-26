import { useEffect, useState } from "react";
import { db, auth, storage } from "../config/firebase";
import {
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  collection,
  query,
  where,
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { signOut } from "firebase/auth";
import "../styles/Main.css";

export const Main = () => {
  const [message, setMessage] = useState("");
  const [lessonList, setLessonList] = useState([]);
  const [newUnitName, setNewUnitName] = useState("");
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [fileUpload, setFileUpload] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const lessonsCollectionRef = collection(db, "lessons");

  useEffect(() => {
    // Set the current user from auth
    setCurrentUser(auth.currentUser);
    if (auth.currentUser) {
      getLessonList();
    }
  }, [auth.currentUser]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://us-central1-fir-full-stack-app.cloudfunctions.net/api/api/generate-text"
      );
      const data = await response.json();
      setMessage(data.message);
    } catch (err) {
      console.error(err);
    }
  };

  const getLessonList = async () => {
    if (!auth.currentUser) {
      console.error("No authenticated user");
      return;
    }

    const userQuery = query(
      lessonsCollectionRef,
      where("userId", "==", auth.currentUser.uid)
    );

    try {
      const data = await getDocs(userQuery);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setLessonList(filteredData);
      console.log("Fetched lessons for userId:", auth.currentUser.uid);
      console.log("Lessons:", filteredData);
    } catch (err) {
      console.error("Error fetching lessons:", err.message);
    }
  };

  const onSubmitUnit = async () => {
    if (!auth.currentUser) return;

    try {
      const response = await fetch(
        "https://us-central1-fir-full-stack-app.cloudfunctions.net/api/api/generate-text"
      );
      const data = await response.json();
      const generatedText = data.message;

      console.log("Submitting unit with userId:", auth?.currentUser?.uid);

      await addDoc(lessonsCollectionRef, {
        title: newUnitName || generatedText,
        dateCreated: new Date().toLocaleDateString(),
        content: generatedText,
        userId: auth?.currentUser?.uid,
      });

      getLessonList();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteUnit = async (id) => {
    if (!auth.currentUser) return;

    const unitDoc = doc(db, "lessons", id);
    try {
      await deleteDoc(unitDoc);
      getLessonList();
    } catch (err) {
      console.error(err);
    }
  };

  const updateUnitTitle = async (id) => {
    if (!auth.currentUser) return;

    const unitDoc = doc(db, "lessons", id);
    try {
      await updateDoc(unitDoc, { title: updatedTitle });
      getLessonList();
    } catch (err) {
      console.error(err);
    }
  };

  const uploadFile = async () => {
    if (!fileUpload || !auth.currentUser) return;

    const fileFolderRef = ref(storage, `projectFiles/${fileUpload.name}`);
    try {
      await uploadBytes(fileFolderRef, fileUpload);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="main-container">
      {currentUser && (
        <div className="header">
          <p>Welcome, {currentUser.email}</p>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}

      <div className="unit-input">
        <input
          placeholder="Unit name..."
          onChange={(e) => {
            setNewUnitName(e.target.value);
          }}
        />
        <button onClick={onSubmitUnit}>Submit Unit</button>
      </div>

      <div className="lesson-list">
        {lessonList.map((lesson) => (
          <div className="lesson-card" key={lesson.id}>
            <h1>{lesson.title}</h1>
            <p>{lesson.content}</p>
            <button
              className="delete-button"
              onClick={() => deleteUnit(lesson.id)}
            >
              Delete Unit
            </button>

            <input
              placeholder="new title..."
              onChange={(e) => setUpdatedTitle(e.target.value)}
            />
            <button
              className="update-button"
              onClick={() => updateUnitTitle(lesson.id)}
            >
              Update Title
            </button>
          </div>
        ))}
      </div>

      <div className="file-upload">
        <input
          type="file"
          onChange={(e) => {
            setFileUpload(e.target.files[0]);
          }}
        />
        <button onClick={uploadFile}>Upload File</button>
      </div>

      <header className="App-header">
        <h1>{message}</h1>
      </header>
    </div>
  );
};
