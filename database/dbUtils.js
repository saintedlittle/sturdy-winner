const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'your_host',
    user: 'your_username',
    password: 'your_password',
    database: 'your_database'
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

class User {
    constructor(id, username, bonuses, lastLoginDate) {
        this.id = id;
        this.username = username;
        this.bonuses = bonuses;
        this.lastLoginDate = lastLoginDate;
    }
}

class UserIPHistory {
    constructor(ipAddress, loginDate) {
        this.ipAddress = ipAddress;
        this.loginDate = loginDate;
    }
}

class Ban {
    constructor(username, whoBanned, reason, startTime, endTime) {
        this.username = username;
        this.whoBanned = whoBanned;
        this.reason = reason;
        this.startTime = startTime;
        this.endTime = endTime;
    }
}

class Mute {
    constructor(username, whoMuted, reason, startTime, endTime) {
        this.username = username;
        this.whoMuted = whoMuted;
        this.reason = reason;
        this.startTime = startTime;
        this.endTime = endTime;
    }
}

class Warn {
    constructor(username, whoWarned, reason, startTime, endTime) {
        this.username = username;
        this.whoWarned = whoWarned;
        this.reason = reason;
        this.startTime = startTime;
        this.endTime = endTime;
    }
}

/* USER FUNCTIONS */

async function loginWithEmailPassword(email, password) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT id, username, bonuses, lastLoginDate
            FROM users
            WHERE email = ? AND password = ?
        `;
        connection.query(query, [email, password], (err, rows) => {
            if (err) {
                console.error('Error during login:', err);
                resolve({ user: null, success: false });
            } else if (rows.length === 1) {
                const userData = rows[0];
                const user = new User(userData.id, userData.username, userData.bonuses, userData.lastLoginDate);
                console.log('Login successful');
                console.log('User ID:', user.id);
                console.log('Username:', user.username);
                console.log('Bonuses:', user.bonuses);
                console.log('Last Login Date:', user.lastLoginDate);
                resolve({ user, success: true });
            } else {
                console.log('Invalid email or password');
                resolve({ user: null, success: false });
            }
        });
    });
}

async function createUser(email, username, password) {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO users (email, username, password)
            VALUES (?, ?, ?)
        `;
        connection.query(query, [email, username, password], (err, result) => {
            if (err) {
                console.error('Error creating user:', err);
                resolve({ user: null, success: false });
            } else {
                console.log('User created with ID:', result.insertId);
                const user = new User(result.insertId, username, 100, null);
                resolve({ user, success: true });
            }
        });
    });
}

async function changeAvatar(userId, avatarData) {
    return new Promise((resolve, reject) => {
        const query = `
            UPDATE users
            SET avatar = ?
            WHERE id = ?
        `;
        connection.query(query, [avatarData, userId], (err, result) => {
            if (err) {
                console.error('Error changing avatar:', err);
                resolve({ success: false });
            } else {
                console.log('Avatar updated for user ID:', userId);
                resolve({ success: true });
            }
        });
    });
}

async function changePassword(userId, newPassword) {
    return new Promise((resolve, reject) => {
        const query = `
            UPDATE users
            SET password = ?
            WHERE id = ?
        `;
        connection.query(query, [newPassword, userId], (err, result) => {
            if (err) {
                console.error('Error changing password:', err);
                resolve({ success: false });
            } else {
                console.log('Password changed for user ID:', userId);
                resolve({ success: true });
            }
        });
    });
}

async function changeUsername(userId, newUsername) {
    return new Promise((resolve, reject) => {
        const query = `
            UPDATE users
            SET username = ?
            WHERE id = ?
        `;
        connection.query(query, [newUsername, userId], (err, result) => {
            if (err) {
                console.error('Error changing username:', err);
                resolve({ success: false });
            } else {
                console.log('Username changed for user ID:', userId);
                resolve({ success: true });
            }
        });
    });
}

/* GET FUNCTIONS */
async function getUserIPHistory(userId) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT ip_address, login_date
            FROM user_ip_history
            WHERE user_id = ?
        `;
        connection.query(query, [userId], (err, rows) => {
            if (err) {
                console.error('Error getting user IP history:', err);
                resolve([]);
            } else {
                const userIPHistory = rows.map(row => new UserIPHistory(row.ip_address, row.login_date));
                resolve(userIPHistory);
            }
        });
    });
}

async function getUserBanList(userId) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT username, who_banned, reason, startTime, endTime
            FROM banlist
            WHERE username IN (
                SELECT username
                FROM users
                WHERE id = ?
            )
        `;
        connection.query(query, [userId], (err, rows) => {
            if (err) {
                console.error('Error getting user ban list:', err);
                resolve([]);
            } else {
                const userBanList = rows.map(row => new Ban(row.username, row.who_banned, row.reason, row.startTime, row.endTime));
                resolve(userBanList);
            }
        });
    });
}

async function getUserMuteList(userId) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT username, who_mutted, reason, startTime, endTime
            FROM mutelist
            WHERE username IN (
                SELECT username
                FROM users
                WHERE id = ?
            )
        `;
        connection.query(query, [userId], (err, rows) => {
            if (err) {
                console.error('Error getting user mute list:', err);
                resolve([]);
            } else {
                const userMuteList = rows.map(row => new Mute(row.username, row.who_mutted, row.reason, row.startTime, row.endTime));
                resolve(userMuteList);
            }
        });
    });
}

async function getUserWarnList(userId) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT username, who_warned, reason, startTime, endTime
            FROM warnlist
            WHERE username IN (
                SELECT username
                FROM users
                WHERE id = ?
            )
        `;
        connection.query(query, [userId], (err, rows) => {
            if (err) {
                console.error('Error getting user warn list:', err);
                resolve([]);
            } else {
                const userWarnList = rows.map(row => new Warn(row.username, row.who_warned, row.reason, row.startTime, row.endTime));
                resolve(userWarnList);
            }
        });
    });
}

/* Получить объект наказания по id. */
async function getObjectById(table, id) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT *
            FROM ${table}
            WHERE id = ?
        `;
        connection.query(query, [id], (err, rows) => {
            if (err) {
                console.error(`Error getting object from ${table} by ID:`, err);
                resolve(null);
            } else {
                if (rows.length === 1) {
                    resolve(rows[0]);
                } else {
                    resolve(null);
                }
            }
        });
    });
}

/* Получить последний объект наказания. */
async function getLastObject(table) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT *
            FROM ${table}
            ORDER BY id DESC
            LIMIT 1
        `;
        connection.query(query, (err, rows) => {
            if (err) {
                console.error(`Error getting last object from ${table}:`, err);
                resolve(null);
            } else {
                if (rows.length === 1) {
                    resolve(rows[0]);
                } else {
                    resolve(null);
                }
            }
        });
    });
}

/* ADD FUNCTIONS */

async function addBan(ban) {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO banlist (username, who_banned, reason, startTime, endTime)
            VALUES (?, ?, ?, ?, ?)
        `;
        const { username, whoBanned, reason, startTime, endTime } = ban;
        connection.query(query, [username, whoBanned, reason, startTime, endTime], (err, result) => {
            if (err) {
                console.error('Error adding ban:', err);
                resolve({ success: false });
            } else {
                console.log('Ban added for username:', username);
                resolve({ success: true });
            }
        });
    });
}

async function addMute(mute) {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO mutelist (username, who_mutted, reason, startTime, endTime)
            VALUES (?, ?, ?, ?, ?)
        `;
        const { username, whoMuted, reason, startTime, endTime } = mute;
        connection.query(query, [username, whoMuted, reason, startTime, endTime], (err, result) => {
            if (err) {
                console.error('Error adding mute:', err);
                resolve({ success: false });
            } else {
                console.log('Mute added for username:', username);
                resolve({ success: true });
            }
        });
    });
}

async function addWarn(warn) {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO warnlist (username, who_warned, reason, startTime, endTime)
            VALUES (?, ?, ?, ?, ?)
        `;
        const { username, whoWarned, reason, startTime, endTime } = warn;
        connection.query(query, [username, whoWarned, reason, startTime, endTime], (err, result) => {
            if (err) {
                console.error('Error adding warn:', err);
                resolve({ success: false });
            } else {
                console.log('Warn added for username:', username);
                resolve({ success: true });
            }
        });
    });
}

async function removeBan(identifier) {
    return new Promise((resolve, reject) => {
        let query;
        let values;
        if (Number.isInteger(identifier)) {
            // Удалить запись по ID
            query = `
                DELETE FROM banlist
                WHERE id = ?
            `;
            values = [identifier];
        } else {
            // Удалить самую последнюю запись
            query = `
                DELETE FROM banlist
                WHERE id = (
                    SELECT MAX(id) FROM banlist
                )
            `;
            values = [];
        }
        connection.query(query, values, (err, result) => {
            if (err) {
                console.error('Error removing ban:', err);
                resolve({ success: false });
            } else {
                console.log('Ban removed');
                resolve({ success: true });
            }
        });
    });
}

async function removeMute(identifier) {
    return new Promise((resolve, reject) => {
        let query;
        let values;
        if (Number.isInteger(identifier)) {
            // Удалить запись по ID
            query = `
                DELETE FROM mutelist
                WHERE id = ?
            `;
            values = [identifier];
        } else {
            // Удалить самую последнюю запись
            query = `
                DELETE FROM mutelist
                WHERE id = (
                    SELECT MAX(id) FROM mutelist
                )
            `;
            values = [];
        }
        connection.query(query, values, (err, result) => {
            if (err) {
                console.error('Error removing mute:', err);
                resolve({ success: false });
            } else {
                console.log('Mute removed');
                resolve({ success: true });
            }
        });
    });
}

async function removeWarn(identifier) {
    return new Promise((resolve, reject) => {
        let query;
        let values;
        if (Number.isInteger(identifier)) {
            // Удалить запись по ID
            query = `
                DELETE FROM warnlist
                WHERE id = ?
            `;
            values = [identifier];
        } else {
            // Удалить самую последнюю запись
            query = `
                DELETE FROM warnlist
                WHERE id = (
                    SELECT MAX(id) FROM warnlist
                )
            `;
            values = [];
        }
        connection.query(query, values, (err, result) => {
            if (err) {
                console.error('Error removing warn:', err);
                resolve({ success: false });
            } else {
                console.log('Warn removed');
                resolve({ success: true });
            }
        });
    });
}

module.exports = {
    loginWithEmailPassword,
    removeBan,
    removeWarn,
    removeMute,
    addBan,
    addMute,
    addWarn,
    createUser,
    changeAvatar,
    changePassword,
    changeUsername,
    getUserIPHistory,
    getUserBanList,
    getUserMuteList,
    getUserWarnList
};
