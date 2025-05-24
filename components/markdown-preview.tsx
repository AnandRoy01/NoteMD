"use client";

import type React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { nord } from "react-syntax-highlighter/dist/esm/styles/prism";

interface MarkdownPreviewProps {
  markdown: string;
}

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ markdown }) => {
  return (
    <div className="prose prose-stone dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-2xl font-bold mt-6 mb-4" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-xl font-bold mt-5 mb-3" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-lg font-bold mt-4 mb-2" {...props} />
          ),
          p: ({ node, ...props }) => <p className="my-3" {...props} />,
          ul: ({ node, ...props }) => (
            <ul className="list-disc pl-6 my-3" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal pl-6 my-3" {...props} />
          ),
          li: ({ node, ...props }) => <li className="my-1" {...props} />,
          a: ({ node, ...props }) => (
            <a
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-muted pl-4 italic my-4"
              {...props}
            />
          ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-4">
              <table className="border-collapse w-full" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-muted/50" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th
              className="border border-border px-4 py-2 text-left font-semibold"
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td className="border border-border px-4 py-2" {...props} />
          ),
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                style={nord}
                language={match[1]}
                PreTag="div"
                className="rounded-md my-4"
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code
                className="bg-muted px-1.5 py-0.5 rounded-md text-sm"
                {...props}
              >
                {children}
              </code>
            );
          },
          hr: ({ node, ...props }) => (
            <hr className="my-6 border-border" {...props} />
          ),
          img: ({ node, ...props }) => (
            <img className="max-w-full rounded-md my-4" {...props} />
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownPreview;
