import { useContext } from 'react';
import {
	type ChatMessage as ChatMessageType,
	OllamaContext,
} from '../../state/OllamaContext';
import { SettingsContext } from '../../state/SettingsContext';
import ChatMarkdown from '../util/ChatMarkdown';
import './ChatMessage.css';
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	RefreshCcwIcon,
	Trash2Icon,
} from 'lucide-react';
import { regenerateResponse } from '../../utils/ollama';

const iconSize = '1.125rem';

export default function ChatMessage({
	message,
	...rest
}: { message: ChatMessageType }) {
	const { state, dispatch } = useContext(OllamaContext);
	const { settings } = useContext(SettingsContext);

	const messageText = message.history[message.historyIndex];

	const useMarkdown = settings.useMarkdown;

	return (
		<div
			className={`chat-message ${message.side} ${useMarkdown ? 'md' : 'no-md'}`}
			{...rest}
		>
			<div className="action-bar">
				{message.history.length > 1 && (
					<>
						<ChevronLeftIcon
							className="icon"
							size={iconSize}
							aria-disabled={message.historyIndex <= 0}
							onClick={() =>
								message.historyIndex > 0 &&
								dispatch({
									type: 'updateMessage',
									id: message.id,
									patch: { historyIndex: message.historyIndex - 1 },
								})
							}
						/>
						{message.historyIndex + 1}/{message.history.length}
						<ChevronRightIcon
							className="icon"
							size={iconSize}
							aria-disabled={message.historyIndex >= message.history.length - 1}
							onClick={() =>
								message.historyIndex < message.history.length - 1 &&
								dispatch({
									type: 'updateMessage',
									id: message.id,
									patch: { historyIndex: message.historyIndex + 1 },
								})
							}
						/>
					</>
				)}
				<div className="spacer" />
				<RefreshCcwIcon
					className="icon"
					size={iconSize}
					onClick={() => {
						regenerateResponse(state, message.id, dispatch);
					}}
				/>
				<Trash2Icon
					className="icon"
					size={iconSize}
					onClick={() => dispatch({ type: 'deleteMessage', id: message.id })}
				/>
			</div>
			<article aria-busy={!messageText && state.streaming}>
				{useMarkdown ? <ChatMarkdown>{messageText}</ChatMarkdown> : messageText}
			</article>
		</div>
	);
}
