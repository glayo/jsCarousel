﻿/*
    jsCarousel by Juanma Santoyo, version 1.0.0.
    http://www.juanmasantoyo.es/index.php/jscarousel/
*/

(function ($) {
    var globals =
    {
        settings: null
        , interval: null
        , counter: 0
    }

    var methods =
    {
        // This method inits the jsCarousel
        _init: function (options)
        {
            var _this = this;

            // Extends settings with passed options
            globals.settings = $.extend({
                interval: 1000
                , autoStart: true
                , direction: 1
                , effect: 'simple'
                , effectDuration: 500
                , width: 'auto'
                , height: 'auto'
            }, options);

            return this.each(function ()
            {
                var el = $(this);
                var html = '';
                var lis = $('li', el);

                // Transforms the lis in linked images
                lis.each(function (index)
                {
                    var li = $(this);

                    var data = $('a', li).data();

                    var dataAttrs = '';

                    for(var i in data)
                    {
                        dataAttrs += 'data-' + i + '="' + data[i] + '" ';
                    }

                    // Get the original values
                    var values = {
                        'data' : dataAttrs
                        , 'href': $('a', li).attr('href')
                        , 'title': ($('a', li).attr('title') != undefined) ? $('a', li).attr('title') : ''
                        , 'src': data['image']
                    }

                    // Builds a new li with the values
                    var template = '<li ';
                    template += (index == 0) ? '' : 'style="display: none;"';
                    template += '><a href="{href}" title="{title}" {data}><img alt="{title}" src="{src}" /></a></li>';

                    html += methods._stringFormat(template, values);
                });

                // Sets some CSS to the ul
                el.css({
                    'display': 'block'
                    , 'margin': 0
                    , 'padding': 0
                    , 'width': globals.settings.width
                    , 'height': globals.settings.height
                    , 'border' : 0
                });

                // Applies the generated HTML
                el.html(html);

                // If autostart is enabled, starts the carousel
                if (globals.settings.autostart)
                {
                    methods._start(_this);
                }
            });
        }
        // This method starts the carousel
        , start: function ()
        {
            return methods._start(this);
        }
        , _start: function (_this)
        {
            if($('li', _this).size() > 1)
            {
                globals.interval = window.setInterval(
                    function ()
                    {
                        methods._next(_this);
                    }
                    , globals.settings.interval);
            }

            return _this;
        }
        // This method stops the carousel
        , stop: function (interval)
        {
            return methods._stop(this);
        }
        , _stop: function (_this)
        {
            window.clearInterval(globals.interval);

            return _this;
        }
        // This method moves to the next image
        , next: function ()
        {
            return methods._next(this);
        }
        , _next: function (_this)
        {
            return _this.each(function ()
            {
                var el = $(this);
                var lis = $('li', el);
                var size = lis.size();

                var current = (globals.counter + size) % size;
                globals.counter += globals.settings.direction;
                var next = (globals.counter + size) % size;

                methods._applyEffect(lis, current, next);
            });
        }
        // This method moves to the previous image
        , previous: function ()
        {
            return methods._previous(this)
        }
        , _previous: function (_this)
        {
            globals.settings.direction *= -1;
            methods._next(_this);
            globals.settings.direction *= -1;

            return _this;
        }
        // This method returns the current options, and allows to change the values
        , options: function (opt)
        {
            return methods._options(this, opt);
        }
        , _options: function (_this, opt)
        {
            globals.settings = $.extend(
                globals.settings
                , (opt) ? opt : {});

            // This will reset the interval
            methods._stop(_this);
            methods._start(_this);

            return globals.settings;
        }
        , _stringFormat: function (string, values)
        {
            for (var i in values)
            {
                var expresion = new RegExp('\\{' + (i) + '\\}', 'ig');
                string = string.replace(expresion, values[i]);
            }

            return string;
        }
        , _applyEffect: function (lis, current, next)
        {
            if (globals.settings.effect === 'simple')
            {
                methods._applySimpleEffect(lis, current, next);
            }
            else if (globals.settings.effect === 'fade')
            {
                methods._applyFadeEffect(lis, current, next);
            }
            else if (globals.settings.effect === 'slide')
            {
                methods._applySlideEffect(lis, current, next);
            }
        }
        , _applySimpleEffect: function (lis, current, next)
        {
            $(lis[current]).css(
            {
                'display': 'none'
            });

            $(lis[next]).css(
            {
                'display': 'list-item'
            });
        }
        , _applyFadeEffect: function (lis, current, next)
        {
            $(lis[current]).parent().css({
                'position': 'relative'
            });

            $(lis[current]).css({
                'position': 'absolute'
                , 'top': '0'
                , 'left': '0'
                , 'z-index': '2'
                , 'display': 'list-item'
            });

            $(lis[next]).css({
                'position': 'absolute'
                , 'top': '0'
                , 'left': '0'
                , 'z-index': '1'
                , 'display': 'list-item'
            });

            $(lis[current]).fadeOut(globals.settings.effectDuration);
        }
        , _applySlideEffect: function (lis, current, next)
        {
            $(lis[current]).parent().css({
                'position': 'relative'
            });

            $(lis[current]).css({
                'position': 'absolute'
                , 'top': '0'
                , 'left': '0'
                , 'z-index': '2'
                , 'display': 'list-item'
            });

            $(lis[next]).css({
                'position': 'absolute'
                , 'top': '0'
                , 'left': '0'
                , 'z-index': '1'
                , 'display': 'list-item'
            });

            $(lis[current]).slideUp(globals.settings.effectDuration);
        }
        , _isPublic: function (method)
        {
            return method.charAt(0) != '_';
        }
    }

    $.fn.jsCarousel = function (method)
    {
        // Call the method if exists.
        if (methods[method] && methods._isPublic(method))
        {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        else if (typeof method === 'object' || !method)
        {
            return methods._init.apply(this, arguments);
        }
        else
        {
            $.error('Method ' + method + ' does not exist on jQuery.jsCarousel');
        }
    }
})(jQuery);