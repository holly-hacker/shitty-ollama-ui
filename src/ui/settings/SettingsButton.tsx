import { useContext } from 'react';
import { SettingsModalContext } from '../../state/SettingsModalContext';

export default function SettingsButton() {
	const { handleOpen } = useContext(SettingsModalContext);

	return (
		<button type="button" onClick={handleOpen}>
			Settings
		</button>
	);
}
