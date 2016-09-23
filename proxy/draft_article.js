var models = require('../models');
var DraftArticle = models.DraftArticle;

exports.newAndSave = function (user_id, title, content, create_at, callback) {
    var draft = new DraftArticle({
        user_id: user_id,
        title: title,
        content: content,
        create_at: create_at
    });
    draft.save(callback);
};

exports.getOrCreate = function (user_id, title, content, create_at, callback) {
    DraftArticle.findOne({ user_id: user_id, create_at: create_at }, function (err, draft) {
        if (err) {
            return callback(err);
        }
        if (draft) {
            return callback(null, draft);
        }

        var newDraft = new DraftArticle({
            user_id: user_id,
            title: title,
            content: content,
            create_at: create_at
        });
        newDraft.save(callback);
    });
};

exports.getUserDrafts = function (user_id, callback) {
    DraftArticle.find({ user_id: user_id }, callback);
};

exports.getByCreateTime = function (user_id, create_at, callback) {
    DraftArticle.findOne({ user_id: user_id, create_at: create_at }, callback);
}

exports.deleteDraftsByUserId = function (user_id, callback) {
    DraftArticle.remove({ user_id: user_id }, callback);
};