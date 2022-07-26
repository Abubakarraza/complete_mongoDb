const mongoose = require("mongoose");
const validator = require("validator");
mongoose.connect("mongodb://localhost:27017/test").
    then(() => console.log("connection is successfull with db"))
    .catch((err) => console.log(err));
// STRUCTURE OF DOCUMENT
const validation = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
        // default error
        minlength: [4, 'type minimum 4 length'],
        maxlength: 30,
        trim: true

    },
    rollNo: {
        type: Number,
        required: true,
        unique: true,
        // min:5,
        // max:1000,
        // CUSTOM VALIDATION
        validate(value) {
            if (value < 0)
                throw new Error("please type rollNo in positve integer")
        },
        //OR same as above validation upper is updated
        // validate:{
        //  validator:function(value){
        //     return value.length < 0
        //  },
        //  message:"please type rollNo in positive integer"
        // },

    },
    author: {
        type: String,
        required: true,
        lowercase: true,
        enum: ["raza", "ansari", "arain"]
    },
    // email validation using validator library
    email: {
        type: String,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is invalid");


            }
        }

    },
    date: {
        type: Date,
        default: Date.now
    },
    active: Boolean,

});
// CREATE NEW COLLECTION WITH Playlist
const Playlist = new mongoose.model("Playlist", validation);
// CREATRE OR INSERT DOCUMENT
const createDocument = async () => {
    try {
        const dbPlaylist = new Playlist({
            name: 'arshan',
            rollNo: 234,
            author: "raza",
            email: "afja@gmail.com",
            active: true,
        })
        // const mongoosePlaylist = new Playlist({
        //     name: 'abubakar raza',
        //     rollNo: 5543,
        //     author: "ansari",
        //     active: true,

        // })
        // const mongodbPlaylist = new Playlist({
        //     name: "umar ansari",
        //     rollNo: 543543,
        //     author: "ansari",
        //     active: true
        // })
        // const nodePlaylist = new Playlist({
        //     name: 'arshan honey',
        //     rollNo: 554543,
        //     author: "arain",
        //     active: true
        // })
        // use to inset only one document
        // const result=await nodePlaylist.save();
        // use to insert multiple document
        const result = await Playlist.insertMany([dbPlaylist])
        console.log(result);
    } catch (error) {
        console.log(error);
    }
}
createDocument();
// GET DOCUMENT
const getDocument = async () => {
    //to get full documnet
    const resultAll = await Playlist.find();
    // to apply filter
    const result = await Playlist.find({ author: 'ansari' });
    // to apply further filter if i want just name and active status of documnet 
    const result2 = await Playlist.find({ author: 'ansari' }).select({ name: 1, active: 1 })
    // if i want to apply limit to get only document set limit
    const result3 = await Playlist.find({ author: "ansari" }).select({ name: 1 }).limit(1);
    console.log(result3);
};
// getDocument();
//QUERY OPREATOR
const queryOpreator = async () => {
    try {
        // equal opreator
        const result = await Playlist.find({ author: { $eq: "raza" } });
        // greater then opreator
        const result2 = await Playlist.find({ rollNo: { $gt: 32432 } })
        // greater then equal opreator
        const result3 = await Playlist.find({ rollNo: { $gte: 32432 } })
        // less than opreator
        const result4 = await Playlist.find({ rollNo: { $lt: 32432 } })
        // less than equal opreator
        const result5 = await Playlist.find({ rollNo: { $lte: 32432 } })
        // not equal to opreator
        const result6 = await Playlist.find({ rollNo: { $ne: 32432 } })
        // match any value specified in an array
        const result7 = await Playlist.find({ rollNo: { $in: [32432, 5543] } });
        // not match any value specified in an array
        const result8 = await Playlist.find({ rollNo: { $nin: [32432, 5543] } })
        console.log(result8);
    } catch (error) {
        console.log(error);
    }
};
// queryOpreator();
// LOGICAL OPREATOR
const logicalOpreator = async () => {
    try {
        // OR Opreator
        // or opreator perfom if less than one opreation is true
        const result = await Playlist.find({ $or: [{ name: "abubakar Raza" }, { author: 'arain' }] });
        // AND Opreator
        // and opreation is perfom when all expression is true
        const result1 = await Playlist.find({ $and: [{ name: 'abubakar Raza' }, { author: "raza" }] });
        // NOR Opreator
        // nor opreator return those document whose is not match with expression
        const result2 = await Playlist.find({ $nor: [{ name: "abubakar Raza" }, { author: "raza" }] });
        // NOT Opreator
        // not opreator return those documnet which is not equal to expression
        const result3 = await Playlist.find({ name: { $not: { $eq: "abubakar Raza" } } });
        console.log(result3);

    } catch (error) {
        console.log(error);
    }
}
// logicalOpreator();
// COUNT DOCUMENT 
const countDocument = async () => {
    // to count document
    const result = await Playlist.countDocuments();
    // to count documnet after filter
    const result1 = await Playlist.find({ author: 'raza' }).countDocuments();
    console.log(result1);
};
// countDocument();
//SORT DOCUMNET
const sortDocument = async () => {
    // if i want my document in ascending order place 1 or in deascending order place -1
    //Ascending Order
    const result = await Playlist.find().sort({ name: 1 });
    const result1 = await Playlist.find().sort({ rollNo: 1 });
    // Descending Order
    const result2 = await Playlist.find().sort({ name: -1 });
    const result3 = await Playlist.find().sort({ rollNo: -1 });
    console.log(result1);
};
// sortDocument();
//UPDATE DOCUMNET
const updateDocumnet = async (_id) => {
    try {
        const result = await Playlist.update({ 'name': 'umar ansari' }, { "name": "Umar ansari" });
        const result1 = await Playlist.update({ rollNo: 334 }, { $set: { rollNo: 234 } });
        const result2 = await Playlist.updateMany({ name: "abubakar Raza" }, { $set: { name: "Abubakar Raza" } });
        // update only one document whose is first
        const result3 = await Playlist.updateOne({ rollNo: 324 }, { $set: { name: "abubakar ansari" } });
        // update many document that match with expression
        const result4 = await Playlist.updateMany({ name: "abdullah Raza" }, { $set: { author: "galib" } });
        // update with id 
        const result5 = await Playlist.updateOne({ _id }, { $set: { name: "Abdullah Raza" } });
        console.log(result5);
    } catch (error) {
        console.log(error);
    }
};
// updateDocumnet("62d137b56a73a55b29d52516");

//DELETE DOCUMNET
const deleteDocument = async (_id) => {
    try {
        // delete with id
        const result = await Playlist.deleteOne({ _id });
        // delete with name
        const result1 = await Playlist.deleteOne({ name: "arshan honey" })
        // use more than one document with deleteMany
        const result2 = await Playlist.deleteMany({ author: "raza" });
        console.log(result2);

    } catch (error) {
        console.log(error);
    }
}
// deleteDocument("62d093aee905eca4c626c3e6");
// CUSTOM VELIDATION
