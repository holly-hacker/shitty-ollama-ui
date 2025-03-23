import { Ollama } from 'ollama/browser';
import { createContext, useReducer } from 'react';

export type OllamaDispatchMessage =
	| { type: 'setModel'; modelName: string }
	| { type: 'addMessage'; text: string; role: ChatMessageSide }
	| { type: 'addMessageHistory'; id: number; text: string }
	| {
			type: 'updateMessage';
			id: number;
			patch: Exclude<Partial<ChatMessage>, 'id'>;
	  }
	| {
			type: 'updateMessageText';
			id: number;
			historyIndex?: number;
			text: string;
	  }
	| { type: 'deleteMessage'; id: number }
	| { type: 'clearMessages' }
	| { type: 'setStreaming'; streaming: boolean };

export type ChatMessageSide = 'assistant' | 'user' | 'system';

export type ChatMessage = {
	id: number;
	history: string[];
	historyIndex: number;
	side: ChatMessageSide;
};

export type OllamaState = {
	api: Ollama;
	modelName: string | null;
	messages: ChatMessage[];
	nextMessageId: number;
	streaming: boolean;
};

const initialState: OllamaState = {
	api: new Ollama({ host: 'http://127.0.0.1:11434' }),
	modelName: null,
	messages: [],
	nextMessageId: 1,
	streaming: false,
};

export const OllamaContext = createContext<{
	state: OllamaState;
	dispatch: React.ActionDispatch<[action: OllamaDispatchMessage]>;
}>({
	state: initialState,
	dispatch: () => {},
});

export function OllamaProvider({ children }: React.PropsWithChildren) {
	const [state, dispatch] = useReducer(stateReducer, initialState);

	return (
		<OllamaContext.Provider value={{ state, dispatch }}>
			{children}
		</OllamaContext.Provider>
	);
}

function stateReducer(
	state: OllamaState,
	action: OllamaDispatchMessage,
): OllamaState {
	console.log('incoming action in state reducer', state, action);
	switch (action.type) {
		case 'setModel': {
			const newState: OllamaState = { ...state };
			newState.modelName = action.modelName;
			return newState;
		}
		case 'addMessage': {
			const newState: OllamaState = { ...state };

			newState.messages = [
				...state.messages,
				{
					id: state.nextMessageId,
					history: [action.text],
					historyIndex: 0,
					side: action.role,
				},
			];

			newState.nextMessageId++;

			return newState;
		}
		case 'addMessageHistory': {
			const newState: OllamaState = { ...state };

			const messageToEdit = state.messages.find((m) => m.id === action.id);
			if (!messageToEdit) return state;
			const messageIndex = state.messages.indexOf(messageToEdit);

			newState.messages = [
				...state.messages.slice(0, messageIndex),
				{
					...messageToEdit,
					history: [...messageToEdit.history, action.text],
					historyIndex: messageToEdit.history.length,
				},
				...state.messages.slice(messageIndex + 1),
			];

			return newState;
		}
		case 'updateMessage': {
			const newState: OllamaState = { ...state };

			const message = newState.messages.find((m) => m.id === action.id);
			if (!message) return state;
			const messageIndex = newState.messages.indexOf(message);

			newState.messages = [
				...newState.messages.slice(0, messageIndex),
				{
					...message,
					...action.patch,
				},
				...newState.messages.slice(messageIndex + 1),
			];

			return newState;
		}
		case 'updateMessageText': {
			const newState: OllamaState = { ...state };

			const message = newState.messages.find((m) => m.id === action.id);
			if (!message) {
				console.error('message not found!', action.id);
				if (state.streaming) {
					state.api.abort();
				}
				return state;
			}
			const messageIndex = newState.messages.indexOf(message);

			const historyIndex = action.historyIndex ?? message.historyIndex;
			newState.messages = [
				...newState.messages.slice(0, messageIndex),
				{
					...message,
					history: [
						...message.history.slice(0, historyIndex),
						action.text,
						...message.history.slice(historyIndex + 1),
					],
				},
				...newState.messages.slice(messageIndex + 1),
			];

			return newState;
		}
		case 'deleteMessage': {
			return {
				...state,
				messages: state.messages.filter((m) => m.id !== action.id),
			};
		}
		case 'clearMessages': {
			state.api.abort();
			return { ...state, messages: [] };
		}
		case 'setStreaming': {
			return { ...state, streaming: action.streaming };
		}
	}
}
