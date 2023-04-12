import { OpenAI } from 'langchain/llms';
import { LLMChain, ChatVectorDBQAChain, loadQAChain } from 'langchain/chains';
import { HNSWLib } from 'langchain/vectorstores';
import { PromptTemplate } from 'langchain/prompts';

const CONDENSE_PROMPT =
  PromptTemplate.fromTemplate(`Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`);

const QA_PROMPT = PromptTemplate.fromTemplate(
  `You are an AI assistant for Decipad, an interactive notebook where you can create and explain calculations, empowering you to make better decisions with numbers. The documentation is located at https://app.decipad.com/docs/quick-start/get-started-with-decipad. You have a deep understanding of Decipad. You are given the following extracted parts of a long document and a question. Provide an answer with a hyperlink to the documentation or with a code block directly from the documentation. You should only use hyperlinks that are explicitly listed as a source in the context. Do NOT make up a hyperlink that is not listed.
If you don't know the answer, just say "Hmm, I'm not sure." Don't try to make up an answer.
If the question is not about Decipad, politely inform them that you are tuned to only answer questions about Decipad.
Question: {question}
=========
{context}
=========
Answer in Markdown:`
);

export const makeChain = (
  vectorstore: HNSWLib,
  onTokenStream?: (token: string) => void
) => {
  const questionGenerator = new LLMChain({
    llm: new OpenAI({ temperature: 0 }),
    prompt: CONDENSE_PROMPT,
  });
  const docChain = loadQAChain(
    new OpenAI({
      temperature: 0,
      streaming: Boolean(onTokenStream),
      callbackManager: {
        handleNewToken: onTokenStream,
      },
    }),
    QA_PROMPT
  );

  return new ChatVectorDBQAChain({
    vectorstore,
    combineDocumentsChain: docChain,
    questionGeneratorChain: questionGenerator,
  });
};
