import { createContext, useReducer } from 'react';

export type SettingsState = {
	useMarkdown: boolean;
};

const initialState: SettingsState = {
	useMarkdown: true,
};

export const SettingsContext = createContext<{
	settings: SettingsState;
	setSettings: React.ActionDispatch<[action: Partial<SettingsState>]>;
}>({ settings: initialState, setSettings: () => {} });

export function SettingsProvider({ children }: React.PropsWithChildren) {
	const [settings, setSettings] = useReducer(stateReducer, initialState);

	return (
		<SettingsContext.Provider value={{ settings, setSettings }}>
			{children}
		</SettingsContext.Provider>
	);
}

function stateReducer(
	state: SettingsState,
	action: Partial<SettingsState>,
): SettingsState {
	console.log('incoming settings change', state, action);

	return { ...state, ...action };
}
