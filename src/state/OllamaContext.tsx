import { Ollama } from 'ollama/browser';
import { createContext, useReducer } from 'react';

export type OllamaDispatchMessage =
	| { type: 'setModel'; modelName: string }
	| { type: 'addMessage'; text: string; role: ChatMessageSide }
	| { type: 'updateMessage'; id: number; text: string }
	| { type: 'setStreaming'; streaming: boolean };

export type ChatMessageSide = 'assistant' | 'user' | 'system';

export type ChatMessage = {
	id: number;
	text: string;
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
			state.modelName = action.modelName;
			return { ...state, modelName: action.modelName };
		}
		case 'addMessage': {
			const newState: OllamaState = {
				...state,
				nextMessageId: state.nextMessageId + 1,
				messages: [
					...state.messages,
					{ id: state.nextMessageId, text: action.text, side: action.role },
				],
			};

			return newState;
		}
		case 'updateMessage': {
			const newState: OllamaState = { ...state };

			newState.messages.filter((m) => m.id === action.id)[0].text = action.text;

			return newState;
		}
		case 'setStreaming': {
			return { ...state, streaming: action.streaming };
		}
	}
}
