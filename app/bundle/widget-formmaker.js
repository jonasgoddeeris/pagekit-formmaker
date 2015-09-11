var Forms =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(90)
	module.exports.template = __webpack_require__(91)


/***/ },

/***/ 57:
/***/ function(module, exports) {

	module.exports = function (Vue) {

	    Vue.filter('datetime', function (date) {
	        if (typeof date === 'string') {
	            date = new Date(date);
	        }
	        return date ? this.$date(date, 'mediumDate') + ', ' + this.$date(date, 'HH:mm:ss') : '';
	    });

	    Vue.filter('shortcode', function (slug, key) {
	        return '$$ ' + slug + ':' + key + ' $$';
	    });

	};

/***/ },

/***/ 90:
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(57)(Vue);

	    module.exports = {

	        type: {

	            id: 'formmaker',
	            label: 'New form submissions',
	            description: function () {

	            },
	            defaults: {
	                form: ['all'],
	                done: false,
	                count: 12
	            }

	        },

	        replace: false,

	        props: ['widget', 'editing'],

	        watch: {

	            'widget.form': {
	                handler: 'load',
	                immediate: true
	            },

	            'editing': 'loadForms',

	            'widget.count': 'load',

	            'widget.done': 'load'

	        },

	        methods: {

	            load: function () {

	                var filter = {
	                    status: 1,
	                    limit: this.widget.count
	                };

	                if (this.$get('widget.form').indexOf('all') === -1) {
	                    filter['form'] = this.$get('widget.form');
	                }

	                if (this.$get('widget.done')) {
	                    filter['status'] = '';
	                }

	                this.$resource('api/formmaker/submission/:id').query({filter: filter}, function (data) {

	                    this.$set('count', data.count);
	                    this.$set('submissions', data.submissions);

	                });
	            },

	            loadForms: function (editing) {
	                if (editing && !this.$get('forms')) {

	                    this.$resource('api/formmaker/form/:id').query(function (data) {
	                        this.$set('forms', data);
	                    });

	                }
	            }

	        }

	    };

	    window.Dashboard.components['formmaker'] = module.exports;

/***/ },

/***/ 91:
/***/ function(module, exports) {

	module.exports = "<form class=\"pk-panel-teaser uk-form uk-form-stacked\" v-if=\"editing\">\n\n        <div class=\"uk-form-row \">\n            <span class=\"uk-form-label\">{{ 'Filter forms' | trans }}</span>\n\n            <div class=\"uk-form-controls uk-form-controls-text\">\n                <p class=\"uk-form-controls-condensed\">\n                    <label><input type=\"checkbox\" value=\"all\" v-checkbox=\"widget.form\"> {{ 'Show all' | trans }}</label>\n                </p>\n                <p v-repeat=\"form: forms\" class=\"uk-form-controls-condensed\">\n                    <label><input type=\"checkbox\" value=\"{{ form.id }}\" v-checkbox=\"widget.form\"> {{ form.title }}</label>\n                </p>\n            </div>\n        </div>\n\n        <div class=\"uk-form-row\">\n            <span class=\"uk-form-label\">{{ 'Done submissions' | trans }}</span>\n\n            <div class=\"uk-form-controls uk-form-controls-text\">\n                <p class=\"uk-form-controls-condensed\">\n                    <label><input type=\"radio\" value=\"1\" v-model=\"widget.done\"> {{ 'Show' | trans }}</label>\n                </p>\n\n                <p class=\"uk-form-controls-condensed\">\n                    <label><input type=\"radio\" value=\"\" v-model=\"widget.done\"> {{ 'Hide' | trans }}</label>\n                </p>\n            </div>\n        </div>\n\n        <div class=\"uk-form-row\">\n            <label class=\"uk-form-label\" for=\"form-submissions-number\">{{ 'Number of submissions' | trans }}</label>\n\n            <div class=\"uk-form-controls\">\n                <select id=\"form-submissions-number\" class=\"uk-width-1-1\" v-model=\"widget.count\" number>\n                    <option value=\"6\">6</option>\n                    <option value=\"12\">12</option>\n                    <option value=\"18\">16</option>\n                </select>\n            </div>\n        </div>\n\n    </form>\n\n    <div class=\"pk-text-large\">{{ count }}</div>\n\n    <h3 class=\"uk-panel-title\" v-show=\"!widget.done\">{{ '{0} Active submissions|{1} Active submission|]1,Inf[ Active submissions' | transChoice count}}</h3>\n\n    <h3 class=\"uk-panel-title\" v-show=\"widget.done\">{{ '{0} Submissions|{1} Submission|]1,Inf[ Submissions' | transChoice count}}</h3>\n\n    <ul v-show=\"submissions.length\" class=\"uk-list uk-list-line\">\n        <li class=\"\" v-repeat=\"submission: submissions | orderBy 'status ASC, created DESC'\">\n            <span class=\"uk-float-right\" v-class=\"pk-icon-circle-danger: !submission.status,\n\t\t\t\t\t\t\t  pk-icon-circle-primary: submission.status == 1,\n\t\t\t\t\t\t\t  pk-icon-circle-success: submission.status == 2\"></span>\n\n            <a href=\"{{ $url.route('admin/formmaker/submissions#' + submission.id ) }}\">{{ submission.created | datetime }}</a>\n            <div class=\"uk-text-truncate uk-text-muted\">\n                {{ submission.form_title }}<span v-if=\"submission.email\"> | {{ submission.email }}</span>\n            </div>\n        </li>\n    </ul>";

/***/ }

/******/ });