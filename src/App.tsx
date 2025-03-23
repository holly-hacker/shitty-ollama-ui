import { OllamaProvider } from './state/OllamaContext';
import { SettingsProvider } from './state/SettingsContext';
import { SettingsModalProvider } from './state/SettingsModalContext';
import Header from './ui/Header';
import { Chat } from './ui/chat/Index';
import SettingsModal from './ui/settings/SettingsModal';

function App() {
	return (
		<OllamaProvider>
			<SettingsProvider>
				<SettingsModalProvider>
					<Header />
					<Chat />
					<SettingsModal />
				</SettingsModalProvider>
			</SettingsProvider>
		</OllamaProvider>
	);
}

export default App;
