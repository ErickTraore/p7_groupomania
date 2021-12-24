// Imports
var express = require('express');
var usersCtrl = require('./routes/usersCtrl');
var messagesCtrl = require('./routes/messagesCtrl');
var likesCtrl = require('./routes/likesCtrl');
const auth = require('./middleware/auth');
const router = express.Router();


// Router
exports.router = (function() {
    var router = express.Router();
    // Users routes
    router.post('/users/register/', usersCtrl.register);
    router.post('/users/login/', usersCtrl.login);
    router.get('/users/me/', usersCtrl.getUserProfile);
    router.post('/users/delProfil', usersCtrl.destroyProfil);
    router.get('/users/', usersCtrl.listUsers);
    router.post('/users/:userId/del', usersCtrl.destroyUser);
    // router.post('/users/:userId/delMe', usersCtrl.delMeUser);
    router.put('/users/me/', usersCtrl.updateUserProfile);

    router.get('/messages/', messagesCtrl.listMessages);
    router.get('/messagesAdmin/', messagesCtrl.listMessagesAdmin);
    router.post('/messages/new/', messagesCtrl.createMessage);
    router.post('/messages/:messageId/del', messagesCtrl.delMessPost);
    router.post('/messages/:messageId/delete', messagesCtrl.delMessPostAdmin);
    router.post('/messages/:messageId/vote/like', likesCtrl.likePost);
    router.post('/messages/:messageId/vote/dislike', likesCtrl.dislikePost);

    router.post("/messages/upload", messagesCtrl.uploadImage);
    router.post("/messages/delLienImage", messagesCtrl.delLienImage);

    return router;

})();