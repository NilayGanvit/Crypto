

const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");
const _ = require("lodash");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


mongoose.connect("mongodb+srv://saurabh:saurabh@cluster0.mv6d1.mongodb.net/todolistDB");


const itemSchema = {
  name: String
};

const Item = mongoose.model("Item", itemSchema);








app.get("/", function(req, res) {

  Item.find({}, function(err, result) {

    if (err) {
      console.log(err);
    } else {
      res.render("list", {
        listTitle: "Crypto You Think To Invest",
        newListItems: result
      });

    }
  });




});


const ListSchema = {
  name: String,
  items: [itemSchema]
}

const List = mongoose.model("List", ListSchema);


app.get("/:link1", function(req, res) {
  const customListName = _.capitalize(req.params.link1);

  List.findOne({
    name: customListName
  }, function(err, result) {
    if (err) {

    } else {
      if (!result) {
        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + customListName);

      } else {
        res.render("list", {
          listTitle: customListName,
          newListItems: result.items
        });
      }
    }
  })


})


app.post("/delete", function(req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;
  if(listName == "Today"){
    Item.findByIdAndRemove(checkedItemId, function(err) {
      if(!err){

      }
      res.redirect("/");


    });

  }
  else{
    List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}},function(err,foundList){
      if(!err){
        res.redirect("/"+ listName);
      }
    })
  }



})

app.post("/", function(req, res) {

  const titleOfList = req.body.list;
  const value = req.body.newItem;
  if (titleOfList == "Today") {
    const newItem = new Item({
      name: value
    });
    newItem.save();
    res.redirect("/");

  } else {

    List.findOne({
      name: titleOfList
    }, function(err, result) {
      if (!err) {
        const value2=new Item({
          name:value
        })

        result.items.push(value2);
        result.save();
        res.redirect("/" + titleOfList);

      }
      else{
        consol.log(err);
      }
    })

  }

});



app.listen(process.env.PORT||3000, function() {
  console.log("Server started on Successfully");
});
