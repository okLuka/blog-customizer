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

type Props = {
	isOpen: boolean;
	onToggle: () => void;
	lockOpen?: boolean;
	value: ArticleStateType;
	onApply: (next: ArticleStateType) => void;
	onReset: () => void;
}

export const ArticleParamsForm = ({ isOpen, onToggle, lockOpen = false, value, onApply, onReset }: Props) => {
	const [draft, setDraft] = useState<ArticleStateType>(value);
  	useEffect(() => setDraft(value), [value]);

	const asideRef = useRef<HTMLElement | null>(null);
  	const arrowRef = useRef<HTMLDivElement | null>(null);

	const effectiveOpen = lockOpen ? true : isOpen;

	const handleArrowClick = () => {
		if (!lockOpen) onToggle();
	}

	const handlePointerDown = useCallback ((e: PointerEvent) => {
		const target = e.target as Node | null;
		if (asideRef.current && target && asideRef.current.contains(target)) return;
	    if (arrowRef.current && target && arrowRef.current.contains(target)) return;
	    onToggle();
	}, [effectiveOpen, onToggle]);

	useEffect(() => {
		if (!effectiveOpen || lockOpen) return;
		document.addEventListener('pointerdown', handlePointerDown, true);
		return () => {
			document.removeEventListener('pointerdown', handlePointerDown, true);
		};
  	}, [effectiveOpen, lockOpen, handlePointerDown]);

	const setBy = (k: keyof ArticleStateType) => (opt: OptionType) =>
    setDraft(d => ({ ...d, [k]: opt }) as ArticleStateType);

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		onApply(draft);
	};

	const handleReset = (e: FormEvent) => {
		e.preventDefault();
		setDraft(defaultArticleState);
		onReset();
	};

	return (
		<>
			<div ref={arrowRef}>
				<ArrowButton isOpen={effectiveOpen} onClick={handleArrowClick} />
			</div>
			<aside ref={asideRef as any}
			className={clsx(styles.container, { [styles.container_open]: effectiveOpen })}
			aria-hidden={!effectiveOpen}>
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
