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
            categories: categories
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
