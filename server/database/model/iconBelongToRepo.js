// icon and repo relationship, for delete operation

module.exports = {
    iconId: {type: Number, unique: true},
    iconName: {type: String},
    repos: [
        {
            repoId: Number,
            repoName: String
        }
    ]
};
