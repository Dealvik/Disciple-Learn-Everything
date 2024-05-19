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
  const [lessonList, setLessonList] = useState([]);

  // New Unit states
  const [newUnitName, setNewUnitName] = useState("");
  const [newContent, setNewContent] = useState("");

  // Update title state
  const [updatedTitle, setUpdatedTitle] = useState("");

  // File upload state
  const [fileUpload, setFileUpload] = useState(null);

  const lessonsCollectionRef = collection(db, "lessons");

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
  }, []);

  const onSubmitUnit = async () => {
    try {
      await addDoc(lessonsCollectionRef, {
        title: newUnitName,
        dateCreated: "4/19/2024",
        content: newContent,
        // content: newContent,
        userId: auth?.currentUser?.uid,
      });

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
        <input
          placeholder="Content..."
          onChange={(e) => {
            setNewContent(e.target.value);
          }}
        />
        <button onClick={onSubmitUnit}>Submit Unit</button>
      </div>

      <div>
        {lessonList.map((lesson) => (
          <div style={{ color: "white" }}>
            <h1> {lesson.title} </h1>
            <p> {lesson.content} </p>
            {/* <p> {lesson.dateCreated} </p> */}
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

      {/* image sending  */}
      <div>
        <input
          type="file"
          onChange={(e) => {
            setFileUpload(e.target.files[0]);
          }}
        />
        <button onClick={uploadFile}>Upload File</button>
      </div>
    </div>
  );
}

export default App;
