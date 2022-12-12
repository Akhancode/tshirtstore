//base = Product.find()
//base = Product.find()

//bigQ = ? search=coder&page=2&category=shortsleeves&rating[gte]=4&price[lte]=999&price[gte]=199&limit=5

class WhereClause{
    constructor(base,bigQ){
        this.base = base ;
        this.bigQ = bigQ ;
    }
    
    search(){
        const searchWord = this.bigQ.search?{
            //IF SEARCH KEY WORD EXIST 
            name:{
                $regex:this.bigQ.search,
                $options:'i'
            }
            
        }:{}
        this.base = this.base.find({...searchWord})
        return this
    }

    //pagination 
    pager(resultperpage){
        let currentPage = 1;
        if(this.bigQ.page){
            currentPage = this.bigQ.page
        }
        let skipvalue = resultperpage*(currentPage-1)
        this.base= this.base.limit(resultperpage).skip(skipvalue)
        return this
    }
    
    filter(){
        const copyBigQ = {...this.bigQ}
        delete copyBigQ["search"];
        delete copyBigQ["limit"];
        delete copyBigQ["page"];
        //bigQ = ? category=shortsleeves&rating[gte]=4&price[lte]=999&price[gte]=199
        

        let stringOfCopyQ = JSON.stringify(copyBigQ)

        stringOfCopyQ = stringOfCopyQ.replace(/\b(gte|lte|gt|lt)\b/g,m=>`$${m}`)

        const jsonOfCopyQ = JSON.parse(stringOfCopyQ)

        this.base = this.base.find(jsonOfCopyQ)
        return this

    }
    
    
}

module.exports = WhereClause;
