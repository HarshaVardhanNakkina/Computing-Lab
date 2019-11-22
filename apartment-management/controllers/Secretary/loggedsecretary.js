const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {

});

router.post('/delete/:delete_owner', (req, res) => {
     res.redirect('/');
});
router.post('/update/:update_owner', (req, res) => {
     res.redirect('/');
});
