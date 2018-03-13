tui.util.defineNamespace("fedoc.content", {});
fedoc.content["charts_bubbleChart.js.html"] = "      <div id=\"main\" class=\"main\">\n\n\n\n    \n    <section>\n        <article>\n            <pre class=\"prettyprint source linenums\"><code>/**\n * @fileoverview Bubble chart.\n * @author NHN Ent.\n *         FE Development Lab &lt;dl_javascript@nhnent.com>\n */\n\n'use strict';\n\nvar ChartBase = require('./chartBase');\nvar chartConst = require('../const');\nvar Series = require('../series/bubbleChartSeries');\nvar CircleLegend = require('../legends/circleLegend');\nvar axisTypeMixer = require('./axisTypeMixer');\nvar predicate = require('../helpers/predicate');\nvar SimpleCustomEvent = require('../customEvents/simpleCustomEvent');\n\nvar BubbleChart = tui.util.defineClass(ChartBase, /** @lends BubbleChart.prototype */ {\n    /**\n     * className\n     * @type {string}\n     */\n    className: 'tui-bubble-chart',\n    /**\n     * Bubble chart.\n     * @constructs BubbleChart\n     * @extends ChartBase\n     * @mixes axisTypeMixer\n     * @param {Array.&lt;Array>} rawData raw data\n     * @param {object} theme chart theme\n     * @param {object} options chart options\n     */\n    init: function(rawData, theme, options) {\n        options.tooltip = options.tooltip || {};\n\n        this.axisScaleMakerMap = null;\n\n        if (!options.tooltip.align) {\n            options.tooltip.align = chartConst.TOOLTIP_DEFAULT_ALIGN_OPTION;\n        }\n\n        ChartBase.call(this, {\n            rawData: rawData,\n            theme: theme,\n            options: options,\n            hasAxes: true\n        });\n\n        this._addComponents(options.chartType);\n    },\n\n    /**\n     * Set default options.\n     * @param {object} options - options for bubble chart\n     * @private\n     * @override\n     */\n    _setDefaultOptions: function(options) {\n        ChartBase.prototype._setDefaultOptions.call(this, options);\n        this.options.circleLegend = this.options.circleLegend || {};\n\n        if (tui.util.isUndefined(this.options.circleLegend.visible)) {\n            this.options.circleLegend.visible = true;\n        }\n    },\n\n    /**\n     * Make map for AxisScaleMaker of axes(xAxis, yAxis).\n     * @returns {Object.&lt;string, AxisScaleMaker>}\n     * @private\n     */\n    _makeAxisScaleMakerMap: function() {\n        var hasCategories = this.dataProcessor.hasCategories();\n        var seriesDataModel = this.dataProcessor.getSeriesDataModel(this.chartType);\n        var isXCountGreaterThanYCount = seriesDataModel.isXCountGreaterThanYCount();\n        var options = this.options;\n        var scaleMakerMap = {};\n\n        if (hasCategories) {\n            if (isXCountGreaterThanYCount) {\n                scaleMakerMap.xAxis = this._createAxisScaleMaker(options.xAxis, 'xAxis', 'x');\n            } else {\n                scaleMakerMap.yAxis = this._createAxisScaleMaker(options.yAxis, 'yAxis', 'y', null, {\n                    isVertical: true\n                });\n            }\n        } else {\n            scaleMakerMap.xAxis = this._createAxisScaleMaker(options.xAxis, 'xAxis', 'x');\n            scaleMakerMap.yAxis = this._createAxisScaleMaker(options.yAxis, 'yAxis', 'y', null, {\n                isVertical: true\n            });\n        }\n\n        return scaleMakerMap;\n    },\n\n    /**\n     * Add components\n     * @param {string} chartType chart type\n     * @private\n     */\n    _addComponents: function(chartType) {\n        this._addComponentsForAxisType({\n            chartType: chartType,\n            axis: [\n                {\n                    name: 'yAxis',\n                    isVertical: true\n                },\n                {\n                    name: 'xAxis'\n                }\n            ],\n            series: [\n                {\n                    name: 'bubbleSeries',\n                    SeriesClass: Series\n                }\n            ],\n            plot: true\n        });\n\n        if (this.options.circleLegend.visible) {\n            this.componentManager.register('circleLegend', CircleLegend, {\n                chartType: chartType,\n                baseFontFamily: this.theme.chart.fontFamily\n            });\n        }\n    },\n\n    /**\n     * Update width of legend and series of boundsMaker.\n     * @param {number} seriesWidth - width of series area\n     * @param {number} legendWidth - width of legend area\n     * @private\n     */\n    _updateLegendAndSeriesWidth: function(seriesWidth, legendWidth) {\n        var circleLegendWidth = this.boundsMaker.getDimension('circleLegend').width;\n\n        if (predicate.hasVerticalLegendWidth(this.options.legend)) {\n            this.boundsMaker.registerBaseDimension('legend', {\n                width: circleLegendWidth\n            });\n        }\n\n        this.boundsMaker.registerBaseDimension('series', {\n            width: seriesWidth - (circleLegendWidth - legendWidth)\n        });\n    },\n\n    /**\n     * Update width of legend area by width of circle legend area.\n     * @private\n     */\n    _updateLegendWidthByCircleLegendWidth: function() {\n        var boundsMaker = this.boundsMaker;\n        var axesData = boundsMaker.getAxesData();\n        var circleLegendWidth = boundsMaker.getDimension('circleLegend').width;\n        var legendWidth = boundsMaker.getDimension('calculationLegend').width;\n        var isXAxisLabel, seriesWidth;\n\n        if (legendWidth >= circleLegendWidth) {\n            return;\n        }\n\n        isXAxisLabel = axesData.xAxis.isLabel;\n        seriesWidth = boundsMaker.getDimension('series').width;\n\n        this._updateLegendAndSeriesWidth(seriesWidth, legendWidth);\n\n        if (!isXAxisLabel) {\n            this.axisScaleMakerMap = null;\n            this._registerAxesData();\n        }\n    },\n\n    /**\n     * Update dimensions.\n     * @private\n     * @override\n     */\n    _updateDimensions: function() {\n        if (!this.options.circleLegend.visible) {\n            return;\n        }\n\n        this.componentManager.get('circleLegend').registerCircleLegendDimension();\n        this._updateLegendWidthByCircleLegendWidth();\n    }\n});\n\ntui.util.extend(BubbleChart.prototype, axisTypeMixer);\n\n/**\n * Add data ratios.\n * @private\n * @override\n */\nBubbleChart.prototype._addDataRatios = function() {\n    var scaleMakerMap = this._getAxisScaleMakerMap();\n    var limitMap = {};\n\n    if (scaleMakerMap.xAxis) {\n        limitMap.x = scaleMakerMap.xAxis.getLimit();\n    }\n\n    if (scaleMakerMap.yAxis) {\n        limitMap.y = scaleMakerMap.yAxis.getLimit();\n    }\n\n    this.dataProcessor.addDataRatiosForCoordinateType(this.chartType, limitMap, true);\n};\n\n/**\n * Add custom event component for normal tooltip.\n * @private\n */\nBubbleChart.prototype._attachCustomEvent = function() {\n    var componentManager = this.componentManager;\n    var customEvent = componentManager.get('customEvent');\n    var bubbleSeries = componentManager.get('bubbleSeries');\n    var tooltip = componentManager.get('tooltip');\n\n    axisTypeMixer._attachCustomEvent.call(this);\n\n    customEvent.on({\n        clickBubbleSeries: bubbleSeries.onClickSeries,\n        moveBubbleSeries: bubbleSeries.onMoveSeries\n    }, bubbleSeries);\n\n    bubbleSeries.on({\n        showTooltip: tooltip.onShow,\n        hideTooltip: tooltip.onHide,\n        showTooltipContainer: tooltip.onShowTooltipContainer,\n        hideTooltipContainer: tooltip.onHideTooltipContainer\n    }, tooltip);\n};\n\n/**\n * Add custom event component.\n * @private\n */\nBubbleChart.prototype._addCustomEventComponent = function() {\n    this.componentManager.register('customEvent', SimpleCustomEvent, {\n        chartType: this.chartType\n    });\n};\n\nmodule.exports = BubbleChart;\n</code></pre>\n        </article>\n    </section>\n\n\n\n</div>\n\n"