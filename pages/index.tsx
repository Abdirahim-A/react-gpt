import { useState, useRef, useEffect, useMemo } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import CircularProgress from '@mui/material/CircularProgress';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { Logo as ReactLogo } from '../components/ReactLogo';
import CodeBlock from '@/components/CodeBlock';

type Message = {
  type: 'apiMessage' | 'userMessage';
  message: string;
  isStreaming?: boolean;
};

export default function Home() {
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messageState, setMessageState] = useState<{
    messages: Message[];
    pending?: string;
    history: [string, string][];
  }>({
    messages: [
      {
        message: 'Hi there! What do you want to know about Decipad?',
        type: 'apiMessage',
      },
    ],
    history: [],
  });
  const { messages, pending, history } = messageState;

  const messageListRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Auto scroll chat to bottom
  useEffect(() => {
    const messageList = messageListRef.current;
    if (messageList) {
      messageList.scrollTop = messageList.scrollHeight;
    }
  }, [messages]);

  // Focus on text field on load
  useEffect(() => {
    textAreaRef.current?.focus();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const question = userInput.trim();
    if (question === '') {
      return;
    }

    setMessageState((state) => ({
      ...state,
      messages: [
        ...state.messages,
        {
          type: 'userMessage',
          message: question,
        },
      ],
      pending: undefined,
    }));

    setLoading(true);
    setUserInput('');
    setMessageState((state) => ({ ...state, pending: '' }));

    const ctrl = new AbortController();

    fetchEventSource('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question,
        history,
      }),
      signal: ctrl.signal,
      onmessage: (event) => {
        if (event.data === '[DONE]') {
          setMessageState((state) => ({
            history: [...state.history, [question, state.pending ?? '']],
            messages: [
              ...state.messages,
              {
                type: 'apiMessage',
                message: state.pending ?? '',
              },
            ],
            pending: undefined,
          }));
          setLoading(false);
          ctrl.abort();
        } else {
          const data = JSON.parse(event.data);
          setMessageState((state) => ({
            ...state,
            pending: (state.pending ?? '') + data.data,
          }));
        }
      },
    });
  };

  // Prevent blank submissions and allow for multiline input
  const handleEnter = (e: any) => {
    if (e.key === 'Enter' && userInput) {
      if (!e.shiftKey && userInput) {
        handleSubmit(e);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const chatMessages = useMemo(() => {
    return [
      ...messages,
      ...(pending ? [{ type: 'apiMessage', message: pending }] : []),
    ];
  }, [messages, pending]);

  console.log(chatMessages);

  const test =
    '\nYou can use the `lookup` function to calculate month over month. Here is an example from the documentation: \n\n```deci live\nCashflow = {\n  Month = [date(2023-01), date(2023-02), date(2023-03), date(2023-04), date(2023-05)]\n  Expenses = [500 GBP, 500 GBP, 600 GBP, 700 GBP, 700 GBP]\n  Income = [0 GBP, 400 GBP, 800 GBP, 2000 GBP, 3000 GBP]\n  Profit = Income - Expenses\n}\n\nlookup(Cashflow, Cashflow.Profit >= 0).Month\n==> month 2023-03\n```\n\nFor more information, please refer to the [Decipad Documentation](https://app.decipad.com/docs/quick-start/get-started-with-decipad).';

  return (
    <>
      <Head>
        <title>React GPT</title>
        <meta
          name="description"
          content="An experiment running a context-focused Chatbot using React"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.cloud}>
          <div ref={messageListRef} className={styles.messagelist}>
            {chatMessages.map((message, index) => {
              let icon;
              let className;

              if (message.type === 'apiMessage') {
                icon = (
                  <ReactLogo
                    width="30"
                    height="30"
                    className={styles.boticon}
                  />
                );
                className = styles.apimessage;
              } else {
                icon = (
                  <Image
                    src="/usericon.png"
                    alt="Me"
                    width="30"
                    height="30"
                    className={styles.usericon}
                    priority
                  />
                );

                // The latest message sent by the user will be animated while waiting for a response
                className =
                  loading && index === chatMessages.length - 1
                    ? styles.usermessagewaiting
                    : styles.usermessage;
              }
              return (
                <div key={index} className={className}>
                  {icon}
                  <div className={styles.markdownanswer}>
                    {/* <ReactMarkdown
                      linkTarget="_blank"
                      components={{ code: CodeBlock }}
                    >
                      {test}
                    </ReactMarkdown> */}
                    <ReactMarkdown linkTarget="_blank" >
                      {message.message}
                    </ReactMarkdown>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className={styles.center}>
          <div className={styles.cloudform}>
            <form onSubmit={handleSubmit}>
              <textarea
                disabled={loading}
                onKeyDown={handleEnter}
                ref={textAreaRef}
                autoFocus={false}
                rows={1}
                maxLength={512}
                id="userInput"
                name="userInput"
                placeholder={
                  loading ? 'Waiting for response...' : 'Type your question...'
                }
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className={styles.textarea}
              />
              <button
                type="submit"
                disabled={loading}
                className={styles.generatebutton}
              >
                {loading ? (
                  <div className={styles.loadingwheel}>
                    <CircularProgress color="inherit" size={20} />
                  </div>
                ) : (
                  // Send icon SVG in input field
                  <svg
                    viewBox="0 0 20 20"
                    className={styles.svgicon}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                  </svg>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
