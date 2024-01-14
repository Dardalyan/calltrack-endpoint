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

    getAllFood = async ()=>{
        let foodList=[];
        try {
            let snapshot = await references.food.where('amount','==',100).get();
            snapshot.forEach(doc=> {
                foodList.push(doc.data());
            });

            for(let i =0;i<foodList.length;i++){
                let catName;
                let category = await references.category.where('id','==',foodList.at(i)['cat_id']).get();
                category.forEach(dc=>{
                    catName = dc.data()['name'];
                });
                foodList.at(i).cat_name = catName;
            }

            console.log(foodList);
            return foodList;
        }catch (e){
            console.log(null);
        }
    }
}

module.exports = Food;