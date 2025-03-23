import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

export default function ChatMarkdown({
	children: markdownText,
}: { children: string }) {
	return (
		<Markdown
			remarkPlugins={[remarkGfm]}
			components={{
				code(props) {
					const { children, className, node, ...rest } = props;
					const match = /language-(\w+)/.exec(className || '');
					return match ? (
						<SyntaxHighlighter PreTag="div" language={match[1]} style={dracula}>
							{children ? String(children).replace(/\n$/, '') : ''}
						</SyntaxHighlighter>
					) : (
						<code {...rest} className={className}>
							{children}
						</code>
					);
				},
			}}
		>
			{markdownText}
		</Markdown>
	);
}
