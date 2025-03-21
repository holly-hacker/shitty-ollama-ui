import Header from './ui/Header';
import { OllamaProvider } from './state/OllamaContext';
import { Chat } from './ui/chat/Index';

function App() {
	return (
		<OllamaProvider>
			<Header />
			<Chat />
		</OllamaProvider>
	);
}

export default App;
