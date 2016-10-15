(function() {
    'use strict';

    angular
        .module('app.widgets')
        .directive('widgetWeather', widgetWeather)
        .controller('WidgetSettingsCtrl-weather', WidgetSettingsCtrlWeather)
        .config(function (WidgetsProvider) { 
            WidgetsProvider.$get().registerType({
                type: 'weather',
                displayName: 'Weather',
                description: 'A weather widget - displays the value of an openHAB item'
            });
        });

    /**
     * Map used for transforming plain weather condition
     * to specific icon from climacons collection
     * @type {Object}
     */
    var iconMap = {
        'thunder'                  : 'cloudLightning',
        'storm'                    : 'cloudLightningFill',
        'rain-and-snow'            : 'cloudHailAltFill',
        'rain-and-sleet'           : 'cloudDrizzleAlt',
        'snow-and-sleet'           : 'cloudDrizzleFill',
        'freezing-drizzle'         : 'cloudSnowFill',
        'few-showers'              : 'cloudRainSun',
        'freezing-rain'            : 'cloudRainAlt',
        'rain'                     : 'cloudRain',
        'snow-flurries'            : 'cloudSnowSunAlt',
        'light-snow'               : 'cloudSnowAlt',
        'blowing-snow'             : 'cloudHailAltFill',
        'snow'                     : 'cloudSnowAltFill',
        'sleet'                    : 'cloudHailAlt',
        'dust'                     : 'cloudFogAlt',
        'fog'                      : 'cloudFogSunFill',
        'wind'                     : 'wind',
        'cold'                     : 'cloudSnowAltFill',
        'cloudy'                   : 'cloudFill',
        'mostly-cloudy-night'      : 'cloudMoonFill',
        'mostly-cloudy-day'        : 'cloudSunFill',
        'partly-cloudy-night'      : 'cloudMoon',
        'partly-cloudy-day'        : 'cloudSun',
        'clear-night'              : 'moonFill',
        'sunny'                    : 'sun',
        'hot'                      : 'sunFill',
        'scattered-thunder'        : 'tornado',
        'scattered-showers'        : 'cloudDrizzleAlt',
        'thundershowers'           : 'cloudRainMoon',
        'snow-showers'             : 'cloudHailAltFill',
        'scattered-thundershowers' : 'cloudRainFill',
        'unknown'                  : 'cloud',
    }

    widgetWeather.$inject = ['$rootScope', '$uibModal', 'OHService'];
    function widgetWeather($rootScope, $modal, OHService) {
        var directive = {
            bindToController: true,
            controller      : WeatherController,
            controllerAs    : 'vm',
            link            : link,
            restrict        : 'AE',
            templateUrl     : 'app/widgets/weather/weather.tpl.html',
            scope: {
                ngModel: '='
            }
        };
        return directive;
        
        function link(scope, element, attrs) {
        }
    }
    WeatherController.$inject = ['$rootScope', '$scope', '$filter', 'OHService'];
    function WeatherController ($rootScope, $scope, $filter, OHService) {
        var vm = this;
        this.widget = this.ngModel;

        function updateValue() {
            var item = OHService.getItem(vm.widget.temperatureItem);
            if (!item) {
                vm.value = "N/A";
                return;
            }
            var value = item.state;

            if (vm.widget.useserverformat && item.stateDescription && item.stateDescription.pattern)
                value = sprintf(item.stateDescription.pattern, value);
            vm.value = value; //iconMap[value];
        }

        OHService.onUpdate($scope, vm.widget.temperatureItem, function () {
            updateValue();
        });

    }


    // settings dialog
    WidgetSettingsCtrlWeather.$inject = ['$scope', '$timeout', '$rootScope', '$uibModalInstance', 'widget', 'OHService'];

    function WidgetSettingsCtrlWeather($scope, $timeout, $rootScope, $modalInstance, widget, OHService) {
        $scope.widget = widget;
        $scope.items = OHService.getItems();

        $scope.form = {
            name              : widget.name,
            sizeX             : widget.sizeX,
            sizeY             : widget.sizeY,
            col               : widget.col,
            row               : widget.row,
            conditionItem     : widget.conditionItem,
            temperatureItem   : widget.temperatureItem,
            precipitationItem : widget.precipitationItem,
            humidityItem      : widget.humidityItem,
            windSpeedItem     : widget.windSpeedItem,
            windDirectionItem : widget.windSpeedItem,
            dewpointItem      : widget.dewpointItem,
            pressureItem      : widget.pressureItem,
            visibilityItem    : widget.visibilityItem,
            // background     : widget.background,
            // foreground     : widget.foreground,
            font_size         : widget.font_size,
            nolinebreak       : widget.nolinebreak,
            unit              : widget.unit,
            format            : widget.format,
            useserverformat   : widget.useserverformat,
            backdrop_iconset  : widget.backdrop_iconset,
            backdrop_icon     : widget.backdrop_icon,
            backdrop_center   : widget.backdrop_center,
            iconset           : widget.iconset,
            icon              : widget.icon,
            icon_size         : widget.icon_size,
            icon_nolinebreak  : widget.icon_nolinebreak,
            icon_replacestext : widget.icon_replacestext
        };

        $scope.dismiss = function() {
            $modalInstance.dismiss();
        };

        $scope.remove = function() {
            $scope.dashboard.widgets.splice($scope.dashboard.widgets.indexOf(widget), 1);
            $modalInstance.close();
        };

        $scope.submit = function() {
            angular.extend(widget, $scope.form);

            $modalInstance.close(widget);
        };
    }
})();
