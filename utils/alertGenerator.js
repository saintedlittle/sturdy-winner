/*
    Добавить алерт можно с помощью:
    var myAlert = document.getElementById('myAlert');
    var bsAlert = new bootstrap.Alert(myAlert);
 */
function alertGenerator(headingText, bodyText) {
    try {
        const { JSDOM } = require('jsdom');
        const htmlTemplate = `
            <div class="alert alert-success" role="alert" id="myAlert">
                <h4 class="alert-heading">${headingText}</h4>
                <p>${bodyText}</p>
                <button class="btn-close btn-primary" data-bs-dismiss="alert">Прочитано</a>
                <hr>
                <p class="mb-0">Copyright © 2024 saintedlittle</p>
            </div>
        `;

        const dom = new JSDOM(htmlTemplate);
        return dom.serialize();
    } catch (error) {
        console.error('Error occurred while generating alert HTML:', error);
        return '';
    }
}

module.exports = alertGenerator;
