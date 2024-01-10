const references = require("../db");


class Food{

    getFoodByName = async (name)=>{
        let foodData = null;
        let categoryName = null;
        try{
            let snapshot = await references.food.where('name','==',name).get();
            snapshot.forEach(doc=>{
               foodData = doc.data();
            });
            snapshot = await  references.category.where('id','==',foodData.cat_id).get();
            snapshot.forEach(doc=>{
                categoryName = doc.data().name;
            });
            foodData.cat_name = categoryName;
            return foodData;
        }catch (e){
            console.log(e);
            return null;
        }
    }
}