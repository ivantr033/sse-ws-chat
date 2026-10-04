import Entity from './Entity';
import createRequest from './createRequest';

/**
 * Класс для управления сущностями чата.
 * */
export default class ChatAPI extends Entity {
    constructor() {
        super();
        this.baseUrl = 'http://localhost:3000';
    }

    /**
     * Переопределение метода create для регистрации псевдонима на сервере
     */
    create(data, callback) {
        createRequest({
            url: `${this.baseUrl}/new-user`,
            method: 'POST',
            data, // Send { name: username }
            callback,
        });
    }

    list() { }
    get() { }
    update() { }
    delete() { }
}
