const express = require('express');
const { sendEmails } = require('./../controllers/SuscriptionController');
const router = express.Router();

router.post('/sendEmails', sendEmails);
router.post('/newSuscriber', () =>{
    //Conectarse con aws 

    //incluir este nuevo suscribtor a la lista
    
})

module.exports = router;
