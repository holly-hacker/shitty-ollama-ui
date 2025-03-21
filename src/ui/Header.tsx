import { useContext, useEffect, useState } from 'react';
import './Header.css';
import type { ModelResponse } from 'ollama/browser';
import { OllamaContext } from '../state/OllamaContext';

export default function Header() {
	const { state, dispatch } = useContext(OllamaContext);

	const [models, setModels] = useState<ModelResponse[]>([]);

	useEffect(() => {
		state.api.list().then((modelList) => {
			console.log('response from list models', modelList);
			setModels(modelList.models);
			dispatch({
				type: 'setModel',
				modelName: modelList.models[0]?.model ?? null,
			});
		});
	}, [state.api.list, dispatch]);

	return (
		<>
			<header className="container">
				<h1>Shitty Ollama UI</h1>
				{state.modelName ? (
					<select
						value={state.modelName}
						onChange={(e) =>
							dispatch({ type: 'setModel', modelName: e.target.value })
						}
					>
						{models.map((item) => {
							return (
								<option key={item.model} value={item.model}>
									{item.name}
								</option>
							);
						})}
					</select>
				) : (
					<select disabled={true}>
						<option value="">Loading...</option>
					</select>
				)}
			</header>
		</>
	);
}
