import './Index.css';
import Header from './Header';
import ChatHistory from './chat/ChatHistory';
import ChatInput from './chat/ChatInput';
import SettingsModal from './settings/SettingsModal';

export default function FullUi() {
	return (
		<div className="everything container">
			<Header />
			<main>
				<div className="chat-history-container">
					<ChatHistory />
				</div>
				<ChatInput />
			</main>
			<SettingsModal />
		</div>
	);
}
