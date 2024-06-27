import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import "../styles/lesson.css";

export const Lesson = () => {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getLesson = async () => {
      const lessonDoc = doc(db, "lessons", id);
      const lessonData = await getDoc(lessonDoc);
      if (lessonData.exists()) {
        setLesson(lessonData.data());
      } else {
        console.error("No such document!");
      }
    };

    getLesson();
  }, [id]);

  return (
    <div className="lesson-container">
      {lesson ? (
        <>
          <h1>{lesson.title}</h1>
          <p>{lesson.content}</p>
          <button onClick={() => navigate("/main")}>Close</button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};
