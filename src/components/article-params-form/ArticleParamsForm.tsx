import { ArrowButton } from 'src/ui/arrow-button';
import { RadioGroup } from 'src/ui/radio-group/RadioGroup';
import { Select } from 'src/ui/select/Select';
import { useCallback, useEffect, useRef, useState, type FormEvent, } from 'react';
import { Button } from 'src/ui/button';
import { Separator } from 'src/ui/separator';
import clsx from 'clsx';

import {
  defaultArticleState,
  type ArticleStateType,
  type OptionType,
  fontFamilyOptions,
  fontSizeOptions,
  fontColors,
  backgroundColors,
  contentWidthArr,
} from 'src/constants/articleProps';

import styles from './ArticleParamsForm.module.scss';

export const ArticleParamsForm = () => {
	const [isOpen, setIsOpen] = useState<boolean>(true);
	const [draft, setDraft] = useState<ArticleStateType>(defaultArticleState);


	const asideRef = useRef<HTMLElement | null>(null);
  	const arrowRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		applyCssVars(defaultArticleState);
	}, []);

	const handleArrowClick = () => setIsOpen(v => !v);

	const handlePointerDown = useCallback((e: PointerEvent) => {
		if (!isOpen) return;
		const t = e.target as Node | null;
		if (asideRef.current?.contains(t!)) return;
		if (arrowRef.current?.contains(t!)) return;
		setIsOpen(false);
	}, [isOpen]);

	useEffect(() => {
		if (!isOpen) return;
		document.addEventListener('pointerdown', handlePointerDown, true);
		return () => document.removeEventListener('pointerdown', handlePointerDown, true);
	}, [isOpen, handlePointerDown])

	const setBy = (k: keyof ArticleStateType) => (opt: OptionType) =>
    setDraft(d => ({ ...d, [k]: opt }) as ArticleStateType);

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		applyCssVars(draft)
		setIsOpen(false);
	};

	const handleReset = (e: FormEvent) => {
		e.preventDefault();
		setDraft(defaultArticleState);
		applyCssVars(defaultArticleState);
	};

	return (
		<>
			<div ref={arrowRef}>
				<ArrowButton isOpen={isOpen} onClick={handleArrowClick} />
			</div>
			<aside ref={asideRef as any}
			className={clsx(styles.container, { [styles.container_open]: isOpen })}
			aria-hidden={!isOpen}>
				<form className={styles.form} onSubmit={handleSubmit} onReset={handleReset}>
				<h2 className={styles.title}>ЗАДАЙТЕ ПАРАМЕТРЫ</h2>

				{/* ШРИФТ — кастомный Select */}
				<div className={styles.section}>
					<Select
					title="ШРИФТ"
					selected={draft.fontFamilyOption}
					options={fontFamilyOptions}
					onChange={setBy('fontFamilyOption')}
					// onClose опционален; Select сам закрывается по клику вне :contentReference[oaicite:3]{index=3}
					/>
				</div>

				{/* РАЗМЕР ШРИФТА — RadioGroup */}
				<div className={styles.section}>
					<RadioGroup
					name="font-size"
					title="РАЗМЕР ШРИФТА"
					options={fontSizeOptions}
					selected={draft.fontSizeOption}
					onChange={setBy('fontSizeOption')}
					/>
				</div>

				{/* ЦВЕТ ШРИФТА — кастомный Select */}
				<div className={styles.section}>
					<Select
					title="ЦВЕТ ШРИФТА"
					selected={draft.fontColor}
					options={fontColors}
					onChange={setBy('fontColor')}
					/>
				</div>

				<div className={styles.section} >
					<Separator/>
				</div>


				{/* ЦВЕТ ФОНА — кастомный Select */}
				<div className={styles.section}>
					<Select
					title="ЦВЕТ ФОНА"
					selected={draft.backgroundColor}
					options={backgroundColors}
					onChange={setBy('backgroundColor')}
					/>
				</div>

				{/* ШИРИНА КОНТЕНТА — кастомный Select */}
				<div className={styles.section}>
					<Select
					title="ШИРИНА КОНТЕНТА"
					selected={draft.contentWidth}
					options={contentWidthArr}
					onChange={setBy('contentWidth')}
					/>
				</div>

				<div className={styles.bottomContainer}>
					<Button title="СБРОСИТЬ" htmlType="reset" type="clear" />
					<Button title="ПРИМЕНИТЬ" htmlType="submit" type="apply" />
				</div>
				</form>
			</aside>
		</>
	);
};

function applyCssVars(s: ArticleStateType) {
  const root = document.documentElement; // или конкретный контейнер, если нужно
  root.style.setProperty('--font-family', s.fontFamilyOption.value);
  root.style.setProperty('--font-size',   s.fontSizeOption.value);
  root.style.setProperty('--font-color',  s.fontColor.value);
  root.style.setProperty('--container-width', s.contentWidth.value);
  root.style.setProperty('--bg-color',    s.backgroundColor.value);
}
