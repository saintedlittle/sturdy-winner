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

// Тип данных для записи в списке банов
class Ban {
    constructor(username, whoBanned, reason, startTime, endTime) {
        this.username = username;
        this.whoBanned = whoBanned;
        this.reason = reason;
        this.startTime = startTime;
        this.endTime = endTime;
    }
}

// Тип данных для записи в списке мутов
class Mute {
    constructor(username, whoMuted, reason, startTime, endTime) {
        this.username = username;
        this.whoMuted = whoMuted;
        this.reason = reason;
        this.startTime = startTime;
        this.endTime = endTime;
    }
}

// Тип данных для записи в списке предупреждений
class Warn {
    constructor(username, whoWarned, reason, startTime, endTime) {
        this.username = username;
        this.whoWarned = whoWarned;
        this.reason = reason;
        this.startTime = startTime;
        this.endTime = endTime;
    }
}

module.exports = [
    User, UserIPHistory, Ban, Mute, Warn
]