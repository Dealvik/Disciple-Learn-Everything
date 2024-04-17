import { useEffect, useState } from "react";
import "./App.css";
import { Auth } from "./components/auth";
import { db } from "./config/firebase";
import { getDocs, collection } from "firebase/firestore";

function App() {
  const [lessonList, setLessonList] = useState([]);

  const lessonsCollectionRef = collection(db, "lessons");

  useEffect(() => {
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

    getLessonList();
  }, []);

  return (
    <div className="App">
      <Auth />

      <div>
        <input placeholder="Lesson title..." />
        <input placeholder="Content..." />
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
