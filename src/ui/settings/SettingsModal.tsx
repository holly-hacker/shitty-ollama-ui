import { useContext } from 'react';
import { SettingsContext } from '../../state/SettingsContext';
import { SettingsModalContext } from '../../state/SettingsModalContext';
import './SettingsModal.css';

export default function SettingsModal(props: React.PropsWithChildren) {
	const { settings, setSettings } = useContext(SettingsContext);
	const { modalIsOpen, handleClose } = useContext(SettingsModalContext);

	const handleClickOverlay = (
		event: React.MouseEvent<HTMLElement, MouseEvent>,
	) => {
		if (event.target === event.currentTarget) {
			handleClose(event);
		}
	};

	return (
		<dialog onClick={handleClickOverlay} open={modalIsOpen} {...props}>
			<article>
				<header>
					<button
						type="button"
						aria-label="Close"
						rel="prev"
						onClick={handleClose}
					/>
					<h3>Settings</h3>
				</header>
				<p>
					<label>
						<input
							type="checkbox"
							role="switch"
							aria-checked={settings.useMarkdown}
							defaultChecked={settings.useMarkdown}
							onClick={() =>
								setSettings({ useMarkdown: !settings.useMarkdown })
							}
						/>
						Render Markdown
					</label>
				</p>
				<footer>
					<button type="button" onClick={handleClose}>
						Close
					</button>
				</footer>
			</article>
		</dialog>
	);
}
