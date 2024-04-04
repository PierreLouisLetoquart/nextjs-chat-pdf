"use client";

import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

export function PdfViewer({ url }: { url: string }) {
  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
      <div className="w-full h-full bg-background overflow-hidden">
        <Viewer defaultScale={1} fileUrl={url} />
      </div>
    </Worker>
  );
}
