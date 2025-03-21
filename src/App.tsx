import { OllamaProvider } from './state/OllamaContext';
import Header from './ui/Header';
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
