
class CRUDBL{
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new CRUDBL()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    loadView(dao){

    }

    breeder={
        insert(entity){

        },
        update(entity){

        },
        delete(entity){

        }
    }
}
module.exports = CRUDBL
