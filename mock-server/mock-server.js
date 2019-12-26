const express = require('express');
var faker = require('faker');
const server = express();
const port = 9090;
var cors = require('cors');
const bodyParser = require('body-parser');
server.use(bodyParser.urlencoded({
  extended: true
}));

server.use(cors());
server.use(express.json());

var sqlite3 = require('sqlite3').verbose();


server.get('/getallusers', (req, resp) => {
  const userDetails = [];
  let db = new sqlite3.Database('./mock-server/UserDatabase', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the UserDatabase database.');
  });

  db.serialize(() => {
    db.each(`SELECT * FROM UserInformation`, (err, row) => {
      if (err) {
        console.error(err.message);
      }
      userDetails.push(row);
    });
  });

  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Close the database connection.');
    resp.send(userDetails);

  });
});

server.get('/useraddress', (req, res) => {
  const address = faker.fake("{{address.city}}, {{address.streetName}} {{address.country}} {{address.zipCode}}");
  res.send(address);

});

server.get('/userid/:id', (req, res) => {

  const name = faker.fake("{{name.lastName}}, {{name.firstName}} {{name.suffix}}");
  const email = faker.fake("{{internet.email}}");
  const userDetail = {
    id: req.params.id,
    name: name,
    email: email
  };
  res.send(userDetail);
});

server.delete('/userid/:id', (req, resp) => {
  let id = req.params.id;
  let db = new sqlite3.Database('./mock-server/UserDatabase', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the UserDatabase database.');
  });

  db.serialize(() => {
    db.run(`DELETE FROM UserInformation WHERE Id = ?`, id, (err) => {
      if (err) {
        console.error(err.message);
      }
    });
  });

  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Close the database connection.');
    resp.send({
      message: "success"
    });

  });
});

server.put('/userid/:id', (req, res) => {
  let id = req.params.id;
  console.log(req.body);
  let data = [req.body.Name, req.body.Email, req.body.Address, req.body.Id];
  let db = new sqlite3.Database('./mock-server/UserDatabase', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the UserDatabase database.');
  });

  db.serialize(() => {
    db.run(`UPDATE UserInformation SET Name = ?, Email = ?, Address = ? WHERE Id = ?`, data, (err) => {
      if (err) {
        console.error(err.message);
      }
    });
  });

  db.close((err) => {
    if (err) {
      res.send({
        message: "failure"
      });
      console.error(err.message);
    }
    console.log('Close the database connection.');
    res.send({
      message: "success"
    });
  });
});

server.post('/userid/:id', (req, res) => {
  console.log(req.body);
  let data = [faker.random.uuid(), req.body.Name, req.body.Email, req.body.Address];
  let db = new sqlite3.Database('./mock-server/UserDatabase', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the UserDatabase database.');
  });

  db.serialize(() => {
    db.run(`INSERT INTO UserInformation(Id, Name, Email, Address) VALUES(?, ?, ?, ?)`, data, (err) => {
      if (err) {
        console.error(err.message);
      }
    });
  });

  db.close((err) => {
    if (err) {
      res.send({
        message: "failure"
      });
      console.error(err.message);
    }
    console.log('Close the database connection.');
    res.send({
      message: "success"
    });

  });
});

server.get('/userid', (req, res) => {

  const name = faker.fake("{{name.lastName}}, {{name.firstName}} {{name.suffix}}");
  const email = faker.fake("{{internet.email}}");
  const userDetail = {
    id: req.query.id,
    name: name,
    email: email
  };
  res.send(userDetail);
});

server.get('/userid/:id/:age', (req, res) => {

  res.send(`user information with id ${req.params.id} and age ${req.params.age}`);
});

server.listen(port, () => {
  console.log(`Server started on port no ${port}`)
});
