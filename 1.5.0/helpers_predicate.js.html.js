tui.util.defineNamespace("fedoc.content", {});
fedoc.content["helpers_predicate.js.html"] = "      <div id=\"main\" class=\"main\">\n\n\n\n    \n    <section>\n        <article>\n            <pre class=\"prettyprint source linenums\"><code>/**\n * @fileoverview Predicate.\n * @author NHN Ent.\n *         FE Development Team &lt;dl_javascript@nhnent.com>\n */\n\n'use strict';\n\nvar chartConst = require('../const');\n\n/**\n * predicate.\n * @module predicate\n */\nvar predicate = {\n    /**\n     * Whether bar chart or not.\n     * @memberOf module:predicate\n     * @param {string} chartType chart type\n     * @returns {boolean} result boolean\n     */\n    isBarChart: function(chartType) {\n        return chartType === chartConst.CHART_TYPE_BAR;\n    },\n\n    /**\n     * Whether column chart or not.\n     * @memberOf module:predicate\n     * @param {string} chartType chart type\n     * @returns {boolean} result boolean\n     */\n    isColumnChart: function(chartType) {\n        return chartType === chartConst.CHART_TYPE_COLUMN;\n    },\n\n    /**\n     * Whether bar type chart or not.\n     * @memberOf module:predicate\n     * @param {string} chartType chart type\n     * @returns {boolean} result boolean\n     */\n    isBarTypeChart: function(chartType) {\n        return this.isBarChart(chartType) || this.isColumnChart(chartType);\n    },\n\n    /**\n     * Whether combo chart or not.\n     * @memberOf module:predicate\n     * @param {string} chartType chart type\n     * @returns {boolean} result boolean\n     */\n    isComboChart: function(chartType) {\n        return chartType === chartConst.CHART_TYPE_COMBO;\n    },\n\n    /**\n     * Whether line chart or not.\n     * @memberOf module:predicate\n     * @param {string} chartType chart type\n     * @returns {boolean} result boolean\n     */\n    isLineChart: function(chartType) {\n        return chartType === chartConst.CHART_TYPE_LINE;\n    },\n\n    /**\n     * Whether area chart or not.\n     * @memberOf module:predicate\n     * @param {string} chartType chart type\n     * @returns {boolean} result boolean\n     */\n    isAreaChart: function(chartType) {\n        return chartType === chartConst.CHART_TYPE_AREA;\n    },\n\n    /**\n     * Whether line type chart or not.\n     * @memberOf module:predicate\n     * @param {string} chartType chart type\n     * @returns {boolean} result boolean\n     */\n    isLineTypeChart: function(chartType) {\n        return this.isLineChart(chartType) || this.isAreaChart(chartType);\n    },\n\n    /**\n     * Whether pie chart or not.\n     * @memberOf module:predicate\n     * @param {string} chartType chart type\n     * @returns {boolean} result boolean\n     */\n    isPieChart: function(chartType) {\n        return chartType === chartConst.CHART_TYPE_PIE;\n    },\n\n    /**\n     * Whether map chart or not.\n     * @memberOf module:predicate\n     * @param {string} chartType chart type\n     * @returns {boolean} result boolean\n     */\n    isMapChart: function(chartType) {\n        return chartType === chartConst.CHART_TYPE_MAP;\n    },\n\n    /**\n     * Whether mouse position chart or not.\n     * @param {string} chartType chart type\n     * @returns {boolean} result boolean\n     */\n    isMousePositionChart: function(chartType) {\n        return this.isPieChart(chartType) || this.isMapChart(chartType);\n    },\n\n    /**\n     * Whether outer legend align or not.\n     * @memberOf module:predicate\n     * @param {string} align legend type\n     * @returns {boolean} result boolean\n     */\n    isOuterLegendAlign: function(align) {\n        return align === chartConst.LEGEND_ALIGN_OUTER;\n    },\n\n    /**\n     * Whether center legend align or not.\n     * @memberOf module:predicate\n     * @param {string} align legend type\n     * @returns {boolean} result boolean\n     */\n    isCenterLegendAlign: function(align) {\n        return align === chartConst.LEGEND_ALIGN_CENTER;\n    },\n\n    /**\n     * Whether left legend align or not.\n     * @memberOf module:predicate\n     * @param {string} align legend type\n     * @returns {boolean} result boolean\n     */\n    isLeftLegendAlign: function(align) {\n        return align === chartConst.LEGEND_ALIGN_LEFT;\n    },\n\n    /**\n     * Whether top legend align or not.\n     * @memberOf module:predicate\n     * @param {string} align legend type\n     * @returns {boolean} result boolean\n     */\n    isTopLegendAlign: function(align) {\n        return align === chartConst.LEGEND_ALIGN_TOP;\n    },\n\n    /**\n     * Whether bottom legend align or not.\n     * @memberOf module:predicate\n     * @param {string} align legend type\n     * @returns {boolean} result boolean\n     */\n    isBottomLegendAlign: function(align) {\n        return align === chartConst.LEGEND_ALIGN_BOTTOM;\n    },\n\n    /**\n     * Whether horizontal legend align or not.\n     * @param {string} align align\n     * @returns {boolean} result boolean\n     */\n    isHorizontalLegend: function(align) {\n        return this.isTopLegendAlign(align) || this.isBottomLegendAlign(align);\n    },\n\n    /**\n     * Whether legend align of pie chart or not.\n     * @memberOf module:predicate\n     * @param {?string} align chart type\n     * @returns {boolean} result boolean\n     */\n    isPieLegendAlign: function(align) {\n        var result = false;\n        if (align) {\n            result = this.isOuterLegendAlign(align) || this.isCenterLegendAlign(align);\n        }\n        return result;\n    },\n\n    /**\n     * Whether allowed stacked option or not.\n     * @param {string} chartType chart type\n     * @returns {boolean} result boolean\n     */\n    isAllowedStackedOption: function(chartType) {\n        return this.isBarChart(chartType) || this.isColumnChart(chartType) || this.isAreaChart(chartType);\n    },\n\n    /**\n     * Whether normal stacked or not.\n     * @param {boolean} stacked stacked option\n     * @returns {boolean} result boolean\n     */\n    isNormalStacked: function(stacked) {\n        return stacked === chartConst.STACKED_NORMAL_TYPE;\n    },\n\n    /**\n     * Whether percent stacked or not.\n     * @param {boolean} stacked stacked option\n     * @returns {boolean} result boolean\n     */\n    isPercentStacked: function(stacked) {\n        return stacked === chartConst.STACKED_PERCENT_TYPE;\n    },\n\n    /**\n     * Whether valid stacked option or not.\n     * @param {boolean} stacked stacked option\n     * @returns {boolean} result boolean\n     */\n    isValidStackedOption: function(stacked) {\n        return stacked &amp;&amp; (this.isNormalStacked(stacked) || this.isPercentStacked(stacked));\n    }\n};\n\nmodule.exports = predicate;\n</code></pre>\n        </article>\n    </section>\n\n\n\n</div>\n\n"