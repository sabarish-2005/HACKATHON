import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const fallbackAnswers: { keywords: string[]; response: string }[] = [
  {
    keywords: ["eligibility", "eligible", "who can"],
    response:
      "Eligibility: Participants must belong to the AI/ML department and form a 2-member team.",
  },
  {
    keywords: ["team size", "team", "members"],
    response: "Team size is fixed to 2 members.",
  },
  {
    keywords: ["register", "registration", "steps"],
    response:
      "Registration steps: Fill team info, leader details, member 2 details, then submit the form.",
  },
  {
    keywords: ["contact", "help", "support"],
    response:
      "For additional support, contact the event coordinators listed on the home page.",
  },
];

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const getFallbackResponse = (message: string) => {
  const normalized = message.toLowerCase();
  const match = fallbackAnswers.find((entry) =>
    entry.keywords.some((keyword) => normalized.includes(keyword))
  );
  return (
    match?.response ||
    "I can help with eligibility, team size, registration steps, or contact details."
  );
};

const RegisterAiHelp = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! I can help with eligibility, team size, registration steps, and contact info.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;
  const model = (import.meta.env.VITE_OPENAI_MODEL as string | undefined) ?? "gpt-4o-mini";

  const systemPrompt = useMemo(
    () =>
      [
        "You are a registration help assistant for a college hackathon.",
        "Only answer about eligibility, team size, registration steps, or contact details.",
        "Keep answers short and clear.",
      ].join(" "),
    []
  );

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) {
      return;
    }

    const nextMessages = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");

    if (!apiKey) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: getFallbackResponse(trimmed) },
      ]);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            ...nextMessages.map((message) => ({
              role: message.role,
              content: message.content,
            })),
          ],
          temperature: 0.2,
        }),
      });

      if (!response.ok) {
        throw new Error("AI response failed");
      }

      const data = (await response.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const answer = data.choices?.[0]?.message?.content?.trim();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: answer || getFallbackResponse(trimmed),
        },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: getFallbackResponse(trimmed) },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card p-6 md:p-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-display font-semibold">AI Help (24/7)</h3>
          <p className="text-sm text-muted-foreground">
            Ask about eligibility, team size, registration, or contact.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="max-h-64 overflow-y-auto rounded-lg border border-border/60 bg-muted/30 p-4">
          <div className="space-y-3">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={
                  message.role === "user"
                    ? "flex justify-end"
                    : "flex justify-start"
                }
              >
                <div
                  className={
                    message.role === "user"
                      ? "max-w-[80%] rounded-lg bg-primary/20 px-3 py-2 text-sm"
                      : "max-w-[80%] rounded-lg bg-muted px-3 py-2 text-sm"
                  }
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading ? (
              <div className="text-xs text-muted-foreground">Thinking...</div>
            ) : null}
          </div>
        </div>

        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Type your question"
            className="bg-muted/50 border-border"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                void sendMessage();
              }
            }}
          />
          <Button type="button" variant="hero" onClick={sendMessage} disabled={isLoading}>
            Ask
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RegisterAiHelp;
