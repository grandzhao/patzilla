// -*- coding: utf-8 -*-
// (c) 2013,2014 Andreas Motl, Elmyra UG

OpsExchangeDocumentView = Backbone.Marionette.Layout.extend({
    //template: "#ops-entry-template",
    template: _.template($('#ops-entry-template').html(), this.model, {variable: 'data'}),
    tagName: 'div',
    className: 'row-fluid',

    regions: {
        region_comment_button: '#region-comment-button',
        region_comment_text: '#region-comment-text',
    },

    initialize: function() {
        console.log('OpsExchangeDocumentView.initialize');
        this.templateHelpers.config = opsChooserApp.config;
    },

    templateHelpers: {
        get_linkmaker: function() {
            return new Ipsuite.LinkMaker(this);
        },
    },

    onDomRefresh: function() {
        console.log('OpsExchangeDocumentView.onDomRefresh');

        // Attach current model reference to result entry dom container so it can be used by different subsystems
        // A reference to the model is required for switching between document details (biblio/fulltext)
        // and for acquiring abstracts from third party data sources.
        var container = $(this.el).find('.ops-collection-entry');
        $(container).prop('ops-document', this.model.attributes);

    },

    events: {
        'click .rank_up img': 'rankUp',
        'click .rank_down img': 'rankDown',
        'click a.disqualify': 'disqualify',
    },

});

OpsExchangeDocumentCollectionView = Backbone.Marionette.CompositeView.extend({
    tagName: "div",
    id: "opsexchangedocumentcollection",
    className: "container",
    template: "#ops-collection-template",
    itemView: OpsExchangeDocumentView,

    initialize: function(options) {
        console.log('OpsExchangeDocumentCollectionView.initialize');
    },

    // Override and disable add:render event, see also:
    // https://github.com/marionettejs/backbone.marionette/issues/640
    _initialEvents: function() {
        if (this.collection) {
            //this.listenTo(this.collection, "add", this.addChildView, this);
            this.listenTo(this.collection, "remove", this.removeItemView, this);
            this.listenTo(this.collection, "reset", this.render, this);
        }
    },

    // override the "close" method, otherwise the events bound by "_initialEvents" would vanish
    // which leads to the view children not being re-rendered when resetting its collection.
    // See also region.show(view, {preventClose: true}) in more recent versions of Marionette.
    close: function() {
    },

    onRender: function() {
        console.log('OpsExchangeDocumentCollectionView.onRender');
    },

    onDomRefresh: function() {
        console.log('OpsExchangeDocumentCollectionView.onDomRefresh');
    },

});

MetadataView = Backbone.Marionette.ItemView.extend({
    tagName: "div",
    //id: "paginationview",
    //template: "#ops-metadata-template",
    template: _.template($('#ops-metadata-template').html(), this.model, {variable: 'data'}),

    initialize: function() {
        this.templateHelpers.config = opsChooserApp.config;
        this.listenTo(this.model, "change", this.render);
        this.listenTo(this, "render", this.setup_ui);
    },

    templateHelpers: {},

    setup_ui: function() {
        log('MetadataView.setup_ui');

        $('.content-chooser > button[data-toggle="tab"]').on('show', function (e) {
            // e.target // activated tab
            // e.relatedTarget // previous tab

            var list_type = $(this).data('list-type');
            if (list_type == 'ops') {
                opsChooserApp.listRegion.show(opsChooserApp.collectionView);

            } else if (list_type == 'upstream') {
                opsChooserApp.listRegion.show(opsChooserApp.resultView);
            }

        });

    },

});


OpsFamilyVerboseMemberView = Backbone.Marionette.ItemView.extend({

    template: _.template($('#ops-family-verbose-member-template').html(), this.model, {variable: 'data'}),
    tagName: 'tr',
    //className: 'row-fluid',
    //style: 'margin-bottom: 10px',

});

OpsFamilyVerboseCollectionView = Backbone.Marionette.CompositeView.extend({

    template: "#ops-family-verbose-collection-template",
    itemView: OpsFamilyVerboseMemberView,

    id: "ops-family-verbose-verbose-collection",
    //tagName: "div",
    //className: "container-fluid",

    appendHtml: function(collectionView, itemView) {
        collectionView.$('tbody').append(itemView.el);
    }

});


OpsFamilyCompactMemberView = Backbone.Marionette.ItemView.extend({

    template: _.template($('#ops-family-compact-member-template').html(), this.model, {variable: 'data'}),
    tagName: 'tr',
    //tagName: 'div',
    //className: 'row-fluid',
    //style: 'margin-bottom: 10px',

});

OpsFamilyCompactCollectionView = Backbone.Marionette.CompositeView.extend({

    template: "#ops-family-compact-collection-template",
    itemView: OpsFamilyCompactMemberView,

    id: "ops-family-compact-collection",
    //tagName: "div",
    //className: "container-fluid",

    appendHtml: function(collectionView, itemView) {
        collectionView.$('tbody').append(itemView.el);
    },

});


OpsFamilyCitationsMemberView = Backbone.Marionette.ItemView.extend({

    template: _.template($('#ops-family-citations-member-template').html(), this.model, {variable: 'data'}),
    tagName: 'tr',

    templateHelpers: {
        get_patent_citation_list: function(enrich) {
            if (this['exchange-document']) {
                var exchange_document = new OpsExchangeDocument(this['exchange-document']);
                var citations = exchange_document.attributes.get_patent_citation_list(enrich);
                return citations;
            } else {
                return [];
            }
        },
        get_citations_environment_button: function() {
            var exchange_document = new OpsExchangeDocument(this['exchange-document']);
            var citations_environment_button = exchange_document.attributes.get_citations_environment_button();
            return citations_environment_button;
        },
    },

});

OpsFamilyCitationsCollectionView = Backbone.Marionette.CompositeView.extend({

    id: "ops-family-citations-collection",
    //template: "#ops-family-citations-collection-template",
    template: _.template($('#ops-family-citations-collection-template').html(), this.collection, {variable: 'data'}),
    itemView: OpsFamilyCitationsMemberView,

    appendHtml: function(collectionView, itemView) {
        collectionView.$('tbody').append(itemView.el);
    },

    templateHelpers: function() {

        // implement interface required for reusing #ops-citations-environment-button-template
        return {

            // If your template needs access to the collection, you'll need to pass it via templateHelpers
            // https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.compositeview.md#composite-model-template
            items: this.collection.toJSON(),

            get_citations_environment_button: function() {
                var tpl = _.template($('#ops-citations-environment-button-template').html());
                return tpl({data: this});
            },

            has_citations: function() {
                return this.items.length > 0;
            },
            get_patent_citation_list: function(links, id_type) {
                id_type = id_type || 'docdb';

                // aggregate cited references across all family members
                var citations_set = new Set();
                _.each(this.items, function(item) {
                    var exchange_document = new OpsExchangeDocument(item['exchange-document']);
                    var citations_local = exchange_document.attributes.get_patent_citation_list(false, 'epodoc');
                    _.each(citations_local, function(citation) {
                        citations_set.add(citation);
                    });
                });

                var citations = Array.from(citations_set);
                return citations;

            },
            get_citing_query: function() {
                throw Error('not implemented');
            },
            get_publication_number: function(kind) {
                throw Error('not implemented');
            },

        };

    },

});
