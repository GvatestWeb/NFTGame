$(() => {
    $('body').flowtype({
        minimum   : 300,
        maximum   : 2560,
        minFont   : 10,
        maxFont   : 50,
        fontRatio : 30
    });

    // Nav Redirect
    $(".nav_item").click(function() {
        window.location = "/home?section=" + $(this).attr("id") + ""
    });

    // Filters
    filterItems = $(".filter_item")
    filterItems.click((event) => {
        filterItems.each((item) => {
            $(filterItems[item]).removeClass("active")
        })
        $(event.target).addClass("active")
    })

    // Arrow
    $(".arrow-up").click(() => {
        $("html, body").animate({ scrollTop: 0 }, "slow");
    });

    // Nav
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

    if (window.innerWidth <= 870) {
        step = 2
    } else {
        step = 4
    }

    let url_string = window.location.href,
        url = new URL(url_string),
        userName = url.searchParams.get("name")

    
    function makeObserver() {
        let imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                let image = entry.target.children[0].children[0]
                image.src = image.dataset.src
                entry.target.classList.remove("lazy")
                if (image.tagName != "VIDEO") {
                    image.onload = function() {
                        if (entry.target.children[0].children[1]) {
                            entry.target.children[0].children[1].remove()
                            image.style.display = "block"
                        }
                    }
                } else {
                    if (entry.target.children[0].children[1]) {
                        entry.target.children[0].children[1].remove()
                    }
                }
                imageObserver.unobserve(entry.target)
            }
            })
        })

        lazyloadImages = document.querySelectorAll(".lazy")
        lazyloadImages.forEach(function(image) {
            imageObserver.observe(image);
        })
    }


    function pushNft(template, data, interval, schemaName) {
            setTimeout(() => {
                templateID = template["template_id"]
                fetch(`https://wax.api.atomicassets.io/atomicassets/v1/templates/popitgameccg/${templateID}`).then(response => response.json())
            .then(templateData => {
                schemaName = templateData["data"]["schema"]["schema_name"]
                if (!schema || schemaName == schema) {
                    if (templateData["data"]["immutable_data"]["video"] == undefined) {
                        content = templateData["data"]["immutable_data"]["img"]
                        htmlData.push(`<div class="nft lazy">
                                        <a target="blank" href="https://wax.atomichub.io/explorer/template/popitgameccg/${templateData["data"]["template_id"]}">
                                            <img data-src="https://ipfs.io/ipfs/${content}">
                                            <?xml version="1.0" encoding="utf-8"?>
                                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; background: none; display: block; shape-rendering: auto; animation-play-state: running; animation-delay: 0s;" width="200px" height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
                                            <path d="M10 50A40 40 0 0 0 90 50A40 42 0 0 1 10 50" fill="#e15b64" stroke="none" style="animation-play-state: running; animation-delay: 0s;">
                                            <animateTransform attributeName="transform" type="rotate" dur="1s" repeatCount="indefinite" keyTimes="0;1" values="0 50 51;360 50 51" style="animation-play-state: running; animation-delay: 0s;"></animateTransform>
                                            </path></svg>
                                        </a>
                                    </div>
                                `)
                    } else {
                        content = templateData["data"]["immutable_data"]["video"]
                        htmlData.push(`<div class="nft lazy">
                                        <a target="blank" href="https://wax.atomichub.io/explorer/template/popitgameccg/${templateData["data"]["template_id"]}">
                                            <video preload="auto" no-controls="" autoplay="" loop="" playsinline="" muted="" data-src="https://ipfs.io/ipfs/${content}"></video>
                                        </a>
                                    </div>
                                `)
                    }
                } else {
                    sorter ++
                }
                if (htmlData.length != 0) {
                    if (data["data"]["templates"].length < 30) {
                        dataLength = data["data"]["templates"].length
                    } else {
                        dataLength = 30
                    }
                    if (htmlData.length == dataLength - sorter) {
                        $(".nfts-wrapper").empty()
                        $(".nfts-wrapper").append(htmlData.join(" "))
                        makeObserver()
                    }
                } else {
                    $(".nfts-wrapper").empty()
                    $(".nfts-wrapper").append("<h2 style='color: #fff; font-size: 3em;'>No NFTs Found</h2>")
                }
            })
            }, interval)
    }
    
    function getNfts(schema="") {
        htmlData = [],
        sorter = 0
        $(".nfts-wrapper").empty()
        $(".nfts-wrapper").append('<?xml version="1.0" encoding="utf-8"?><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; background: none; display: block; shape-rendering: auto; animation-play-state: running; animation-delay: 0s;" width="200px" height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"><path d="M10 50A40 40 0 0 0 90 50A40 42 0 0 1 10 50" fill="#e15b64" stroke="none" style="animation-play-state: running; animation-delay: 0s;"><animateTransform attributeName="transform" type="rotate" dur="1s" repeatCount="indefinite" keyTimes="0;1" values="0 50 51;360 50 51" style="animation-play-state: running; animation-delay: 0s;"></animateTransform></path></svg>')
        // https://wax.api.atomicassets.io/atomicassets/v1/accounts/${userName}/popitgameccg
        fetch(`https://wax.api.atomicassets.io/atomicassets/v1/accounts/${userName}/popitgameccg`)
        .then(response => response.json())
        .then(data => {
            interval = 100
            data["data"]["templates"].forEach((template) => {
                if (interval <= 3000) {
                    pushNft(template, data, interval, schema)
                    interval += 100
                }       
            })
        })
    }
    

    getNfts(schema="")
    $(".filter_item").click((elem) => {
        schemaName = elem.target.dataset.schema
        getNfts(schema=schemaName)
    })
})