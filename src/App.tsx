import { OllamaProvider } from './state/OllamaContext';
import { SettingsProvider } from './state/SettingsContext';
import { SettingsModalProvider } from './state/SettingsModalContext';
import FullUi from './ui/Index';

function App() {
	return (
		<OllamaProvider>
			<SettingsProvider>
				<SettingsModalProvider>
					<FullUi />
				</SettingsModalProvider>
			</SettingsProvider>
		</OllamaProvider>
	);
}

export default App;
