import { useEffect, useRef, useState } from "react";
import { Question } from "../../models/Questions";
import Layout from "../../components/Layout";
import { useAuthentication } from "../../hooks/authentication";
import firebase from "firebase";
import dayjs, { QUnitType } from "dayjs";
import Link from "next/link";

export default function QuestionsRecieved() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isPaginationFinished, setIsPaginationFinished] = useState(false);
  const { user } = useAuthentication();
  const scrollContainerRef = useRef(null);

  function createBaseQuery() {
    return firebase
      .firestore()
      .collection("questions")
      .where("receiverUid", "==", user.uid)
      .orderBy("createdAt", "desc")
      .limit(10);
  }

  function appendQuestions(
    snapshot: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
  ) {
    const gotQuestions = snapshot.docs.map((doc) => {
      const question = doc.data() as Question;
      question.id = doc.id;
      return question;
    });
    setQuestions(questions.concat(gotQuestions));
  }

  async function loadQuestions() {
    const snapShot = await createBaseQuery().get();

    if (snapShot.empty) {
      setIsPaginationFinished(true);
      return;
    }

    appendQuestions(snapShot);
  }

  async function loadNextQuestions() {
    if (questions.length === 0) {
      return;
    }

    const lastQuestion = questions[questions.length - 1];
    const snapShot = await createBaseQuery()
      .startAfter(lastQuestion.createdAt)
      .get();

    if (snapShot.empty) {
      setIsPaginationFinished(true);
      return;
    }

    appendQuestions(snapShot);
  }

  function onScroll() {
    if (isPaginationFinished) {
      return;
    }

    const container = scrollContainerRef.current;
    if (container === null) {
      return;
    }

    const rect = container.getBoundingClientRect();
    if (rect.top + rect.height > window.innerHeight) {
      return;
    }

    loadNextQuestions();
  }

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [questions, scrollContainerRef.current, isPaginationFinished]);

  useEffect(() => {
    if (!process.browser) {
      return;
    }

    if (user === null) {
      return;
    }

    loadQuestions();
  }, [process.browser, user]);

  return (
    <Layout>
      <div className="row justify-content-center">
        <div className="col-12 col-md-6" ref={scrollContainerRef}>
          {questions.map((question) => (
            <Link
              href="/questions/[id]"
              as={`/questions/${question.id}`}
              key={question.id}
            >
              <div className="card my-3" key={question.id}>
                <div className="card-body">
                  <div className="text-truncate">{question.body}</div>
                  <small>
                    {dayjs(question.createdAt.toDate()).format(
                      "YYYY/MM/DD/ HH:mm"
                    )}
                  </small>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
