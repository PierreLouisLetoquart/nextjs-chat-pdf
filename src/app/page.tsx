"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { WebPDFLoader } from "langchain/document_loaders/web/pdf";
import { Document } from "langchain/document";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { v4 as uuidv4 } from "uuid";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import {
  ChatEl,
  ChatElMessage,
  ChatElWelcome,
  ChatMessage,
} from "@/components/chat";
// import { PdfViewer } from "@/components/pdf-viewer";

export default function Home() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [docs, setDocs] = useState<Document[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState<string>("");

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const [embedding, setEmbedding] = useState<OllamaEmbeddings | null>(null); // embedding model
  const [vectorStore, setVectorStore] = useState<MemoryVectorStore | null>(
    null,
  ); // vector store
  const [model, setModel] = useState<ChatOllama | null>(null); // chat model

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];

    if (!file) return;
    setPdfUrl(URL.createObjectURL(file));

    const loader = new WebPDFLoader(file);
    const docs = await loader.load();

    const splitter = new RecursiveCharacterTextSplitter();
    const splitDocs = await splitter.splitDocuments(docs);

    setDocs((prev) => [...prev, ...splitDocs]);

    loadVectorStore();
  };

  useEffect(() => {
    const loadEmbedding = async () => {
      const embeddings = new OllamaEmbeddings({
        model: "nomic-embed-text",
        maxConcurrency: 5,
      });

      setEmbedding(embeddings);
    };

    const loadModel = async () => {
      const chatModel = new ChatOllama({
        baseUrl: "http://localhost:11434", // Default value
        model: "mistral",
      });

      setModel(chatModel);
    };

    loadEmbedding();
    loadModel();
  }, []);

  const loadVectorStore = useCallback(async () => {
    if (!embedding) return;
    const vecStore = await MemoryVectorStore.fromDocuments(docs, embedding);

    setVectorStore(vecStore);
  }, [embedding, docs]);

  useEffect(() => {
    if (!embedding) return;
    if (docs.length === 0) return;

    loadVectorStore();
  }, [loadVectorStore, docs.length, embedding]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatMessages]);

  const getLlmChain = async () => {
    if (!model || !vectorStore) return;

    const prompt =
      ChatPromptTemplate.fromTemplate(`Answer the following question based only on the provided context:

    <context>
    {context}
    </context>

    Question: {input}`);

    const documentChain = await createStuffDocumentsChain({
      llm: model,
      prompt,
    });

    const retriever = vectorStore.asRetriever();

    const retrievalChain = await createRetrievalChain({
      combineDocsChain: documentChain,
      retriever,
    });

    return retrievalChain;
  };

  const handleSend = async () => {
    if (!userInput || userInput === "") return;

    setChatMessages((prevChatMessages) => [
      ...prevChatMessages,
      {
        id: uuidv4(),
        message: userInput,
        isAssistant: false,
      },
    ]);

    setUserInput("");

    // chat history string
    // [
    //   HumanMessage {
    //     content: 'hi!'
    //   },
    //   AIMessage {
    //     content: 'whats up?'
    //   }
    // ]

    const history = chatMessages.map((msg) => {
      if (msg.isAssistant) {
        return {
          type: "AI",
          content: msg.message,
        };
      } else {
        return {
          type: "Human",
          content: msg.message,
        };
      }
    });

    const llmChain = await getLlmChain();
    if (!llmChain) return;
    const response = await llmChain.invoke({
      chat_history: JSON.stringify(history),
      input: userInput,
    });

    setChatMessages((prevChatMessages) => [
      ...prevChatMessages,
      {
        id: uuidv4(),
        message: response.answer,
        isAssistant: true,
      },
    ]);
  };

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={55} minSize={35} maxSize={60}>
        <div className="flex h-full items-center justify-center">
          {pdfUrl ? (
            // <PdfViewer url={pdfUrl} />
            <iframe
              className="w-full h-full bg-background overflow-hidden"
              src={pdfUrl}
              width="100%"
            />
          ) : (
            <div
              className="flex flex-col items-center gap-3"
              onClick={() => {
                const input = document.querySelector(
                  "input[type=file]",
                ) as HTMLInputElement;
                if (input) {
                  input.click();
                }
              }}
            >
              <div className="relative size-24">
                <Image
                  src="/doc.png"
                  layout="fill"
                  objectFit="contain"
                  alt="An illustration of a PDF document"
                />
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleChange}
                  className="hidden"
                />
              </div>
              <p className="text-xs text-foreground font-semibold text-center tracking-tight leading-5">
                Drag and drop a PDF file here <br /> or click to browse
              </p>
            </div>
          )}
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={45}>
        <div className="flex flex-col h-full p-4">
          <ChatEl ref={chatContainerRef}>
            {chatMessages.length === 0 && (
              <ChatElWelcome setUserInput={setUserInput} />
            )}
            {chatMessages.map((chatMessage) => (
              <ChatElMessage
                key={chatMessage.id}
                message={chatMessage.message}
                isAssistant={chatMessage.isAssistant}
              />
            ))}
          </ChatEl>

          <div className="w-full py-2 pr-2 flex items-center gap-2 rounded-lg border border-input">
            <input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="border-none outline-none flex h-9 w-full px-3 py-1 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 bg-transparent text-foreground caret-primary"
              type="text"
              placeholder="Enter a question on the document..."
            />
            <Button onClick={handleSend}>Ask</Button>
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
