import { heroui } from '@heroui/theme';

/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./index.html',
		'./src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}'
	],
	theme: {
		extend: {
			colors: {
				red: {
					50: '#FEE7EF',
					100: '#FDD0DF',
					200: '#FAA0BF',
					300: '#F871A0',
					400: '#F54180',
					500: '#F31260',
					600: '#C20E4D',
					700: '#920B3A',
					800: '#610726',
					900: '#310413'
				},
				blue: {
					50: '#e6f1fe',
					100: '#cce3fd',
					200: '#99c7fb',
					300: '#66aaf9',
					400: '#338ef7',
					500: '#006FEE',
					600: '#005bc4',
					700: '#004493',
					800: '#002e62',
					900: '#001731'
				}
			}
		}
	},
	darkMode: 'class',
	plugins: [heroui()]
};
