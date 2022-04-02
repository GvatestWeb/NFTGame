document.addEventListener("DOMContentLoaded", function() {
    setTimeout(() => {
        document.querySelector(".preloader").classList.add("faded")
        setTimeout(() => {
            document.querySelector(".preloader").style.display = "none"
        }, 300)
    }, 200)

});
 
 $(() => {
    $('body').flowtype({
        minimum   : 300,
        maximum   : 2560,
        minFont   : 10,
        maxFont   : 50,
        fontRatio : 30
    });

    // Form Submit
    $(document).on('submit','.whitelist-form', function(e) {
      e.preventDefault();
      $(".form_status").addClass("active")
      $(".whitelist_button").attr('disabled', 'true');
      $.ajax({
        type: 'POST',
        url: '/',
        data: {
            wax: $(".whitelist_button.wax-address").text(),
            telegram: $("#telegram").val(),
            twitter: $("#twitter").val(),
            email: $("#email").val(),

        },
        error: () => {
            alert("Server Error")
        }
      })
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
        if (section != null || section != undefined) {
            $([document.documentElement, document.body]).animate({
                scrollTop: $("." + section).offset().top
            }, 0)
        }
    

    // UserName Handle
    let userName = ""
    function handleUser() {
        userName = url.searchParams.get("username")
        if (userName != null || userName != undefined) {
            $(".header-login").remove()
            $("header").append(`<a href="account?name=${userName}"><div class="account-name">${userName}</div></a>`)
            $(".whitelist_button.wax-address").text(userName)
        }
    }
    handleUser()

    // Wax Login
    const wax = new waxjs.WaxJS({
        rpcEndpoint: 'https://wax.greymass.com',
    });


    async function autologin() {
        if (!userName) {
            return await wax.isAutoLoginAvailable()
        } else {
            return false
        }
    }

    autologin().then((message) => {
        if (message) {
            $(".header-login").remove()
            $("header").append(`<a href="account?name=${wax.userAccount}"><div class="account-name">${wax.userAccount}</div></a>`)
            $(".whitelist_button.wax-address").text(userName)
        }
    })

    $(".header-login").on("click", () => {
        if (!userName) {
            wax.login().then(() => {
                $(".header-login").remove()
                $("header").append(`<a href="account?name=${wax.userAccount}"><div class="account-name">${wax.userAccount}</div></a>`)
                window.location = window.location + `account?name=${wax.userAccount}`
            })
        }
    })

    $(".whitelist_button.wax-address").on("click", () => {
        if (!userName) {
            wax.login().then(() => {
                $(".header-login").remove()
                $("header").append(`<a href="account?name=${wax.userAccount}"><div class="account-name">${wax.userAccount}</div></a>`)
                $(".whitelist_button.wax-address").text(wax.userAccount)
            })
        }
    })

 })