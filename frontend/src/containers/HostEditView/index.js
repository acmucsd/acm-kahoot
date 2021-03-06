import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import { getQuestions, getPackByID, postPack, getQuestionByID } from '../../util/api';

import styles from './styles.module.scss';
import QuestionEditHeader from './containers/Header';
import QuestionSidebar from './containers/Sidebar';
import QuestionEditor from './containers/QuestionEditor';
import Overlay from './containers/Overlay';
import LoadingView from '../LoadingView';

export default function HostEditView() {
  const { id } = useParams();
  const history = useHistory();
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  const [hasOverlay, setOverlay] = useState(false);
  const [curDeck, setDeck] = useState(getDefaultDeck());
  const [curQuestions, setQuestions] = useState(curDeck.questions);
  const [curQuestion, setQuestion] = useState(curDeck.questions[0]);
  // const [questions, setQuestions] = useState([]);
  const [moreQuestions, setMoreQuestions] = useState([]);

  // Fetch curDeck info if we're editing an existing curDeck.
  useEffect(() => {
    if (parseInt(id) >= 0) {
      getPackByID(id).then((result) => {
        const questionIDs = result.questions;
        Promise.all(questionIDs.map(id => getQuestionByID(id))).then((questions) => {
          console.log(questions);
          result.questions = questions;
          bufferPack(result);
          setDeck(result);
          setQuestions(result.questions);
          setQuestion(result.questions[0]);
          setIsLoaded(true);
        });
      }).catch((err) => {
        console.warn(err);
        setError(err);
        setIsLoaded(true);
      });
    } else {
      setIsLoaded(true);
    }

    getQuestions().then((questions) => {
      setMoreQuestions(questions);
    }).catch((e) => {
      console.warn(e);
    });
  }, [id]);

  const handleDeckConfirm = () => {
    cleanPack(curDeck);
    console.log('Posting a pack.', curDeck);
    postPack(curDeck).catch((err) => {
      console.warn(err);
    }).then(() => {
      history.push('/host/decks');
    });
  };

  const handleChangeTitle = (title) => {
    curDeck.name = title;
  };

  const handleChangeQuestion = (question) => {
    setQuestion(question);
  };

  const handleNewQuestion = () => {
    curDeck.questions.push(getDefaultQuestion());
    setQuestion(curDeck.questions[curDeck.questions.length-1]);
  };

  const handleAddExistingQuestion = (question) => {
    curDeck.questions.push(copyQuestion(question));
    setQuestion(curDeck.questions[curDeck.questions.length-1]);
  }

  const handleOverlay = () => {
    setOverlay(!hasOverlay);
  }

  if (error) return <div>Error!</div>;
  if (!isLoaded) return <LoadingView />;

  return (
    <div className={styles.HostEditView}>
      <QuestionEditHeader name={curDeck.name} onChange={handleChangeTitle} onSubmit={handleDeckConfirm} />
      <div className={styles.content}>
        <div className={styles.sidebar}>
          <QuestionSidebar questions={curQuestions} onChange={handleChangeQuestion} onMoreQuestions={handleOverlay} onAddQuestion={handleNewQuestion} />
        </div>
        <div className={`${styles.editor}`}>
          {hasOverlay ?
            <Overlay questions={moreQuestions} onAdd={handleAddExistingQuestion} />
            : <QuestionEditor question={curQuestion} />}
        </div>
      </div>
    </div>
  );
}

function bufferPack(pack) {
  for (const q of pack.questions) {
    while (q.answers.length < 4) {
      q.answers.push({
        answer: '',
        correct: false,
      });
    }
  }
}

function cleanPack(pack) {
  for (const q of pack.questions) {
    q.time = parseInt(q.time);
    q.answers = q.answers.filter(ans => ans.answer.replace(/\s/g, '') != '');
  }
}

function getDefaultDeck() {
  const defaultDeck = {
    name: 'New Deck',
    description: 'No description.',
    questions: [
      {
        name: 'Default Question',
        question: 'New Question',
        answers: [
          {
            answer: '',
            correct: true,
          },
          {
            answer: '',
            correct: false,
          },
          {
            answer: '',
            correct: false,
          },
          {
            answer: '',
            correct: false,
          },
        ],
        points: 1000,
        time: 20,
      },
    ],
  };
  return defaultDeck;
}

function getDefaultQuestion() {
  const defaultQuestion = {
    name: 'Default Question',
    question: 'New Question',
    answers: [
      {
        answer: '',
        correct: true,
      },
      {
        answer: '',
        correct: false,
      },
      {
        answer: '',
        correct: false,
      },
      {
        answer: '',
        correct: false,
      },
    ],
    points: 1000,
    time: 20,
  };
  return defaultQuestion;
}

function copyQuestion(question) {
  const copyQuestion = {
    name: question.name,
    question: question.question,
    answers: [
      {
        answer: question.answers[0] ? question.answers[0].answer : '',
        correct: question.answers[0] ? question.answers[0].correct : false,
      },
      {
        answer: question.answers[1] ? question.answers[1].answer :'',
        correct: question.answers[1] ? question.answers[1].correct : false,
      },
      {
        answer: question.answers[2] ? question.answers[2].answer : '',
        correct: question.answers[2] ? question.answers[2].correct : false,
      },
      {
        answer: question.answers[3] ? question.answers[3].answer : '',
        correct: question.answers[3] ? question.answers[3].correct : false,
      },
    ],
    points: question.points,
    time: question.time,
  };
  return copyQuestion;
}