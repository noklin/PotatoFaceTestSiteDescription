(function($) {

    $(function() {

        $('.b-mmenu__toggler').on('click', handleMmenuTogglerClick);
        $('.b-popup__toggler').on('click', handlePopupToggleClick);

        $('.b-sitemap__title').on('click', function(e) {
            var section = $(this).closest('.b-sitemap__section');
            section.find('.b-sitemap__title').toggleClass('b-sitemap__title--active');
            section.find('.b-sitemap__list').toggleClass('b-sitemap__list--active');
        });
        $('[data-scroll]').on('click', scrollMe);
        $(document).on('scroll', function (e) {
            if (window.scrollY > 0) {
                $('.b-menu__login').addClass('b-menu__login--active');
            } else {
                $('.b-menu__login').removeClass('b-menu__login--active');
            }
        });
        $(document).trigger('scroll');

        // Triggers for tasks
        var h = window.location.hash,
            hash = h.substr(1, (h.indexOf('?') != -1) ? (h.indexOf('?') - 1) : h.length );

        if (hash) {
            switch (hash) {
                // Диалоги из приложения
                case 'notify':
                    var q = window.location.search,
                        query = $.parseParams(decodeURI(q.substr(1, q.length)));
                    if (query.message) {
                        var popup = $('.b-popup--notify');
                        popup.toggleClass('active');
                        popup.find('.dynamic-message-title').html('Ошибка');
                        popup.find('.dynamic-message').html(query.message);
                        $('body').toggleClass('owerflow--hidden-desktop');
                    }
                    break;

                // Смена пароля при первом входе
                case 'changepass':
                    var popup = $('.b-popup--changepass');
                    popup.toggleClass('active');
                    $('body').toggleClass('owerflow--hidden-desktop');
                    break;

                // Ввод кода подтверждения
                case 'enterCodeForReset':
                    var popup = $('.b-popup--changepass');
                    popup.toggleClass('active');
                    $('body').toggleClass('owerflow--hidden-desktop');
                    // Set step 2

                    break;
            }
        }
    });

    /**
     * Open or close mobile menu
     *
     * @param e
     */
    function handleMmenuTogglerClick(e) {
        e.preventDefault();
        $('body').toggleClass('owerflow--hidden-mobile');
        $('.b-mmenu, .b-mmenu__toggler').toggleClass('active');
    }

    /**
     * Open or close desktop popups
     *
     * @param e
     */
    function handlePopupToggleClick(e) {
        e.preventDefault();
        var popupId = $(this).attr('data-popup-id') || $(this).closest('.b-popup').attr('data-popup-id');
        var popup = $('.b-popup--' + popupId),
            active = popup.hasClass('active');
        popup.toggleClass('active');
        if (popupId !== 'documents') {
            $('body').toggleClass('owerflow--hidden-desktop');
        }
        if (popupId === 'registration') {
            $('.b-popup--steps').removeClass('active'); // Скрываем окно справки
            showRegisterPage(!active);
        }
    }

    /**
     * Show register-page
     */
    function showRegisterPage(show) {
        if (show) {
            // Помечаем текущие сорсы
            markDom(true);
            $.ajax({ url: 'uniapp?app=guest', success: function(data) {
                $('#remote-pull').html(data);
                var subscriber = setInterval(function(){
                    if ($('.uniapp-frame')[0]) {
                        $('#remote-channel').html($('.uniapp-frame'));
                        $('body').addClass('show-app');
                        clearInterval(subscriber);
                    }
                }, 50);
            }});
        } else {
            window.location = window.location.href;
            markDom(); // Удаляем инджекты
            $('#remote-pull').html('');
            $('#remote-channel').html('');
        }
    }

    /**
     * Метод для переноса нужных элементов из корневого body в попапчик
     */
    function markDom(set) {
        $('head').children().each(function (i,v) {
            if (set) {
                $(v).attr('data-loaded', 'static');
            } else if ($(v).attr('data-loaded') != 'static') {
                $(v).remove();
            }
        });
        $('body').children().each(function (i,v) {
            if (set) {
                $(v).attr('data-loaded', 'static');
            } else if ($(v).attr('data-loaded') != 'static') {
                $(v).remove();
            }
        });
    }


    /**
     * Scroll to zone
     */
    function scrollMe(e) {
        e.preventDefault(e);

        var zone = $(this).attr("data-scroll"),
            isForm = ~zone.indexOf('form');

        // $('html, body').animate({
        //     scrollTop: $('#'+zone).offset().top
        // }, 1000);
        $('html, body').scrollTop = $('#'+zone).offset().top;
        // Set focus when zone is form
        if (isForm)
            window.focusInput('#'+zone);
    }
})(jQuery);