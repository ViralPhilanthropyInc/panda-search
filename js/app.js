var instantsearch = require('instantsearch.js');

var search = instantsearch({
    appId: 'EZ0RKGG8TJ',
    apiKey: 'c8a2dbd3c43a16b24b63d52875582b7e',
    indexName: 'Publication78'
});

var getTemplate = function(id) {
    return document.getElementById(id + '-template').innerHTML;
};

var assign = require('object-assign');
var _ = require('lodash');

search.addWidget(
    instantsearch.widgets.searchBox({
        container: '#search-input',
        placeholder: 'Search for any US charity',
        cssClasses: {
            input: 'form-control'
        }
    })
);

var address = function(result) {
    if(result.npo) {
        if(result.npo.business_master && _.values(result.npo.business_master).length) {
            return {
                address: result.npo.business_master.street,
                city: result.npo.business_master.city,
                state: result.npo.business_master.state,
                zip: result.npo.business_master.state
            };
        } else if(result.form990_n && _.values(result.form990_n).length) {
            return {
                address: result.npo.form990_n.org_address,
                address2: result.npo.form990_n.org_address2,
                city: result.npo.form990_n.org_city,
                state: result.npo.form990_n.org_state,
                zip: result.npo.form990_n.org_zip
            };
        } else {
            return {};
        }
    } else {
        return {};
    }
};

search.addWidget(
    instantsearch.widgets.hits({
        container: '#hits',
        hitsPerPage: 10,
        templates: {
            item: getTemplate('hit'),
            empty: getTemplate('no-results')
        },
        transformData: function(result) {
            var einStr = result.ein.toString();
            var einFormatted = einStr.substring(0, 2) + '-' + einStr.substring(2, 9);

            return assign({}, result, {
                ein: einFormatted,
                address: address(result)
            });
        }
    })
);

search.addWidget(
    instantsearch.widgets.pagination({
        container: '#pagination'
    })
);

search.start();