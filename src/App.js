import { useEffect, useState } from "react";
import "./App.css";
import { Auth } from "./components/auth";
import { db, auth, storage } from "./config/firebase";
import {
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  collection,
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

function App() {
  const [message, setMessage] = useState("");

  const [lessonList, setLessonList] = useState([]);

  // New Unit states
  const [newUnitName, setNewUnitName] = useState("");
  const [newContent, setNewContent] = useState("");

  // Update title state
  const [updatedTitle, setUpdatedTitle] = useState("");

  // File upload state
  const [fileUpload, setFileUpload] = useState(null);

  const lessonsCollectionRef = collection(db, "lessons");

  const fetchData = async () => {
    fetch("http://localhost:3001/api/message")
      .then((response) => response.json())
      .then((data) => setMessage(data.message));
  };

  const getLessonList = async () => {
    // Read the data
    // Set the lesson list
    try {
      const data = await getDocs(lessonsCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setLessonList(filteredData);
      console.log(filteredData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getLessonList();
    fetchData();
  }, []);

  const onSubmitUnit = async () => {
    try {
      // Fetch generated text from the server
      const response = await fetch("http://localhost:3001/api/generate-text");
      const data = await response.json();
      const generatedText = data.message;

      // Add the new unit with the generated text as content
      await addDoc(lessonsCollectionRef, {
        title: newUnitName,
        dateCreated: new Date().toLocaleDateString(),
        content: generatedText,
        userId: auth?.currentUser?.uid,
      });

      // Update the lesson list to include the new unit
      getLessonList();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteUnit = async (id) => {
    const unitDoc = doc(db, "lessons", id);
    await deleteDoc(unitDoc);
  };

  const updateUnitTitle = async (id) => {
    const unitDoc = doc(db, "lessons", id);
    await updateDoc(unitDoc, { title: updatedTitle });
  };

  const uploadFile = async () => {
    if (!fileUpload) return;
    const fileFolderRef = ref(storage, `projectFiles/${fileUpload.name}`);
    try {
      await uploadBytes(fileFolderRef, fileUpload);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="App">
      <Auth />

      <div>
        <input
          placeholder="Unit name..."
          onChange={(e) => {
            setNewUnitName(e.target.value);
          }}
        />
        <button onClick={onSubmitUnit}>Submit Unit</button>
      </div>

      <div>
        {lessonList.map((lesson) => (
          <div style={{ color: "white" }} key={lesson.id}>
            <h1> {lesson.title} </h1>
            <p> {lesson.content} </p>
            <button onClick={() => deleteUnit(lesson.id)}>Delete Unit</button>

            <input
              placeholder="new title..."
              onChange={(e) => setUpdatedTitle(e.target.value)}
            />
            <button onClick={() => updateUnitTitle(lesson.id)}>
              Update Title
            </button>
          </div>
        ))}
      </div>

      <div>
        <input
          type="file"
          onChange={(e) => {
            setFileUpload(e.target.files[0]);
          }}
        />
        <button onClick={uploadFile}>Upload File</button>
      </div>

      <header className="App-header">
        <h1 color="white">{message}</h1>
      </header>
    </div>
  );
}

export default App;
