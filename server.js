const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// create a new Express app
const app = express();

// enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// connect to the MongoDB database
mongoose.connect('mongodb+srv://devesh_08:FuEFK2oRtm9ZqSDB@cluster0.a6ybzdy.mongodb.net/mobilicis-assesment', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// define a schema for your data
const mySchema = new mongoose.Schema({
    id: Number,
    first_name: String,
    last_name: String,
    email: String,
    gender: String,
    income: String,
    city: String,
    car: String,
    quote: String,
    phone_price: String
});

// create a model for your data
const MyModel = mongoose.model('PersonDetails', mySchema);

// define a route for getting all data
app.get('/api/data', async (req, res) => {
  try {
    // get all data from the database
    const data = await MyModel.find();
    // send the data back as a JSON response
    res.json(data);
  } catch (err) {
    // handle errors
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// define a route for getting users with income lower than $5 USD and have a car of brand "BMW" or "Mercedes"
app.get('/api/users', async (req, res) => {
    // get users from the personDetails model in MongoDB
      const users = await MyModel.find({});
    
      const filteredUsers = users.filter(
        (user) =>
          user.car === 'BMW' ||
          user.car === 'Mercedes' ||
          parseFloat(user.income.replace('$', '')) < 5
      );
    
      res.json(filteredUsers);

  });
  
  //Male Users which have phone price greater than 10,000.
  app.get('/api/male-users', async (req, res) => {
    try {
      const users = await MyModel.find({ gender: 'Male', phone_price: { $gt: 10000 } });
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });


app.get('/api/car-digit', async (req, res) => {
    try {
        const users = await MyModel.find({
          $and: [
            { car: { $in: ['BMW', 'Mercedes', 'Audi'] } },
            { email: { $not: { $regex: /\d/ } } },
          ],
        });
        res.json(users);
      } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
      }
  });
  
  

// start the server
const port = process.env.PORT || 5999;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
