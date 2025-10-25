import { Info } from 'lucide-react'
import React, { useState } from 'react'
import styles from './CustomAlert.module.scss'

interface CustomAlertProps {
	label: string
	children: React.ReactNode
}

const CustomAlert: React.FC<CustomAlertProps> = ({ label, children }) => {
	const [open, setOpen] = useState(false)

	return (
		<>
			<button
				aria-label={label}
				className={styles['icon-button']}
				onClick={() => setOpen(true)}
				type='button'
			>
				{children}
			</button>

			{open && (
				<div
					className={styles.overlay}
					onClick={() => setOpen(false)}
				>
					<div
						className={styles['alert-box']}
						onClick={(e) => e.stopPropagation()}
					>
						<Info />
						<div className={styles['alert-box__hint']}>
							<h3 className={styles['alert-box__heading']}>hint message</h3>
							<p className={styles['alert-box__label']}>
								{label} feature is not available yet.
							</p>
							<a
								href='https://example.com'
								target='_blank'
								rel='noopener noreferrer'
								className={styles['alert-box__link']}
							>
								Learn more
							</a>
						</div>
					</div>
				</div>
			)}
		</>
	)
}

export default CustomAlert
