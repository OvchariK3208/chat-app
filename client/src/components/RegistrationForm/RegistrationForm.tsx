import cn from 'classnames'
import { Formik, Form } from 'formik'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'
import * as Yup from 'yup'
import useAuth from '@/hooks/useAuth'
import Button from '@/shared/ui/Button'
import FieldForm from '@/shared/ui/FieldForm'
import styles from './RegistrationForm.module.scss'

const initialValues = {
	nickname: '',
	email: '',
	password: '',
	confirmPassword: '',
}

const schemas = {
	registration: Yup.object().shape({
		nickname: Yup.string()
			.matches(
				/^[A-Za-z]+(?: [A-Za-z]+)*$/,
				'Only letters and spaces are allowed'
			)
			.min(3, 'Must be at least 3 characters')
			.max(16, 'Must be 16 characters or less')
			.required('Required'),
		email: Yup.string().email('Invalid email').required('Required'),
		password: Yup.string()
			.min(6, 'Password should be at least 6 characters')
			.required('Required'),
		confirmPassword: Yup.string()
			.oneOf([Yup.ref('password')], 'Passwords must match')
			.required('Required'),
	}),
}

const RegistrationForm: React.FC<{ className?: string }> = ({ className }) => {
	const { isAuth, registration, checkAuth, authError, errors } = useAuth()
	const navigate = useNavigate()

	useEffect(() => {
		const token = localStorage.getItem('token')
		if (token) {
			checkAuth()
		}
		if (isAuth) {
			navigate('/chat', { replace: true })
		}
	}, [isAuth])

	return (
		<Formik
			initialValues={initialValues}
			validationSchema={schemas.registration}
			onSubmit={async ({ nickname, email, password }) => {
				try {
					await registration(nickname, email, password)
				} catch (err) {
					console.error('Registration error', err)
				}
			}}
		>
			{({ isValid, dirty, isSubmitting }) => (
				<Form className={cn(styles.form, className)}>
					<div className={styles.form__fields}>
						<FieldForm
							label='Nickname'
							name='nickname'
							id='nickname'
							placeholder='Enter your nickname'
							type='text'
						/>
						<FieldForm
							label='Email'
							name='email'
							id='email'
							placeholder='Enter your email'
							type='email'
						/>
						<FieldForm
							label='Password'
							name='password'
							id='password'
							placeholder='Enter your password'
							type='password'
						/>
						<FieldForm
							label='Confirm Password'
							name='confirmPassword'
							id='confirmPassword'
							placeholder='Repeat password'
							type='password'
						/>
						<div className={styles.form__error}>
							{authError && (
								<span className={styles['form__error-message']}>
									{authError}
								</span>
							)}
							{errors.message && (
								<span className={styles['form__error-message']}>
									{errors.message}
								</span>
							)}
						</div>
					</div>

					<Button
						type='submit'
						disabled={isSubmitting || !(isValid && dirty)}
					>
						Register
					</Button>
				</Form>
			)}
		</Formik>
	)
}

export default RegistrationForm
