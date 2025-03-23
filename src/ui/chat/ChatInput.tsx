import { useContext, useEffect, useState } from 'react';
import {
	OllamaContext,
	type OllamaDispatchMessage,
	type OllamaState,
} from '../../state/OllamaContext';
import './ChatInput.css';

async function generateResponse(
	state: OllamaState,
	dispatch: (action: OllamaDispatchMessage) => void,
) {
	const newMessageId = state.nextMessageId;
	dispatch({ type: 'addMessage', text: '', role: 'assistant' });

	// should not happen
	if (!state.modelName) return;

	dispatch({ type: 'setStreaming', streaming: true });
	const responseStream = await state.api.chat({
		stream: true,
		model: state.modelName,
		messages: state.messages.map((msg) => ({
			content: msg.text,
			role: msg.side,
		})),
	});

	let message = '';
	try {
		for await (const part of responseStream) {
			message += part.message.content;
			dispatch({ type: 'updateMessage', id: newMessageId, text: message });
		}
	} catch (e) {
		console.error(`Error during generation: ${e}`);
	}
	dispatch({ type: 'setStreaming', streaming: false });
}

export default function ChatInput() {
	const { state, dispatch } = useContext(OllamaContext);

	const [textInput, setTextInput] = useState('');
	const [shouldGenerateResponse, setShouldGenerateResponse] = useState(false);

	const isEnabled = state.modelName && !state.streaming;

	useEffect(() => {
		if (shouldGenerateResponse) {
			generateResponse(state, dispatch);
			setShouldGenerateResponse(false);
		}
	}, [state, dispatch, shouldGenerateResponse]);

	function handleKeyDown(
		event: React.KeyboardEvent<HTMLTextAreaElement>,
	): void {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();

			if (textInput.trim()) {
				dispatch({ type: 'addMessage', text: textInput.trim(), role: 'user' });
				setShouldGenerateResponse(true);
				setTextInput('');
			}
		}
	}

	return (
		<>
			<textarea
				disabled={!isEnabled}
				placeholder="Type to chat..."
				value={textInput}
				onChange={(e) => setTextInput(e.target.value)}
				onKeyDown={handleKeyDown}
			/>
			<small>
				Press <kbd>Enter</kbd> to send, press <kbd>Enter</kbd>+<kbd>Shift</kbd>{' '}
				to create a new line.
			</small>
		</>
	);
}
