window.onload = function() {
    setTimeout(() => {
        document.querySelector(".preloader").classList.add("scrolled")
    }, 100)
}
 
 $(() => {
    $('body').flowtype({
        minimum   : 300,
        maximum   : 2560,
        minFont   : 10,
        maxFont   : 50,
        fontRatio : 30
    });

    // Burger
    $('.menu-icon').click(function(event) {
        event.preventDefault()
        $(this).toggleClass('clicked');
        $(".nav_wrapper").slideToggle()
        $(".blackout").toggleClass("active")
    });

    $("nav").on('click', function (event) {
        event.preventDefault()
        if ($('.menu-icon').hasClass('clicked')) {
            $(".nav_wrapper").slideToggle()
            $(".blackout").toggleClass("active")
            $('.menu-icon').removeClass('clicked')
        }
    })
    
    island = $(".island")
    let observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                island = $(".island_particle")
                island.each((particle) => {
                    $(island[particle]).addClass("anim")
                })
            } else {
                island.each((particle) => {
                    $(island[particle]).removeClass("anim")
                })
            }
        })
    })
    let el = document.querySelector('.island')
    observer.observe(el)

    // Scroll Up
    $(".arrow-up").click(() => {
        $("html, body").animate({ scrollTop: 0 }, "slow");
            return false
    });

    // Scroll To
    $(".nav_item").click(function() {
        $([document.documentElement, document.body]).animate({
            scrollTop: $("." + $(this).attr("id")).offset().top
        }, 1000)
    });

    let url_string = window.location.href,
        url = new URL(url_string),
        section = url.searchParams.get("section")
        if (section != null) {
            $([document.documentElement, document.body]).animate({
                scrollTop: $("." + section).offset().top
            }, 0)
        }

    // Wax Login
    const wax = new waxjs.WaxJS({
        rpcEndpoint: 'https://wax.greymass.com',
    });


    async function autologin() {
        return await wax.isAutoLoginAvailable()
    }

    isAutoLoginAvailable = autologin().then((message) => {
        if (message) {
            $(".header-login").remove()
            $("header").append(`<a href="account"><div class="account-name">${wax.userAccount}</div></a>`)
        }
    })

    $(".header-login").on("click", () => {
        wax.login().then(() => {
            $(".header-login").remove()
            $("header").append(`<a href="account?name=${wax.userAccount}"><div class="account-name">${wax.userAccount}</div></a>`)
            window.location = window.location + `/account?name=${wax.userAccount}`
        })
    })


    // Name Clicked

 })