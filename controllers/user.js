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
    .then((result) => {
      if (result) {
        bcrypt.compare(password, result.password, (err, response) => {
          if (response) {
            // simpan waktu login
            const dataLogin = {
              user_id: result._id,
              name: result.name,
            };

              loginSchema
                .create(dataLogin)
                .then((result) => {
                  const token = jwt.sign({
                    userId: result._id,
                    name: result.name,
                    email: result.email,
                  }, 'secret123', {
                    expiresIn: '10d'
                  });
                  res.json({
                    id: result._id,
                    status: 200,
                    message: 'success',
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

exports.logout = async(req,res,next) => {
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

exports.getUserLogin = async(req,res,next) => {
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

exports.deleteLogin = async(req,res,next) => {
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