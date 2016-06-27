var Panda = window.Panda;
var $ = require('jquery');
var donationForm = require('./donation-form');

var $donateModal = donationForm.$donateModal;
var $thanksModal = $('#thanks_modal');

module.exports.$thanksModal = $thanksModal;

var amount = function() {
    return parseInt($donateModal.find('.amount-in-dollars').val()) * 100;
};

var receiptEmail = function() {
    return parseInt($donateModal.find('input[name=receipt_email]').val()) * 100;
};

module.exports.init = function() {
    var config = require('./config.js');

    var $form = $donateModal.find('form');

    Panda.init(config.pandaPK, { form: $form[0] });

    Panda.on('success', function(cardToken) {
        $donateModal.find('input[name=source]').val(cardToken);
        $donateModal.find('input[name=amount]').val(amount());

        $.ajax({
            url: config.pandaEndpoint + '/donations',
            type: 'post',
            data: $form.serialize()
        })
            .then(function() {
                $donateModal.modal('hide');

                $thanksModal.find('.thanks-amount').html('$' + (amount() / 100) + '.00');
                $thanksModal.find('.thanks-name').html(donationForm.charityName);
                $thanksModal.find('.thanks-email').html(receiptEmail());

                $thanksModal.modal();
            })
            .fail(function(resp) {
                donationForm.errors(resp.responseJSON.errors);
            });
    });

    Panda.on('error', function(errors) {
        donationForm.errors(errors);
    });
};
