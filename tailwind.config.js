const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
    content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            backgroundImage: {
                'grid-pattern': "linear-gradient(to bottom, theme('colors.neutral.950 / 0%'), theme('colors.neutral.950 / 100%')), url('/images/noise.png')"
            },
            colors: {
                neutral: colors.neutral,
                burgundy: '#800020',
            },
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans]
            },
            keyframes: {
                marquee: {
                    '0%': { transform: 'translateX(100%)' },
                    '100%': { transform: 'translateX(-100%)' },
                  },
                slideUp: {
                  '0%': { transform: 'translateY(100%)', opacity: '0' },
                  '100%': { transform: 'translateY(0)', opacity: '1' },
                },
              },
              animation: {
                marquee: 'marquee 25s linear infinite',
                slideUp: 'slideUp 0.5s ease-out',
              },
        }
    },
    daisyui: {
        themes: [
            {
                lofi: {
                    ...require('daisyui/src/theming/themes')['lofi'],
                    primary: '#2bdcd2',
                    'primary-content': '#171717',
                    secondary: '#016968',
                    info: '#2bdcd2',
                    'info-content': '#171717',
                }
            }
        ]
    },
    plugins: [require('daisyui')]
};
