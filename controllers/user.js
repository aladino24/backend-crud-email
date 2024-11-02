require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const userSchema = require('../models/user');
const loginSchema = require('../models/login');
const app = express();
const jwt = require('jsonwebtoken');


app.use(express.json())

exports.register = async (req, res, next) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    const dataUser = {
      name: req.body.name,
      email: req.body.email,
      password: hash
    };

    userSchema
      .create(dataUser)
      .then((result) => {
        res.json({
          status: 200,
          message: 'success'
        });
      })
      .catch((err) => {
        console.log(err);
      });
  })
}


exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  userSchema
    .findOne
    ({
      email:
        email
    })
    .then((resultData) => {
      if (resultData) {
        bcrypt.compare(password, resultData.password, (err, response) => {
          if (response) {
            // simpan waktu login
            const dataLogin = {
              user_id: resultData._id,
              name: resultData.name,
            };

            loginSchema
              .create(dataLogin)
              .then((result) => {
                console.log(result.email)
                const token = jwt.sign({
                  userId: result._id,
                  name: result.name,
                  email: resultData.email,
                }, 'secret123', {
                  expiresIn: '10d'
                });
                res.json({
                  id: result._id,
                  status: 200,
                  message: 'success',
                  email: resultData.email,
                  token: token
                })
              })
              .catch((err) => {
                console.log(err);
              });

          } else {
            res.json({
              status: 401,
              message: 'failed'
            });
          }
        })
      } else {
        res.json({
          status: 401,
          message: 'failed'
        });
      }
    })
    .catch((err) => {
      console.log(err);
    })
}

// cek token
exports.verifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    const decoded = jwt.verify(token, 'secret123');
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send('Invalid token.');
  }
};


exports.logout = async (req, res, next) => {
  // pada saat logout update logout time dimana user_id nya sama dengan yang dikirim
  loginSchema
    .updateOne(
      {
        _id: req.body._id
      },
      {
        logout_time: Date.now()
      }
    )
    .then((result) => {
      // console.log(result)
      res.json({
        status: 200,
        message: 'success'
      })
    }
    )
}

exports.getAllUser = async (req, res, next) => {
  userSchema
    .find()
    .then((result) => {
      res.json({
        status: 200,
        message: 'success',
        data: result
      })
    })
    .catch((err) => {
      console.log(err);
    })
}

exports.getUserLogin = async (req, res, next) => {
  loginSchema
    .find()
    .then((result) => {
      res.json({
        status: 200,
        message: 'success',
        data: result
      })
    })
    .catch((err) => {
      console.log(err);
    })
}

exports.deleteLogin = async (req, res, next) => {
  loginSchema
    .deleteOne(
      {
        _id: req.params.id
      }
    )
    .then((result) => {
      res.json({
        status: 200,
        message: 'success'
      })
    })
    .catch((err) => {
      console.log(err);
    })
}

// history login
exports.getHistoryLogin = async (req, res, next) => {
  try {
    const { id } = req.params;

    const historyLogin = await loginSchema.find({ user_id: id }).sort({ login_time: -1 }); // Sort by login_time descending

    if (historyLogin.length === 0) {
      return res.status(404).json({ message: "No login history found for this user." });
    }

    res.status(200).json(historyLogin);
  } catch (error) {
    console.error("Error fetching login history:", error);
    res.status(500).json({ message: error.message });
  }
}