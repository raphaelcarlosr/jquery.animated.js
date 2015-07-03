﻿/**
* jQuery animated
* //random in effect
* $("form:first").animated("show" | "hide" | "special" | "[animateClassName]", function(isVisible, className){
*     console.log(this, isVisible, className)
* })
*/
var Animated = function (element, className, callback) {
    var element = this.$element = $(element),
        animatedClass = "animated " + className,
        animationEndEvents = "animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd ", //transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd
        effects = this.effects,
        isShowing = effects.show.contains(className) || effects.special.contains(className) || false;

    //prepare callback
    callback = callback || $.noop;

    if (this.hasCssAnimations()) {
        //trigger start
        this.$element.trigger(
           $.Event('animated.start', {
               "isShowing": isShowing,
               "className": className
           })
        );
        //on animation end
        element.on(animationEndEvents, function () {
            var $this = $(this),
                isVisible = $this.is(':visible');
            //off animation end
            $this.off(animationEndEvents);
            //if showing, remove hide class
            if (!isShowing) { element.addClass("hide").hide(); }
            //remove animatedClass
            element.removeClass(animatedClass);
            //callback
            callback.apply(this, [isVisible, className]);
            //trigger end
            $this.trigger(
               $.Event('animated.end', {
                   "isShowing": isShowing,
                   "className": className
               })
            );
        }).addClass(animatedClass);
        if (isShowing) { element.removeClass("hide").show(); }
    } else {
        if (effects.show.contains(className)) {
            element.fadeIn("slow", function () {
                //callback
                callback.apply(this, [true, "fadeIn"]);
                //trigger
                element.trigger(
                   $.Event('animated.end', {
                       "isShowing": isShowing,
                       "className": className
                   })
                );
            });
        } else if (effects.hide.contains(className)) {
            element.fadeOut("slow", function () {
                //callback
                callback.apply(this, [false, "fadeOut"]);
                //trigger
                element.trigger(
                   $.Event('animated.end', {
                       "isShowing": isShowing,
                       "className": className
                   })
                );
            });
        } else if (effects["attention"].contains(className)) {
            element.shake(1, 5, 50).done(function () {
                //callback
                callback.apply(this, [$(this).is(':visible'), "shake"]);
                //trigger
                element.trigger(
                   $.Event('animated.end', {
                       "isShowing": isShowing,
                       "className": className
                   })
                );
            });
        }
    }
    return this;
};
Animated.prototype.hasCssAnimations = function () {
    if (this._hasCssAnimations !== undefined) return this._hasCssAnimations;

    var animation = false,
        animationstring = 'animation',
        keyframeprefix = '',
        domPrefixes = 'Webkit Moz O ms Khtml'.split(' '),
        pfx = '',
        elm = document.body;

    if (elm.style.animationName !== undefined) { animation = true; }

    if (animation === false) {
        for (var i = 0; i < domPrefixes.length; i++) {
            if (elm.style[domPrefixes[i] + 'AnimationName'] !== undefined) {
                pfx = domPrefixes[i];
                animationstring = pfx + 'Animation';
                keyframeprefix = '-' + pfx.toLowerCase() + '-';
                animation = true;
                break;
            }
        }
    }
    this._hasCssAnimations = animation;
    return animation;
};
Animated.prototype.effects = [
    "flipInX", "flipOutX",
    "flipInY", "flipOutY",
    "fadeIn", "fadeOut",
    "fadeInUp", "fadeOutUp",
    "fadeInDown", "fadeOutDown",
    "fadeInLeft", "fadeOutLeft",
    "fadeInRight", "fadeOutRight",
    "fadeInUpBig", "fadeOutUpBig",
    "fadeInDownBig", "fadeOutDownBig",
    "fadeInLeftBig", "fadeOutLeftBig",
    "fadeInRightBig", "fadeOutRightBig",
    "slideInDown", "slideOutUp",
    "slideInLeft", "slideOutLeft",
    "slideInRight", "slideOutRight",
    "bounceIn", "bounceOut",
    "bounceInDown", "bounceOutDown",
    "bounceInUp", "bounceOutUp",
    "bounceInLeft", "bounceOutLeft",
    "bounceInRight", "bounceOutRight",
    "rotateIn", "rotateOut",
    "rotateInDownLeft", "rotateOutDownLeft",
    "rotateInDownRight", "rotateOutDownRight",
    "rotateInUpLeft", "rotateOutUpLeft",
    "rotateInUpRight", "rotateOutUpRight",
    "lightSpeedIn", "lightSpeedOut",
    "rollIn", "rollOut",
    "zoomIn", "zoomOut",
    "zoomInDown", "zoomOutDown",
    "zoomInLeft", "zoomOutLeft",
    "zoomInRight", "zoomOutRight",
    "zoomInUp", "zoomOutUp",
    "bounce", "flash", "pulse", "rubberBand", "shake", "swing", "tada", "wobble", "hinge", "flip"
];
Animated.prototype.effects.show = Animated.prototype.effects.filter(function (className) {
    return /In/g.test(className) ? className : false;
});
Animated.prototype.effects.hide = Animated.prototype.effects.filter(function (className) {
    return /Out/g.test(className) ? className : false;
});
Animated.prototype.effects.special = Animated.prototype.effects.filter(function (className) {
    return /Out|In/g.test(className) || className === "hinge" ? false : className;
});
$.fn.animated = function (className, callback) {
    return this.each(function () {
        var $this = $(this);
        var data = $this.data('jquery.animated');
        var effects = Animated.prototype.effects;

        if ($.isArray(className)) className = className.random();
        else if (/show/gi.test(className)) className = effects.show.random();
        else if (/hide/gi.test(className)) className = effects.hide.random();
        else if (/special/gi.test(className)) className = effects.special.random();
        else if (effects.contains(className) == false) throw "Invalid class name: " + className;

        //if (!data) $this.data('jquery.animated', (data = new Animated(this, className, callback)));
        $this.data('jquery.animated', (data = new Animated(this, className, callback)));
        //new Animated(this, className, callback);
    })
};
$.fn.animated.Constructor = Animated;
/**
* jQuery shake to unsupported browser animations
*/
$.fn.shake = function (intShakes, intDistance, intDuration) {
    this.each(function () {
        $(this).css("position", "relative");
        for (var x = 1; x <= intShakes; x++) {
            $(this)
                .animate({ left: (intDistance * -1) }, (((intDuration / intShakes) / 4)))
                .animate({ left: intDistance }, ((intDuration / intShakes) / 2))
                .animate({ left: 0 }, (((intDuration / intShakes) / 4)));
        }
    });
    return this;
};