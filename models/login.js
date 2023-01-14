const mongoose = require('mongoose');

const loginSchema = new mongoose.Schema(
    {
        // user id
        user_id: {
            type: String,
            required: true,
        },
        // nama
        name: {
            type: String,
            required: true,
        },
        // login time
        login_time: {
            type: Date,
            default: Date.now,
        },
        // logout time
        logout_time: {
            type: Date,
            default: null,
        },
    },
    {
        collection: 'waktu-login'
    }
)

const Login = mongoose.model('Login', loginSchema);

module.exports = Login;