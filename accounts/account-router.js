const express = require('express');

// database access using knex
const db = require('../data/dbConfig.js');

const router = express.Router();

// ##########
//    GET
// ##########

router.get('/', async (req, res) => {
    try {
        const Accounts = await db("accounts");
        res.status(200).json(Accounts);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', async (req, res) => {
    const {id} = req.params;

    try {
        const Account = await db("accounts").where({ id: id });
        (Account.length !== 0)
            ?
                res.status(200).json(Account)
            :
                res.status(404).json({ message: "Account not found."})
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ##########
//    Account
// ##########

router.post('/', async (req, res) => {
    const {name, budget} = req.body;

    try {
        // Check if req.body is valid and contains name and budget
        (name === undefined || budget === undefined) && res.status(400).json({ message: "name and budget are missing"}).end()

        // If req.body is valid, attempt to insert into the database
        const newAccountId = await db('accounts').insert({ name: name, budget: budget })
        
        // Check if our insert call returned a valid Account id
        if (newAccountId.length) {
            // If id is valid: select * from Accounts where id=newAccountId[0]
            const addedAccount = await db("accounts").where({ id: newAccountId[0]});
            res.status(200).json(addedAccount)
        }
        else {
            // If id is not valid: something went wrong :(
            res.status(400).json({ message: "Account was not added"})
        }
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ##########
//    PUT
// ##########

router.put('/:id', async (req, res) => {
        const {name, budget} = req.body;
        const {id} = req.params;

        try {
            // Check if req.body is valid and contains name and budget
            (name === undefined || budget === undefined) && res.status(400).json({ message: "name and budget are missing"}).end()
            
            // Check if a Account exists at ID
            const existingAccount = await db('accounts').where({ id: (id) ? id : 0 }).limit(1);
            !(existingAccount.length) && res.status(400).json({ message: "Account id is not valid"}).end()

            // If Account is valid: update Accounts set name=name, budget=budget where id=id
            const isUpdated = await db('accounts').where({ id: id }).update({name: name, budget: budget });

            if (isUpdated) {
                // If updated returned a value, select the newly updated Account and return the results
                const updatedAccount = await db('accounts').where({ id: (id) ? id : 0 }).limit(1);
                res.status(200).json(updatedAccount)
            }
            else {
                // If there was an error updating
                res.status(400).json({ message: "Account could not be updated"})
            }
        }
        catch (err) {
            res.status(500).json({ message: err.message });
        }
});

// ##########
//   DELETE
// ##########

router.delete('/:id', async (req, res) => {
    const {id} = req.params;

    try {
        // Check if a Account exists at ID
        const existingAccount = await db('accounts').where({ id: (id) ? id : null }).limit(1);
        !(existingAccount.length) && res.status(400).json({ message: "Account id is not valid"})

        // If Account exists, delete it
        const result = await db('accounts').where({ id: id }).del();
        (result)
            ?
                res.status(200).json({ message: `Account ${id} has been deleted` })
            :
                res.status(200).json({ message: `Account ${id} could not be deleted` })
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;