require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const emailSchema = require('../models/email');
const app = express();
const jwt = require('jsonwebtoken');


app.use(express.json())

exports.createEmail = async (req, res, next) => {
    try {
        const { sender, recipient, subject, date, description } = req.body;

        const newEmail = new emailSchema({
            sender,
            recipient,
            subject,
            date,
            description,
        });

        await newEmail.save();
        res.status(201).json({ message: "Email created successfully", newEmail });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getEmail = async (req, res, next) => {
    try {
        const { email } = req.body; 


        if (!email) {
            return res.status(400).json({ message: "Email parameter is required" });
        }

   
        const emails = await emailSchema.find({ sender: email }); 

        if (emails.length === 0) {
            return res.status(404).json({ message: "Email not found" });
        }

        res.status(200).json(emails);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.editEmail = async (req, res, next) => {
    try {
        const { id, sender, recipient, subject, date, description } = req.body;

        if (!id) {
            return res.status(400).json({ message: "ID parameter is required" });
        }

        const updatedEmail = await emailSchema.findByIdAndUpdate(
            id,
            { sender, recipient, subject, date, description },
            { new: true, runValidators: true } 
        );

        if (!updatedEmail) {
            return res.status(404).json({ message: "Email not found" });
        }

        res.status(200).json({ message: "Email updated successfully", updatedEmail });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.deleteEmail = async (req, res, next) => {
    try {
        const { id } = req.params; 

        if (!id) {
            return res.status(400).json({ message: "ID parameter is required" });
        }

        const deletedEmail = await emailSchema.findByIdAndDelete(id);

        if (!deletedEmail) {
            return res.status(404).json({ message: "Email not found" });
        }

        res.status(200).json({ message: "Email deleted successfully", deletedEmail });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

