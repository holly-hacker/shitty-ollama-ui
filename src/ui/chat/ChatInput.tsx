import { useContext, useEffect, useState } from 'react';
import { OllamaContext } from '../../state/OllamaContext';
import './ChatInput.css';
import { SendIcon, StopCircleIcon } from 'lucide-react';
import { generateResponse } from '../../utils/ollama';

export default function ChatInput() {
	const { state, dispatch } = useContext(OllamaContext);

	const [textInput, setTextInput] = useState('');
	const [generateResponseQueued, setGenerateResponseQueued] = useState(false);

	const isEnabled = state.modelName && !state.streaming;

	useEffect(() => {
		if (generateResponseQueued) {
			generateResponse(state, dispatch);
			setGenerateResponseQueued(false);
		}
	}, [state, dispatch, generateResponseQueued]);

	function handleKeyDown(
		event: React.KeyboardEvent<HTMLTextAreaElement>,
	): void {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			trySendMessage();
		}
	}

	function trySendMessage() {
		if (textInput.trim()) {
			dispatch({ type: 'addMessage', text: textInput.trim(), role: 'user' });
			setGenerateResponseQueued(true);
			setTextInput('');
		}
	}

	return (
		<div className="chat-bar">
			<div className="chat-bar-input">
				<textarea
					disabled={!isEnabled}
					placeholder="Type to chat..."
					value={textInput}
					onChange={(e) => setTextInput(e.target.value)}
					onKeyDown={handleKeyDown}
				/>
				<small>
					Press <kbd>Enter</kbd> to send or <kbd>Enter</kbd>+<kbd>Shift</kbd> to
					create a new line.
				</small>

				<button
					type="button"
					className={`send-stop-icon ${state.streaming ? 'secondary' : ''}`}
					disabled={!state.streaming && !textInput.trim()}
					onClick={() => {
						if (state.streaming) {
							state.api.abort();
						} else {
							trySendMessage();
						}
					}}
				>
					{!state.streaming ? <SendIcon /> : <StopCircleIcon />}
				</button>
			</div>
		</div>
	);
}
