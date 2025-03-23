import type {
	OllamaDispatchMessage,
	OllamaState,
} from '../state/OllamaContext';

export async function generateResponse(
	state: OllamaState,
	dispatch: (action: OllamaDispatchMessage) => void,
) {
	const newMessageId = state.nextMessageId;

	// should not happen
	if (!state.modelName) return;

	dispatch({ type: 'setStreaming', streaming: true });
	dispatch({ type: 'addMessage', text: '', role: 'assistant' });
	const responseStream = await state.api.chat({
		stream: true,
		model: state.modelName,
		messages: state.messages.map((msg) => ({
			content: msg.history[msg.historyIndex],
			role: msg.side,
		})),
	});

	let message = '';
	try {
		for await (const part of responseStream) {
			message += part.message.content;
			dispatch({
				type: 'updateMessageText',
				id: newMessageId,
				text: message,
				historyIndex: 0,
			});
		}
	} catch (e) {
		console.error(`Error during generation: ${e}`);
	}
	dispatch({ type: 'setStreaming', streaming: false });
}

export async function regenerateResponse(
	state: OllamaState,
	messageId: number,
	dispatch: (action: OllamaDispatchMessage) => void,
) {
	const messageToEdit = state.messages.find((m) => m.id === messageId);
	if (!messageToEdit) return;
	const messageIndex = state.messages.indexOf(messageToEdit);
	if (messageIndex === -1) return;

	// should not happen
	if (!state.modelName) return;

	dispatch({ type: 'setStreaming', streaming: true });

	let message = '';
	dispatch({ type: 'addMessageHistory', text: message, id: messageId });

	const responseStream = await state.api.chat({
		stream: true,
		model: state.modelName,
		messages: state.messages.slice(0, messageIndex).map((msg) => ({
			content: msg.history[msg.historyIndex],
			role: msg.side,
		})),
	});

	try {
		for await (const part of responseStream) {
			message += part.message.content;
			dispatch({ type: 'updateMessageText', id: messageId, text: message });
		}
	} catch (e) {
		console.error(`Error during generation: ${e}`);
	}
	dispatch({ type: 'setStreaming', streaming: false });
}
