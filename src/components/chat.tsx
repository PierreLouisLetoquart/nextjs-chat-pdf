import * as React from "react";

import { Card } from "@/components/ui/card";

import { cn } from "@/lib/utils";

type ChatMessage = {
  id: string;
  message: string;
  isAssistant: boolean;
};

interface ChatProps extends React.HTMLAttributes<HTMLDivElement> {}

const ChatEl = React.forwardRef<HTMLDivElement, ChatProps>(
  ({ children, className, ...props }, chatContainerRef) => {
    return (
      <div
        ref={chatContainerRef}
        className={cn("flex-grow overflow-y-scroll", className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);

ChatEl.displayName = "Chat";

interface ChatElMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  message: string;
  isAssistant: boolean;
}

const ChatElMessage = ({
  message,
  isAssistant,
  className,
  ...props
}: ChatElMessageProps) => {
  return (
    <div className={cn("flex flex-col p-4", className)} {...props}>
      <h4
        className={`mb-2 text-sm font-medium tracking-tight ${
          isAssistant ? "text-foreground" : "text-primary"
        }`}
      >
        {isAssistant ? "Assistant" : "You"}
      </h4>
      <p className="w-full text-lg leading-7">{message}</p>
    </div>
  );
};

ChatElMessage.displayName = "ChatMessage";

interface ChatElWelcomeProps extends React.HTMLAttributes<HTMLDivElement> {
  setUserInput: (input: string) => void;
}

const ChatElWelcome = ({ setUserInput, ...props }: ChatElWelcomeProps) => {
  return (
    <div
      className="flex h-full flex-col items-center justify-center gap-6"
      {...props}
    >
      <h3 className="text-4xl font-bold tracking-tight">What&apos;s up ? 👋</h3>
      <p className="text-muted-foreground font-light tracking-tight">
        Start a conversation with the assistant
      </p>
      <div className="flex items-center gap-3">
        <Card
          className="hover:bg-muted cursor-pointer p-2 transition-colors ease-in-out"
          onClick={() => setUserInput("I need help with my code")}
        >
          <p className="text-muted-foreground text-xs font-medium">
            Coding assistant
          </p>
        </Card>
        <Card
          className="hover:bg-muted cursor-pointer p-2 transition-colors ease-in-out"
          onClick={() => setUserInput("I need help with my email")}
        >
          <p className="text-muted-foreground text-xs font-medium">
            Email writer
          </p>
        </Card>
        <Card
          className="hover:bg-muted cursor-pointer p-2 transition-colors ease-in-out"
          onClick={() => setUserInput("I need help with my cooking")}
        >
          <p className="text-muted-foreground text-xs font-medium">
            Cooking master
          </p>
        </Card>
      </div>
    </div>
  );
};

ChatElWelcome.displayName = "ChatWelcome";

export { type ChatMessage, ChatEl, ChatElMessage, ChatElWelcome };
