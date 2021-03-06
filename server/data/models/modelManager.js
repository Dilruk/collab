// import all models and creates relationships
var constants = require('../../constants');
var Sequelize = require('sequelize');
var Umzug = require('umzug');
var config = require('config');
var db_name = config.get('database.name');
var db_username = config.get('database.username');
var db_password = config.get('database.password');
var db_options = config.get('database.options');

var sequelize = new Sequelize(
    db_name,
    db_username,
    db_password,
    db_options
);

// Setup Umzug for Sequelize migrations
const umzug = new Umzug({
    storage: 'sequelize',
    storageOptions: {
        sequelize: sequelize,
    },
    migrations: {
        params: [
            sequelize.getQueryInterface(),
            Sequelize // Sequelize constructor - the required module
        ],
        path: process.cwd() + `/migrations/${db_name}`,
        pattern: /\.js$/
    }
});

var modelFiles = [
    'Milestone',
    'Task',
    'User',
    'Project',
    'UserProject',
    'Notification',
    'Newsfeed',
    'Message',
];

modelFiles.forEach(function(model) {
    module.exports[model] = sequelize.import(__dirname + '/' + model);
});

(function(m) {
    m.Message.belongsTo(m.Milestone);
    m.Message.belongsTo(m.Project);

    m.Task.belongsTo(m.Milestone);
    m.Task.belongsTo(m.Project);

    m.Milestone.belongsTo(m.Project);
    m.Milestone.hasMany(m.Task);

    m.Project.belongsToMany(m.User, {through: m.UserProject});
    m.Project.hasMany(m.Milestone);

    m.User.belongsToMany(m.Project, {through: m.UserProject});
    m.User.hasMany(m.Notification);

    m.Notification.belongsTo(m.User);

    m.Newsfeed.belongsTo(m.Project);

})(module.exports);

sequelize.sync().then(function(res) {
},function(error) {
    console.log(error);
});

umzug.up().then(function (migrations) {
}, function (error) {
    console.log(error);
});

module.exports.sequelize = sequelize;
