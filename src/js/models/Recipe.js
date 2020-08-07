import axios from 'axios';

import { url } from '../config';

export default class Recipe {

    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`${url}/api/get?rId=${this.id}`);

            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;

        } catch (error) {
            console.log(error);
        }
    }

    calcTime() {
        // Assumig that we need 15 min for each 3 ingredients
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients () {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];

        const newIngredients = this.ingredients.map(el => {
            let ingredient = el.toLowerCase();

            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => unitsShort.includes(el2));

            let objIng = {};

            if (unitIndex > -1) {
                const arrCount = arrIng.slice(0, unitIndex);

                let count;
                if (arrCount === 1) {
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                objIng.count = count;
                objIng.unit = arrIng[unitIndex];
                objIng.ingredient = arrIng.slice(unitIndex + 1).join(' ');

            } else if (parseInt(arrIng[0], 10)) {
                objIng.count = parseInt(arrIng[0], 10);
                objIng.unit = '';
                objIng.ingredient = arrIng.slice(1).join(' ');

            } else {
                objIng.count = 1;
                objIng.unit = '';
                objIng.ingredient = ingredient;
            }

            return objIng;
        });

        this.ingredients = newIngredients;
    }
};