var $ = require('jquery');
var $donateModal = $('#donate_modal');

module.exports.$donateModal = $donateModal;

var _ = require('lodash');

var disableSubmitButton = function() {
    $donateModal.find('form button[type=submit]').attr('disabled', true);
};

var enableSubmitButton = function() {
    $donateModal.find('form button[type=submit]').removeAttr('disabled');
};

var _modalLocked = false;

var disableModalClose = function() {
    _modalLocked = true;
    $donateModal.find('form button[type=button]').attr('disabled', true);
};

var enableModalClose = function() {
    _modalLocked = false;
    $donateModal.find('form button[type=button]').removeAttr('disabled');
};

module.exports.errors = function(errors) {
    var renderedErrors = errors.map(function(error) {
        var message = _.get(error, 'message', error);

        return($('<li>' + message + '</li>'));
    });

    enableSubmitButton();

    $donateModal
        .find('.errors')
        .html('The following errors occurred<br/>')
        .append($('<ul></ul>').html(renderedErrors))
        .show();
};

module.exports.init = function() {
    var $ = require('jquery');

    $(document)
        .off('click.donation')
        .on('click.donation', '[data-donate-ein]', function(e) {
            var ein = module.exports.ein = $(e.target).attr('data-donate-ein');
            var charityName = module.exports.charityName = $(e.target).attr('data-donate-name');

            $donateModal.find('input[name=destination]').val(ein);
            $donateModal.find('h4.modal-title').html('Make a Donation to ' + charityName);
            $donateModal.find('.errors').hide();

            $donateModal.modal({
                backdrop: 'static',
                keyboard: false
            });
        });

    $('#donate_modal form').off('submit.ui').on('submit.ui', disableSubmitButton);

    $donateModal.on('hide.bs.modal', function(e) {
        if(_modalLocked) {
            e.preventDefault();
            e.stopImmediatePropagation();
            return false;
        }
    });
};

