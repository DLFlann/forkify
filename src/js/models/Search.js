import axios from 'axios';

import { url } from '../config';

export default class Search {

    constructor(query) {
        this.query = query;
    }

    async getResults() {

        try {
            const res = await axios(`${url}/api/search?q=${this.query}`);
            this.result = res.data.recipes;
            // console.log(this.result);
        } catch (error) {
            console.log(error);
        }
    }
}
