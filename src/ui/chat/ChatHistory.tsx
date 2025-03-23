import { useContext } from 'react';
import { OllamaContext } from '../../state/OllamaContext';
import './ChatHistory.css';
import ChatMessage from './ChatMessage';

export default function ChatHistory() {
	const { state } = useContext(OllamaContext);

	if (!state.messages) {
		return <>No messages yet</>;
	}

	return (
		<div className="messages-container">
			{state.messages.map((msg) => (
				<ChatMessage key={msg.id} message={msg} />
			))}
		</div>
	);
}
