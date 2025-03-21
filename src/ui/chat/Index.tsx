import ChatHistory from './ChatHistory';
import ChatInput from './ChatInput';
import './Index.css';

export function Chat() {
	return (
		<main className="container">
			<div className="chat-history">
				<ChatHistory />
			</div>
			<div className="chat-input">
				<ChatInput />
			</div>
		</main>
	);
}
