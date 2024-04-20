const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
    res.render('login', {});
});

router.post('/login', function(req, res, next) {
    // Здесь вы можете обрабатывать отправленные данные формы
    const email = req.body.email;
    const password = req.body.password;



    res.redirect('/');
});

module.exports = router;
