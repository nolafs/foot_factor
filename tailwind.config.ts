import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
    darkMode: ["class"],
    content: ["./src/**/*.tsx"],
	safelist: [
		'bg-white',
		'max-w-[60px]',
		'max-w-[100px]',
		'max-w-auto',
		{
			pattern: /grid-cols-\d+/,
			variants: ['sm', 'md', 'lg', 'xl', '2xl'],
		},
		{
			pattern: /col-span-\d+/,
			variants: ['sm', 'md', 'lg', 'xl', '2xl'],
		},
	],
  theme: {
  	extend: {
			maxWidth: {
				'8xl': '90rem', // 1440px
				'9xl': '96rem', // 1536px
				'10xl': '120rem', // 1920px
			},
  		fontFamily: {
  			sans: [
  				'var(--font-poppins)',
                    ...fontFamily.sans
                ],
				heading: ['var(--font-exo-2)', ...fontFamily.sans],
				accent: ['var(--font-pt-serif)', ...fontFamily.serif],
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)',
				'4xl': '2rem',
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))',
				'50': '#f4f7fb',
				'100': '#e9eff5',
				'200': '#cdddea',
				'300': '#a2c1d7',
				'400': '#6fa1c1',
				'500': '#4d85aa',
				'600': '#3b6b8e',
				'700': '#305674',
				'800': '#2b4961',
				'900': '#283f52',
				'950': '#1b2936',
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))',
					'50': '#f9f8ed',
					'100': '#f0ecd1',
					'200': '#e2d9a6',
					'300': '#d2bf72',
					'400': '#c3a74c',
					'500': '#b4933e',
					'600': '#9b7533',
					'700': '#7c582c',
					'800': '#69492a',
					'900': '#5a3e29',
					'950': '#342114',
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  	}
  },
	corePlugins: {
		aspectRatio: false,
	},
  plugins: [require('@tailwindcss/aspect-ratio'), require('@tailwindcss/typography'), require('@tailwindcss/forms'), require("tailwindcss-animate"), require("@designbycode/tailwindcss-text-shadow")],
} satisfies Config;
