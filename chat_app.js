/*globals Meteor Session Template */

(function () {
    'use strict';

    var Messages = new Meteor.Collection("messages");

    // client

    function scrollToBottom() {
        $(".well").prop({ scrollTop: $(".well").prop("scrollHeight") });
    }

    if (Meteor.is_client) {

        Meteor.startup(function () {

        });

        Template.chatwindow.messages = function () {
            return Messages.find();
        };

        var OtherMessages = Messages.find({ username : { $ne : Session.get("myUsername") } });
        var MyMessages = Messages.find({ username  : Session.get("myUsername") });

        OtherMessages.observe({
            added: function () {
                scrollToBottom();
            }
        });

        MyMessages.observe({
            added: function () {
                scrollToBottom();
            }
        });

        // Chat window template

        Template.chatwindow.events = {

            'submit form': function (e) {
                e.preventDefault();

                Messages.insert({
                    username: Session.get("myUsername"),
                    messageContent: $('#chatform textarea').val()
                });

                $('#chatform>textarea').val('');
            },

            'keydown textarea': function (e) {
                if (e.keyCode === 13) {
                    $('#send').click();
                    return false;
                }

            }
        };

        // Message template

        Template.message.labelColor = function () {
            if (this.username === Session.get("myUsername")) {
                return 'label-info';
            }
            return 'label-success';
        };

        // Header template

        Template.header.events = {
            'click .clear-history': function (e) {
                e.preventDefault();

                Messages.remove({});
            }
        };

        // Modal template

        Template.modal.noName = function () {
            if (typeof Session.get("myUsername") === "undefined" || Session.get("myUsername") === '') {
                return true;
            }
            return false;
        };

        Template.modal.events = {
            'submit form': function (e) {
                e.preventDefault();
                Session.set("myUsername", $('#username').val());
            }
        };

    }

    // server

    if (Meteor.is_server) {
        Meteor.startup(function () {
            // code to run on server at startup
        });
    }

}());