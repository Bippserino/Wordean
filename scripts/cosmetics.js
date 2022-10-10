var logo, 
    logoWrapper,
    logoText,
    logoTextH1,
    logoTextH2,
    logoWidth,
    scrollThreshold,
    fontSize,
    container,
    logoMaxHeight,
    yPos,
    YPer,
    logoSize

function mimicLogo() {
    $(".invisible-button").css({
        width: $(".logo img").width() + "px",
        height: $(".logo img").height() + "px",
        left: $(".logo img").offset().left + "px",
        top: $(".logo img").offset().top + "px",
    })
}

function toggleScale() {
    $(".play-wrapper").toggleClass("scale-up-big box-shadow-down")
}

function updateVariables() {
    logoWidth = logoWrapper.width(),
    scrollThreshold = window.innerHeight/2,
    fontSize = parseInt((logoTextH1.css("font-size")).slice(0,-2), 10),
    logoMaxHeight = 0.1 * window.innerHeight
}

function changeCopyrightYear() {
    $(".copyright span").html((new Date()).getFullYear())
}

$(document).ready(() => {
    yPos = 0,
    YPer = 0
    logo = $(".logo"),
    logoWrapper = $(".logo-wrapper"),
    logoText = $(".logo-text"),
    logoTextH1 = $(".logo-text h1"),
    logoTextH2 = $(".logo-text h2"),
    container = $(".container"),

    
    changeCopyrightYear()
    updateVariables()
    mimicLogo()
        
    $(".play-link").hover(() => {
        toggleScale()
    })

    container.scroll(() => {
        mimicLogo()
        yPos = container.scrollTop(),
        yPer = (yPos / scrollThreshold)

        if (yPer > 1) {
            yPer = 1
            logoWrapper.css("max-width","10vh")
            $(".logo img").attr("src","img/logo.svg")
        }

        else {
            logoWrapper.css("max-width","40vh")
            $(".logo img").attr("src","img/logo-favicon.svg")
        }

        var logoPosTop = ( 50 - yPer * 48),
            logoSize = 1 - (0.6 * yPer),
            relativeFontSizeH1 = fontSize * (1 - yPer),
            relativeFontSizeH2 = 0.67 * fontSize * (1 - yPer)


        logo.css({
            top: `${logoPosTop}%`,
            transform: `translate(-50%, -${logoPosTop}%`,
        });

        logoWrapper.css("width", `${logoSize * 0.3 * window.innerWidth}px`)

        logoText.css("opacity", 1 - yPer)

        logoTextH1.css("font-size", relativeFontSizeH1 + "px")
        logoTextH2.css("font-size", relativeFontSizeH2 + "px")
    });

    $(window).resize(() => {
        yPos = container.scrollTop(),
        yPer = (yPos / scrollThreshold)
        scrollThreshold = window.innerHeight/2
        logoSize = 1 - (0.6 * yPer)
        logoWrapper.css("width", `${logoSize * 0.3 * window.innerWidth}px`)
        mimicLogo() 

    })
})
