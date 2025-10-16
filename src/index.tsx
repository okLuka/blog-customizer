import { createRoot } from 'react-dom/client';
import { StrictMode, CSSProperties, useMemo, useState } from 'react';
import clsx from 'clsx';

import { Article } from './components/article/Article';
import { ArticleParamsForm } from './components/article-params-form/ArticleParamsForm';
import { ArticleStateType, defaultArticleState } from './constants/articleProps';

import './styles/index.scss';
import styles from './styles/index.module.scss';

const domNode = document.getElementById('root') as HTMLDivElement;
const root = createRoot(domNode);

const App = () => {

	const[articleState, setArticleState] = useState<ArticleStateType>(defaultArticleState);
	const [isFormOpen, setIsFormOpen] = useState<boolean>(true);
	const lockFormOpen = false;

	const cssVars = useMemo(
		() =>
		({
			'--font-family': articleState.fontFamilyOption.value,
			'--font-size': articleState.fontSizeOption.value,
			'--font-color': articleState.fontColor.value,
			'--container-width': articleState.contentWidth.value,
			'--bg-color': articleState.backgroundColor.value,
		} as CSSProperties),
		[articleState]
	);

	return (
		<main className={clsx(styles.main)} style={cssVars}>
		<ArticleParamsForm
			isOpen={isFormOpen}
			onToggle={() => setIsFormOpen((v) => !v)}
			lockOpen={lockFormOpen}
			value={articleState}
			onApply={setArticleState}
			onReset={() => setArticleState(defaultArticleState)}
		/>
		<Article />
		</main>
	);
	};

root.render(
	<StrictMode>
		<App />
	</StrictMode>
);
