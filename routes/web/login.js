const express = require('express');
const router = express.Router();
const db = require('../../database/dbUtils')
const alertGenerator = require("../../utils/alertGenerator");

router.get('/', function(req, res, next) {
    res.render('user/login', {error: false, alert: null});
});

router.post('/login', function(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;

    db.loginWithEmailPassword(email, password)
        .then(({ user, success }) => {
            if (success) {
                req.session.logged = true;
                req.session.user = user;

                res.redirect('/');
            } else {
                const alertData = alertGenerator("danger", "Ошибка входа!", "Данные для входа не подходят! Проверьте правильность введённых данных.");
                res.render('user/login', { alert: alertData, error: true });
            }
        })
        .catch(error => {
            console.error('Error during login:', error);
            const alertData = alertGenerator("danger", "Ошибка", "Произошла ошибка во время входа.");
            res.render('user/login', { alert: alertData, error: true });
        });
});

module.exports = router;
