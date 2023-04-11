/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import {createVuetify} from 'vuetify'
import {md3} from 'vuetify/blueprints'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
    blueprint: md3,
    theme: {
        defaultTheme: 'light',
        themes: {
            light: {
                colors: {
                    primary: '#3a416f',
                    secondary: '#141727',
                    accent: "#607d8b",
                    error: "#f44336",
                    warning: "#ffc107",
                    info: "#00bcd4",
                    success: "#4caf50",
                    white: "#fff"
                },
            },
        },
    },
    defaults: {
        VTextField: {
            variant: 'solo',
            density: 'compact',
            hideDetails: 'auto',
            bgColor: 'white',
        },
        VSelect: {
            variant: 'solo',
            density: 'compact',
            hideDetails: 'auto',
        },
        VAutocomplete: {
            variant: 'solo',
            density: 'compact',
            hideDetails: 'auto',
        },
    }
})
