const BaseBL = require("./BaseBL");
const Owner = require("../model/Owner");
const Address = require("../model/Address");
const OwnerDAO = require("../dao/OwnerDAO");
const Breeder = require("../model/Breeder");
const Breed = require("../model/Breed");
const BreederDAO = require("../dao/BreederDAO");
const Vet = require("../model/Vet");
const VetDAO = require("../dao/VetDAO");

class SeedBL extends BaseBL {
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new SeedBL()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    constructor(){
        super()
    }

    async _initOwners(){
        let addressA, addressB, addressC;
        let ownerA, ownerB, ownerC;

        addressA = new Address();
        addressA.address1 = "124 Charles Ave"
        addressA.country = "RU"
        addressA.changwat = "Moscow"
        addressA.amphoe = ""
        addressA.tambon = ""
        addressA.postcode = "1234"

        addressB = new Address();
        addressB.address1 = "34 Russia Ave"
        addressB.country = "RU"
        addressB.changwat = "Moscow"
        addressB.amphoe = ""
        addressB.tambon = ""
        addressB.postcode = "1234"

        addressC = new Address();
        addressC.address1 = "192 Infinite Ave"
        addressC.country = "TH"
        addressC.changwat = "กาฬสินธุ์"
        addressC.amphoe = "กุฉินารายณ์"
        addressC.tambon = "กุดหว้า"
        addressC.postcode = "46110"

        ownerA = new Owner()
        ownerA.username = "komarov"
        ownerA.password = "komarov"
        ownerA.website = ""
        ownerA.subscribe = true
        ownerA.name1 = "Vladimir"
        ownerA.name2 = "Komarov"
        ownerA.phone = "123456753"
        ownerA.email = "komarov@gov.ru"
        ownerA.address = addressA

        ownerB = new Owner()
        ownerB.username = "feoktistov"
        ownerB.password = "feoktistov"
        ownerB.website = ""
        ownerB.subscribe = false
        ownerB.name1 = "Konstantin"
        ownerB.name2 = "Feoktistov"
        ownerB.phone = "123456789"
        ownerB.email = "feoktistov@gmail.com"
        ownerB.address = addressB

        ownerC = new Owner()
        ownerC.username = "somchai"
        ownerC.password = "somchai"
        ownerC.website = "https://somchai.th/"
        ownerC.subscribe = true
        ownerC.name1 = "Somchai"
        ownerC.name2 = "Saetang"
        ownerC.phone = "+66-2-9780987"
        ownerC.email = "somchai@gmail.com"
        ownerC.address = addressC

        let od = OwnerDAO.getInstance()
        await od.add(ownerA)
        await od.add(ownerB)
        await od.add(ownerC)

    }

    async _initBreeders(){
        let breedA, breedB, breedC, breedD, breedE
        let addressA, addressB, addressC, addressD
        let breederA, breederB, breederC, breederD

        breedA = new Breed()
        breedA.type = "Dog"
        breedA.name = "Chihuahua"

        breedB = new Breed()
        breedB.type = "Dog"
        breedB.name = "German shepherd"

        breedC = new Breed();
        breedC.type = "Cag";
        breedC.name = "Ringtail";

        breedD = new Breed();
        breedD.type = "Dog";
        breedD.name = "Ridgeback";

        breedE = new Breed()
        breedE.type = "Dog"
        breedE.name = "Bangkaew"

        addressA = new Address()
        addressA.address1 = "11 Somchai AVE"
        addressA.country = "TH"
        addressA.changwat = "Nakhon-Phathom"
        addressA.postcode = "1234"

        addressB = new Address()
        addressB.address1 = "54 Thailand Rd"
        addressB.country = "TH"
        addressB.changwat = "Nakhon-Phathom"
        addressB.postcode = "1234"

        addressC = new Address()
        addressC.address1 = "01 Grand Avenue"
        addressC.country = "TH"
        addressC.changwat = "Ayutthaya"
        addressC.postcode = "1234"

        addressD = new Address()
        addressC.address1 = "2 This road"
        addressD.country = "TH"
        addressD.changwat = "Bangkok"
        addressD.postcode = "19100"

        breederA = new Breeder()
        breederA.name1 = "Somchai"
        breederA.name2 = "Lee"
        breederA.phone = "+66-9-6788767"
        breederA.email = "somchai-lee@gmail.com"
        breederA.username = "somchai-lee"
        breederA.password = "somchai-lee"
        breederA.address = addressA
        breederA.breeds = [breedA]

        breederB = new Breeder()
        breederB.name1 = "Anong"
        breederB.name2 = "Saengthong"
        breederB.phone = "+66-5-6789876"
        breederB.email = "anong-saengthong@vet.th"
        breederB.username = "anong-saengthong"
        breederB.password = "anong-saengthong"
        breederB.address = addressB
        breederB.breeds = [breedB]

        breederC = new Breeder()
        breederC.name1 = "Pensri"
        breederC.name2 = "Saeli"
        breederC.phone = "+66-3-6784576"
        breederC.email = "pensri-saeli@vet.th"
        breederC.username = "pensri-saeli"
        breederC.password = "pensri-saeli"
        breederC.address = addressC

        breederD = new Breeder()
        breederD.name1 = "Ratana"
        breederD.name2 = "Xu"
        breederD.phone = "+66-8-6789867"
        breederD.email = "ratana-xu@vet.th"
        breederD.username = "ratana-xu"
        breederD.password = "ratana-xu"
        breederD.address = addressD

        let bd = BreederDAO.getInstance()
        await bd.add(breederA)
        await bd.add(breederB)
        await bd.add(breederC)
        await bd.add(breederD)
    }

    async _initVets(){
        let addressA, addressB, addressC;
        let vetA, vetB, vetC;

        addressA = new Address()
        addressA.address1 = "12 ChiangRai AVE"
        addressA.country = "TH"
        addressA.changwat = "Chiang Rai"
        addressA.postcode = "1245"

        addressB = new Address()
        addressB.address1 = "34 Chanthabury Rd"
        addressB.changwat = "Chanthabury"
        addressB.postcode = "124"

        addressC = new Address()
        addressC.address1 = "1234 Lopburi Rd"
        addressC.changwat = "Lopburi"
        addressC.postcode = "0000"

        vetA = new Vet()
        vetA.name1 = "Steve"
        vetA.name2 = "Miller"
        vetA.phone = "+66-3-6789876"
        vetA.email = "steve@miller.co.th"
        vetA.username = "steve-miller"
        vetA.password = "steve-miller"
        vetA.website = "https://miller.co.th"
        vetA.subscribe = true
        vetA.address = addressA

        vetB = new Vet()
        vetB.name1 = "John"
        vetB.name2 = "Doe"
        vetB.phone = "+66-3-6298367"
        vetB.email = "john.doe@gmail.com"
        vetB.username = "john.doe"
        vetB.password = "john.doe"
        vetB.website = ""
        vetB.subscribe = true
        vetB.address = addressB

        vetC = new Vet()
        vetC.name1 = "Sup"
        vetC.name2 = "Sukkasem"
        vetC.phone = "+66-4-6782398"
        vetC.email = "sup.sukkasem@gmail.com"
        vetC.username = "sup.sukkasem"
        vetC.password = "sup.sukkasem"
        vetC.website = "https://www.sup-sukkasem.com"
        vetC.subscribe = false
        vetC.address = addressC

        let vd = VetDAO.getInstance()
        await vd.add(vetA)
        await vd.add(vetB)
        await vd.add(vetC)
    }

    async initData(){
        await this._initOwners()
        await this._initBreeders()
        await this._initVets()
    }
}
module.exports = SeedBL
