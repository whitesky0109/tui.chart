tui.util.defineNamespace("fedoc.content", {});
fedoc.content["charts_componentManager.js.html"] = "      <div id=\"main\" class=\"main\">\n\n\n\n    \n    <section>\n        <article>\n            <pre class=\"prettyprint source linenums\"><code>/**\n * @fileoverview ComponentManager manages components of chart.\n * @author NHN Ent.\n *         FE Development Lab &lt;dl_javascript@nhnent.com>\n */\n\n'use strict';\n\nvar dom = require('../helpers/domHandler');\n\nvar ComponentManager = tui.util.defineClass(/** @lends ComponentManager.prototype */ {\n    /**\n     * ComponentManager manages components of chart.\n     * @param {object} params parameters\n     *      @param {object} params.theme - theme\n     *      @param {object} params.options - options\n     *      @param {DataProcessor} params.dataProcessor - data processor\n     *      @param {boolean} params.hasAxes - whether has axes or not\n     * @constructs ComponentManager\n     */\n    init: function(params) {\n        /**\n         * Components\n         * @type {Array.&lt;object>}\n         */\n        this.components = [];\n\n        /**\n         * Component map.\n         * @type {object}\n         */\n        this.componentMap = {};\n\n        /**\n         * theme\n         * @type {object}\n         */\n        this.theme = params.theme || {};\n\n        /**\n         * options\n         * @type {object}\n         */\n        this.options = params.options || {};\n\n        /**\n         * data processor\n         * @type {DataProcessor}\n         */\n        this.dataProcessor = params.dataProcessor;\n\n        /**\n         * whether chart has axes or not\n         * @type {boolean}\n         */\n        this.hasAxes = params.hasAxes;\n\n        /**\n         * event bus for transmitting message\n         * @type {object}\n         */\n        this.eventBus = params.eventBus;\n    },\n\n    /**\n     * Make component options.\n     * @param {object} options options\n     * @param {string} componentType component type\n     * @param {number} index component index\n     * @returns {object} options\n     * @private\n     */\n    _makeComponentOptions: function(options, componentType, index) {\n        options = options || this.options[componentType];\n        options = tui.util.isArray(options) ? options[index] : options || {};\n\n        return options;\n    },\n\n    /**\n     * Register component.\n     * The component refers to a component of the chart.\n     * The component types are axis, legend, plot, series and customEvent.\n     * Chart Component Description : https://i-msdn.sec.s-msft.com/dynimg/IC267997.gif\n     * @param {string} name component name\n     * @param {function} Component component constructor\n     * @param {object} params component parameters\n     */\n    register: function(name, Component, params) {\n        var index, component, componentType;\n\n        params = params || {};\n\n        componentType = params.componentType || name;\n        index = params.index || 0;\n\n        params.theme = params.theme || this.theme[componentType];\n        params.options = this._makeComponentOptions(params.options, componentType, index);\n\n        params.dataProcessor = this.dataProcessor;\n        params.hasAxes = this.hasAxes;\n        params.eventBus = this.eventBus;\n\n        component = new Component(params);\n        component.componentName = name;\n        component.componentType = componentType;\n\n        this.components.push(component);\n        this.componentMap[name] = component;\n    },\n\n    /**\n     * Make data for rendering.\n     * @param {string} name - component name\n     * @param {string} type - component type\n     * @param {object} paper - raphael object\n     * @param {{\n     *      layoutBounds: {\n     *          dimensionMap: object,\n     *          positionMap: object\n     *      },\n     *      limitMap: object,\n     *      axisDataMap: object,\n     *      maxRadius: ?number\n     * }} boundsAndScale - bounds and scale data\n     * @param {?object} additionalData - additional data\n     * @returns {object}\n     * @private\n     */\n    _makeDataForRendering: function(name, type, paper, boundsAndScale, additionalData) {\n        var data = tui.util.extend({\n            paper: paper\n        }, additionalData);\n\n        if (boundsAndScale) {\n            tui.util.extend(data, boundsAndScale);\n\n            data.layout = {\n                dimension: data.dimensionMap[name] || data.dimensionMap[type],\n                position: data.positionMap[name] || data.positionMap[type]\n            };\n        }\n\n        return data;\n    },\n\n    /**\n     * Render components.\n     * @param {string} funcName - function name for executing\n     * @param {{\n     *      layoutBounds: {\n     *          dimensionMap: object,\n     *          positionMap: object\n     *      },\n     *      limitMap: object,\n     *      axisDataMap: object,\n     *      maxRadius: ?number\n     * }} boundsAndScale - bounds and scale data\n     * @param {?object} additionalData - additional data\n     * @param {?HTMLElement} container - container\n     */\n    render: function(funcName, boundsAndScale, additionalData, container) {\n        var self = this;\n        var name, type, paper;\n\n        var elements = tui.util.map(this.components, function(component) {\n            var element = null;\n            var data, result;\n\n            if (component[funcName]) {\n                name = component.componentName;\n                type = component.componentType;\n                data = self._makeDataForRendering(name, type, paper, boundsAndScale, additionalData);\n\n                result = component[funcName](data);\n\n                if (result &amp;&amp; result.container) {\n                    element = result.container;\n                    paper = result.paper;\n                } else {\n                    element = result;\n                }\n            }\n\n            return element;\n        });\n\n        if (container) {\n            dom.append(container, elements);\n        }\n    },\n\n    /**\n     * Find components to conditionMap.\n     * @param {object} conditionMap condition map\n     * @returns {Array.&lt;object>} filtered components\n     */\n    where: function(conditionMap) {\n        return tui.util.filter(this.components, function(component) {\n            var contained = true;\n\n            tui.util.forEach(conditionMap, function(value, key) {\n                if (component[key] !== value) {\n                    contained = false;\n                }\n\n                return contained;\n            });\n\n            return contained;\n        });\n    },\n\n    /**\n     * Execute components.\n     * @param {string} funcName - function name\n     */\n    execute: function(funcName) {\n        var args = Array.prototype.slice.call(arguments, 1);\n\n        tui.util.forEachArray(this.components, function(component) {\n            if (component[funcName]) {\n                component[funcName].apply(component, args);\n            }\n        });\n    },\n\n    /**\n     * Get component.\n     * @param {string} name component name\n     * @returns {object} component instance\n     */\n    get: function(name) {\n        return this.componentMap[name];\n    },\n\n    /**\n     * Whether has component or not.\n     * @param {string} name - comopnent name\n     * @returns {boolean}\n     */\n    has: function(name) {\n        return !!this.get(name);\n    }\n});\n\nmodule.exports = ComponentManager;\n</code></pre>\n        </article>\n    </section>\n\n\n\n</div>\n\n"