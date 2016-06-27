var $ = require('jquery');
var $donateModal = $('#donate_modal');

module.exports.$donateModal = $donateModal;

var _ = require('lodash');

module.exports.errors = function(errors) {
    var renderedErrors = errors.map(function(error) {
        var message = _.get(error, 'message', error);

        return($('<li>' + message + '</li>'));
    });

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

            $donateModal.modal();
        });
};

