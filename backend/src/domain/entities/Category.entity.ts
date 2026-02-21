

export class Category{
    constructor(

       public id:string,
       public name:string,
       public description:string,
       public isActive:boolean,
       public createdAt:Date,
       public updatedAt:Date,
    ){ }

    updateDetails(name:string,description:string){
        if(!name || name.length<3){
            throw new Error("Name is too short");
        }
        this.name=name;
        this.description=description;
        this.updatedAt=new Date();
    }
} 