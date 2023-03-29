export default class Author {
    displayName = '';
    id = '';

    constructor(id = '', displayName = '') {
        this.id = id;
        this.displayName = displayName;
    }

    toString() {
        return this.displayName || 'N/A';
    }
}