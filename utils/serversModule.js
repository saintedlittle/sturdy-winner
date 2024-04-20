const fs = require('fs');

// Функция для чтения данных из файла
function readServersData() {
    try {
        const data = fs.readFileSync('dataset/servers.json', 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading servers data:', error);
        return [];
    }
}

// Функция для записи данных в файл
function writeServersData(servers) {
    try {
        fs.writeFileSync('servers.json', JSON.stringify(servers, null, 2));
    } catch (error) {
        console.error('Error writing servers data:', error);
    }
}

// Генерация случайного id
function generateId() {
    return Math.floor(Math.random() * 1000);
}

// Получение массива серверов
function getServers() {
    return readServersData();
}

// Получение сервера по id
function getServerById(id) {
    const servers = readServersData();
    return servers.find(server => server.id === id);
}

// Добавление сервера
function addServer(newServer) {
    const servers = readServersData();
    const id = generateId();
    newServer.id = id;
    servers.push(newServer);
    writeServersData(servers);
    return id;
}

// Удаление сервера по id
function deleteServerById(id) {
    let servers = readServersData();
    servers = servers.filter(server => server.id !== id);
    writeServersData(servers);
}

// Обновление данных сервера по id
function updateServerById(id, newText, onlineCount, description, serverTag) {
    let servers = readServersData();
    const index = servers.findIndex(server => server.id === id);
    if (index !== -1) {
        servers[index].newText = newText;
        servers[index].onlineCount = onlineCount;
        servers[index].description = description;
        servers[index].serverTag = serverTag;
        writeServersData(servers);
        return true;
    }
    return false;
}

module.exports = {
    getServers,
    getServerById,
    addServer,
    deleteServerById,
    updateServerById
};
