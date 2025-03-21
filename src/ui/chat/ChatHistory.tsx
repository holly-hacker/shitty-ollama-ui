import { useContext } from 'react';
import { OllamaContext } from '../../state/OllamaContext';
import './ChatHistory.css';

export default function ChatHistory() {
	const { state } = useContext(OllamaContext);

	if (!state.messages) {
		return <>No messages yet</>;
	}

	return (
		<div className="message-container">
			{state.messages.map((msg) => (
				<article
					className={msg.side}
					key={msg.id}
					aria-busy={!msg.text && state.streaming}
				>
					{msg.text}
				</article>
			))}
		</div>
	);
}
