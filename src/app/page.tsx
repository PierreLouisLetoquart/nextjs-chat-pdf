"use client";
import { useState } from "react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PdfViewer } from "@/components/pdf-viewer";

export default function Home() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={55} minSize={35} maxSize={60}>
        <div className="flex h-full items-center justify-center p-6">
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
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = URL.createObjectURL(file);
                    setPdfUrl(url);
                  }
                }}
              />
            </div>
          )}
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={45}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Content</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
