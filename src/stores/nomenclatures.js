import {defineStore} from 'pinia'


export const useNomenclaturesStore = defineStore('nomenclatures', {
    state: () => {
        let categories =
            [

                {
                    id: 1,
                    name: 'Voleyball',
                    icon: 'mdi-voleyball'
                },
                {
                    id: 2,
                    name: 'Basketball',
                    icon: 'mdi-basketball'
                },
                {
                    id: 3,
                    name: 'Football',
                    icon: 'mdi-soccer'
                },
                {
                    id: 4,
                    name: 'Tennis',
                    icon: 'mdi-tenis-ball'
                },
                {
                    id: 5,
                    name: 'Billiards',
                    icon: 'mdi-billiards'
                },
                {
                    id: 6,
                    name: 'Handball',
                    icon: 'mdi-handball'
                },
            ]

        categories.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);

        return {
            categories: categories,
            durations: [
                {
                    name:'30 min',
                    value: 30,
                },
                {
                    name:'1h',
                    value: 60,
                },
                {
                    name:'1h 30min',
                    value: 90,
                },
                {
                    name:'2h',
                    value: 120,
                },
                {
                    name:'2h 30min',
                    value: 150,
                },
                {
                    name:'3h',
                    value: 180,
                },
                {
                    name:'3h 30min',
                    value: 210,
                },
                {
                    name:'4h',
                    value: 240,
                },
                {
                    name:'5h',
                    value: 300,
                },
                {
                    name:'6h',
                    value: 360,
                },
                {
                    name:'7h',
                    value: 420,
                },
                {
                    name:'8h',
                    value: 480,
                },
                {
                    name:'9h',
                    value: 540,
                },
                {
                    name:'10h',
                    value: 590,
                },
                {
                    name:'11h',
                    value: 660,
                },
                {
                    name:'12h',
                    value: 720,
                },
                {
                    name:'24h',
                    value: 1440,
                },
            ]
        };
    },
    getters: {
        // categoriesList: (state) => {
        //
        //     let categories = state.categories.map((cat) => {
        //         return {
        //             id: cat.id,
        //             name: cat.name,
        //             icon: cat.icon
        //         }
        //     })
        //
        //     categories.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
        //
        //     return categories;
        // }

    },
    actions: {}
})
