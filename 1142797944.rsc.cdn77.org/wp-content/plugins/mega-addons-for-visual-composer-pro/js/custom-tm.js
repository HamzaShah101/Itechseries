// Slick Carousal Slider
jQuery(document).on('ready', function() {
    jQuery(".tm-slider").each(function(index, el) {
        var mobiles = jQuery(this).data('mobiles');
        var tabs = jQuery(this).data('tabs');
        var scrolltab = jQuery(this).data('scrolltab');
        var scrollmbl = jQuery(this).data('scrollmbl');
        // console.log(tabs);
        jQuery(this).slick({
            dots: true,
            infinite: true,
            slidesToShow: 1,
            autoplay: true,
            autoplaySpeed: 2000,
            responsive: [{
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: tabs,
                        slidesToScroll: scrolltab,
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: mobiles,
                        slidesToScroll: scrollmbl,
                    }
                }
            ]
        });
    });
});

jQuery(document).on('ready', function() {
    jQuery(".post-slider").each(function(index, el) {
        var mobiles = jQuery(this).data('mobiles');
        var tabs = jQuery(this).data('tabs');
        // console.log(tabs);
        jQuery(this).slick({
            dots: true,
            infinite: true,
            slidesToShow: 1,
            autoplay: true,
            autoplaySpeed: 2000,
            responsive: [{
                    breakpoint: 768,
                    settings: {
                        slidesToShow: tabs,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: mobiles,
                        slidesToScroll: 1
                    }
                }
            ]
        });
    });
});

jQuery(document).ready(function() {
    setTimeout(function() {
        jQuery('.tm-slider.slick-slider .slick-next, .post-slider.slick-slider .slick-next').addClass('fas fa-chevron-right');
        jQuery('.tm-slider.slick-slider .slick-prev, .post-slider.slick-slider .slick-prev').addClass('fas fa-chevron-left');
    }, 300);
});