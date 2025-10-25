import React from 'react'
import avatar from '@/assets/avatar3.webp'
import styles from './Avatar.module.scss'

interface AvatarProps {
	url?: string
	alt?: string
}

const Avatar: React.FC<AvatarProps> = ({ url = avatar, alt }) => {
	return (
		<img
			src={url || avatar}
			alt={alt || 'User avatar'}
			className={styles.avatar}
			loading='lazy'
		/>
	)
}

export default Avatar
