import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
	plugins: [react()],
	server: {
		host: '0.0.0.0',
		port: 5173,
		strictPort: true,
		hmr: {
			protocol: 'ws',
			host: '192.168.31.140',
			port: 5173,
		},
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@assets': path.resolve(__dirname, './src/assets'),
			'@components': path.resolve(__dirname, './src/components'),
			'@shared': path.resolve(__dirname, './src/shared'),
			'@styles': path.resolve(__dirname, './src/styles'),
		},
	},
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: `
					@use "@styles/mixins" as *;
					@use "@styles/variables" as *;
				`,
			},
		},
	},
})