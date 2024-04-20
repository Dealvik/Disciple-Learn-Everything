import { useEffect, useState } from "react";
import "./App.css";
import { Auth } from "./components/auth";
import { db } from "./config/firebase";
import { getDocs, addDoc, collection } from "firebase/firestore";

function App() {
  const [lessonList, setLessonList] = useState([]);

  // New Unit states
  const [newUnitName, setNewUnitName] = useState("");
  const [newContent, setNewContent] = useState("");

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
      });

      getLessonList();
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
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
