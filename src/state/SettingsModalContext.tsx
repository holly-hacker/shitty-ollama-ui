import { createContext, useEffect, useState } from 'react';

export const SettingsModalContext = createContext<{
	modalIsOpen: boolean;
	handleOpen: React.MouseEventHandler<HTMLElement>;
	handleClose: React.MouseEventHandler<HTMLElement>;
}>({
	modalIsOpen: false,
	handleOpen: (_event: React.MouseEvent<HTMLElement, MouseEvent>) => {},
	handleClose: (_event: React.MouseEvent<HTMLElement, MouseEvent>) => {},
});

export const SettingsModalProvider = ({
	children,
}: React.PropsWithChildren) => {
	const htmlTag = document.querySelector('html');
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const modalAnimationDuration = 400;

	if (!htmlTag) {
		return <>Error: no html tag?</>;
	}

	// Handle open
	const handleOpen = (event: React.MouseEvent) => {
		event.preventDefault();

		setModalIsOpen(true);
		htmlTag.classList.add('modal-is-open', 'modal-is-opening');
		setTimeout(() => {
			htmlTag.classList.remove('modal-is-opening');
		}, modalAnimationDuration);
	};

	// Handle close
	const handleClose = (event: React.MouseEvent) => {
		event.preventDefault();

		htmlTag.classList.add('modal-is-closing');
		setTimeout(() => {
			setModalIsOpen(false);
			htmlTag.classList.remove('modal-is-open', 'modal-is-closing');
		}, modalAnimationDuration);
	};

	// Handle escape key
	// biome-ignore lint/correctness/useExhaustiveDependencies: handleClose can't be passed in
	useEffect(() => {
		const handleEscape = (event: KeyboardEvent) => {
			if (!modalIsOpen) return;
			if (event.key === 'Escape') {
				// HACK: converted from js
				handleClose(event as unknown as React.MouseEvent);
			}
		};
		window.addEventListener('keydown', handleEscape);
		return () => {
			window.removeEventListener('keydown', handleEscape);
		};
	}, [modalIsOpen]);

	return (
		<SettingsModalContext.Provider
			value={{
				modalIsOpen,
				handleOpen,
				handleClose,
			}}
		>
			{children}
		</SettingsModalContext.Provider>
	);
};
