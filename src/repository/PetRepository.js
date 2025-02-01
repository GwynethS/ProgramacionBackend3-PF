import GenericRepository from "./GenericRepository.js";

export default class PetRepository extends GenericRepository {
    constructor(dao) {
        super(dao);
    }

    insertMany = (pets) => {
        return this.dao.insertMany(pets);
    };
}