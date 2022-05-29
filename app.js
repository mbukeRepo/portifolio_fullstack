const path = require('path');

const express = require('express');
const mongoConnect = require ('./util/database').mongoConnect;
const bodyParser = require('body-parser');

const User = require('./models/user');
const errorController = require('./controllers/error');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');




app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('605e1256cd5a74a212578e2a')
    .then(user => {
      req.user = new User(user.name,user.email,user._id,user.cart) ;
      next();
    })
    .catch(err => console.log(err));
});


app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);
mongoConnect(() => {
  app.listen(3000);
});


