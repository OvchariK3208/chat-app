import cn from 'classnames'
import type { FC, ButtonHTMLAttributes } from 'react'
import React from 'react'

// import styles from './Button.module.scss'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	className?: string
}

const Button: FC<ButtonProps> = ({
	className,
	children,
	disabled = false,
	onClick,
	type = 'submit',
	...props
}) => {
	return (
		<button
			className={cn('button', className)}
			onClick={onClick}
			disabled={disabled}
			type={type}
			{...props}
		>
			{children}
		</button>
	)
}

export default Button
