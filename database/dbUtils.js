const { Client } = require('pg');
const { User, UserIPHistory, Ban, Mute, Warn } = require("dbDataType");

const client = new Client({
    user: 'your_username',
    host: 'your_host',
    database: 'your_database',
    password: 'your_password',
    port: 5432, // or your PostgreSQL port
});

client.connect();

/* USER FUNCTIONS */

async function loginWithEmailPassword(email, password) {
    try {
        const query = `
            SELECT id, username, bonuses, lastLoginDate
            FROM users
            WHERE email = $1 AND password = $2
        `;
        const values = [email, password];
        const result = await client.query(query, values);

        if (result.rows.length === 1) {
            // Successful login
            const userData = result.rows[0];
            const user = new User(userData.id, userData.username, userData.bonuses, userData.lastLoginDate);
            console.log('Login successful');
            console.log('User ID:', user.id);
            console.log('Username:', user.username);
            console.log('Bonuses:', user.bonuses);
            console.log('Last Login Date:', user.lastLoginDate);
            return { user, success: true };
        } else {
            // Invalid credentials
            console.log('Invalid email or password');
            return { user: null, success: false };
        }
    } catch (error) {
        console.error('Error during login:', error);
        return { user: null, success: false };
    }
}

async function createUser(email, username, password) {
    try {
        const query = `
            INSERT INTO users (email, username, password)
            VALUES ($1, $2, $3)
            RETURNING id, username, bonuses, lastLoginDate
        `;
        const values = [email, username, password];
        const result = await client.query(query, values);

        if (result.rows.length === 1) {
            const userData = result.rows[0];
            const user = new User(userData.id, userData.username, userData.bonuses, userData.lastLoginDate);
            console.log('User created with ID:', user.id);
            return { user, success: true };
        } else {
            console.log('Failed to create user');
            return { user: null, success: false };
        }
    } catch (error) {
        console.error('Error creating user:', error);
        return { user: null, success: false };
    }
}

async function changeAvatar(userId, avatarData) {
    try {
        const query = `
            UPDATE users
            SET avatar = $1
            WHERE id = $2
            RETURNING id, username, bonuses, lastLoginDate
        `;
        const values = [avatarData, userId];
        const result = await client.query(query, values);

        if (result.rows.length === 1) {
            const userData = result.rows[0];
            const user = new User(userData.id, userData.username, userData.bonuses, userData.lastLoginDate);
            console.log('Avatar updated for user ID:', userId);
            return { user, success: true };
        } else {
            console.log('Failed to update avatar for user ID:', userId);
            return { user: null, success: false };
        }
    } catch (error) {
        console.error('Error changing avatar:', error);
        return { user: null, success: false };
    }
}

async function changePassword(userId, newPassword) {
    try {
        const query = `
            UPDATE users
            SET password = $1
            WHERE id = $2
            RETURNING id, username, bonuses, lastLoginDate
        `;
        const values = [newPassword, userId];
        const result = await client.query(query, values);

        if (result.rows.length === 1) {
            const userData = result.rows[0];
            const user = new User(userData.id, userData.username, userData.bonuses, userData.lastLoginDate);
            console.log('Password changed for user ID:', userId);
            return { user, success: true };
        } else {
            console.log('Failed to change password for user ID:', userId);
            return { user: null, success: false };
        }
    } catch (error) {
        console.error('Error changing password:', error);
        return { user: null, success: false };
    }
}

async function changeUsername(userId, newUsername) {
    try {
        const query = `
            UPDATE users
            SET username = $1
            WHERE id = $2
            RETURNING id, username, bonuses, lastLoginDate
        `;
        const values = [newUsername, userId];
        const result = await client.query(query, values);

        if (result.rows.length === 1) {
            const userData = result.rows[0];
            const user = new User(userData.id, userData.username, userData.bonuses, userData.lastLoginDate);
            console.log('Username changed for user ID:', userId);
            return { user, success: true };
        } else {
            console.log('Failed to change username for user ID:', userId);
            return { user: null, success: false };
        }
    } catch (error) {
        console.error('Error changing username:', error);
        return { user: null, success: false };
    }
}

/* GET FUNCTIONS */

async function getUserIPHistory(userId) {
    try {
        const query = `
      SELECT ip_address, login_date
      FROM user_ip_history
      WHERE user_id = $1
    `;
        const values = [userId];
        const result = await client.query(query, values);

        return result.rows.map(row => new UserIPHistory(row.ip_address, row.login_date));
    } catch (error) {
        console.error('Error getting user IP history:', error);
        return [];
    }
}

async function getUserBanList(userId) {
    try {
        const query = `
      SELECT username, who_banned, reason, startTime, endTime
      FROM banlist
      WHERE username IN (
        SELECT username
        FROM users
        WHERE id = $1
      )
    `;
        const values = [userId];
        const result = await client.query(query, values);

        return result.rows.map(row => new Ban(row.username, row.who_banned, row.reason, row.startTime, row.endTime));
    } catch (error) {
        console.error('Error getting user ban list:', error);
        return [];
    }
}

async function getUserMuteList(userId) {
    try {
        const query = `
      SELECT username, who_mutted, reason, startTime, endTime
      FROM mutelist
      WHERE username IN (
        SELECT username
        FROM users
        WHERE id = $1
      )
    `;
        const values = [userId];
        const result = await client.query(query, values);

        return result.rows.map(row => new Mute(row.username, row.who_mutted, row.reason, row.startTime, row.endTime));
    } catch (error) {
        console.error('Error getting user mute list:', error);
        return [];
    }
}

async function getUserWarnList(userId) {
    try {
        const query = `
      SELECT username, who_warned, reason, startTime, endTime
      FROM warnlist
      WHERE username IN (
        SELECT username
        FROM users
        WHERE id = $1
      )
    `;
        const values = [userId];
        const result = await client.query(query, values);

        return result.rows.map(row => new Warn(row.username, row.who_warned, row.reason, row.startTime, row.endTime));
    } catch (error) {
        console.error('Error getting user warn list:', error);
        return [];
    }
}

/* ADD FUNCTIONS */

async function addBan(ban) {
    try {
        const query = `
            INSERT INTO banlist (username, who_banned, reason, startTime, endTime)
            VALUES ($1, $2, $3, $4, $5)
        `;
        const values = [ban.username, ban.whoBanned, ban.reason, ban.startTime, ban.endTime];
        await client.query(query, values);
        console.log('Ban added for username:', ban.username);
        return { ban, success: true };
    } catch (error) {
        console.error('Error adding ban:', error);
        return { ban: null, success: false };
    }
}

async function addMute(mute) {
    try {
        const query = `
            INSERT INTO mutelist (username, who_mutted, reason, startTime, endTime)
            VALUES ($1, $2, $3, $4, $5)
        `;
        const values = [mute.username, mute.whoMuted, mute.reason, mute.startTime, mute.endTime];
        await client.query(query, values);
        console.log('Mute added for username:', mute.username);
        return { mute, success: true };
    } catch (error) {
        console.error('Error adding mute:', error);
        return { mute: null, success: false };
    }
}

async function addWarn(warn) {
    try {
        const query = `
            INSERT INTO warnlist (username, who_warned, reason, startTime, endTime)
            VALUES ($1, $2, $3, $4, $5)
        `;
        const values = [warn.username, warn.whoWarned, warn.reason, warn.startTime, warn.endTime];
        await client.query(query, values);
        console.log('Warn added for username:', warn.username);
        return { warn, success: true };
    } catch (error) {
        console.error('Error adding warn:', error);
        return { warn: null, success: false };
    }
}

async function removeBan(username) {
    try {
        const query = `
            DELETE FROM banlist
            WHERE username = $1
        `;
        const values = [username];
        await client.query(query, values);
        console.log('Ban removed for username:', username);
        return { success: true };
    } catch (error) {
        console.error('Error removing ban:', error);
        return { success: false };
    }
}

async function removeMute(username) {
    try {
        const query = `
            DELETE FROM mutelist
            WHERE username = $1
        `;
        const values = [username];
        await client.query(query, values);
        console.log('Mute removed for username:', username);
        return { success: true };
    } catch (error) {
        console.error('Error removing mute:', error);
        return { success: false };
    }
}

async function removeWarn(username) {
    try {
        const query = `
            DELETE FROM warnlist
            WHERE username = $1
        `;
        const values = [username];
        await client.query(query, values);
        console.log('Warn removed for username:', username);
        return { success: true };
    } catch (error) {
        console.error('Error removing warn:', error);
        return { success: false };
    }
}