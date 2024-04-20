const express = require('express');
const replaceHtmlContent = require("../../utils/cardGenerator");
const {getServers} = require("../../utils/serversModule");
const router = express.Router();

router.get('/', async function (req, res, next) {
    try {
        // Получаем массив серверов
        const servers = await getServers();

        // Массив для хранения результатов
        const replacedHtmlContents = [];

        // Перебираем каждый сервер
        servers.forEach(server => {
            // Передаем параметры сервера в функцию replaceHtmlContent и сохраняем результат
            const replacedContent = replaceHtmlContent(server.newText, server.onlineCount, server.description, server.serverTag);
            // Добавляем замененный контент в массив
            replacedHtmlContents.push(replacedContent);
        });

        // Рендерим шаблон и передаем в него замененные контенты
        res.render('projects', {servers: replacedHtmlContents});
    } catch (error) {
        // Обработка ошибок
        next(error);
    }
});

module.exports = router;
