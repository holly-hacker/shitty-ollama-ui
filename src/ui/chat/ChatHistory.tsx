import { useContext } from 'react';
import { OllamaContext } from '../../state/OllamaContext';
import './ChatHistory.css';
import ChatMarkdown from '../util/ChatMarkdown';
import { SettingsContext } from '../../state/SettingsContext';

export default function ChatHistory() {
	const { state } = useContext(OllamaContext);
	const { settings } = useContext(SettingsContext);

	if (!state.messages) {
		return <>No messages yet</>;
	}

	const useMarkdown = settings.useMarkdown;

	return (
		<div className="message-container">
			{state.messages.map((msg) => (
				<article
					className={`${msg.side} ${useMarkdown ? 'md' : 'no-md'}`}
					key={msg.id}
					aria-busy={!msg.text && state.streaming}
				>
					{useMarkdown ? <ChatMarkdown>{msg.text}</ChatMarkdown> : msg.text}
				</article>
			))}
		</div>
	);
}
