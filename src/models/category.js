export default class Category {
    id = null;
    icon = '';
    name = '';

    constructor(id = null, name = '', icon = '') {
        this.id = id;
        this.name = name;
        this.icon = icon;
    }

    toString() {
        return this.name;
    }
}