"use client";
import { useState } from "react";
import { WebPDFLoader } from "langchain/document_loaders/web/pdf";
import { Document } from "langchain/document";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { PdfViewer } from "@/components/pdf-viewer";

export default function Home() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [docs, setDocs] = useState<Document[]>([]);

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
  };

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={55} minSize={35} maxSize={60}>
        <div className="flex h-full items-center justify-center p-4">
          {pdfUrl ? (
            // <PdfViewer url={pdfUrl} />
            <iframe
              className="w-full h-full bg-background overflow-hidden"
              src={pdfUrl}
              width="100%"
            />
          ) : (
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="file">Picture</Label>
              <Input
                id="file"
                type="file"
                accept="application/pdf"
                onChange={handleChange}
              />
            </div>
          )}
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={45}>
        <div className="flex h-full p-4">
          <pre className="overflow-auto">{JSON.stringify(docs, null, 2)}</pre>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
