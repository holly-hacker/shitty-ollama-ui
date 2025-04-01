import { useContext } from 'react';
import { OllamaContext } from '../../state/OllamaContext';
import './ChatHistory.css';
import { generateResponse } from '../../utils/ollama';
import ChatMessage from './ChatMessage';

export default function ChatHistory() {
	const { state, dispatch } = useContext(OllamaContext);

	if (!state.messages) {
		return <>No messages yet</>;
	}

	return (
		<div className="messages-container">
			{state.messages.map((msg) => (
				<ChatMessage key={msg.id} message={msg} />
			))}
			{state.messages.filter((msg) => msg.side !== 'system').at(-1)?.side ===
				'user' && (
				<button
					type="button"
					className="generate-assistant-message outline"
					onClick={() => {
						generateResponse(state, dispatch);
					}}
				>
					Generate assistant message
				</button>
			)}
		</div>
	);
}
