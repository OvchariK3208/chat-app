import cn from 'classnames'
import { Field, ErrorMessage as Error } from 'formik'
import React from 'react'
import styles from './FieldForm.module.scss'

interface FieldFormProps {
	id: string
	label: string
	name: string
	placeholder?: string
	type?: string
	className?: string
}

const FieldForm: React.FC<FieldFormProps> = ({
	id,
	label,
	name,
	placeholder,
	type = 'text',
	className,
}) => {
	return (
		<div className={cn(styles.field, className)}>
			<label
				htmlFor={id}
				className={styles.field__label}
			>
				{label}
				<span className={styles['field__label-star']}>*</span>
			</label>

			<Field
				name={name}
				id={id}
				placeholder={placeholder}
				className={styles.field__input}
				type={type}
			/>

			<div className={styles.field__error}>
				<Error
					name={name}
					component='span'
					className={styles['field__error-message']}
				/>
			</div>
		</div>
	)
}

export default FieldForm
