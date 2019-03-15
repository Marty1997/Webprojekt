
//Scroll with transparent navbar
window.addEventListener("scroll", function () {
    if ($(document).scrollTop() > 50) {
        $(".navbar-fixed-top").css("background-color", "#f8f8f8");
        $(".navbar-fixed-top").css("transition", "background-color 300ms linear");
    }
    else {
        $(".navbar-fixed-top").css("background-color", "transparent");
        $(".navbar-fixed-top").css("transition", "background-color 300ms linear");
    }
});

//Smooth scroll animation
$(document).on('click', 'a[href^="#"]', function (event) {
    event.preventDefault();

    $('html, body').animate({
        scrollTop: $($.attr(this, 'href')).offset().top
    }, 500);
});


//Collapse navbar in mobile
$('.navbar-collapse a').click(function () {
    $(".navbar-collapse").collapse('hide');
});

//Loginbutton hide frontpage text and buttons
$('#loginButton').click(function () {
    $('#frontPageText').hide();
    $('#buttonDiv').hide();
});

//Registerbutton hide frontpage text and buttons
$('#registerButton').click(function () {
    $('#frontPageText').hide();
    $('#buttonDiv').hide();
});

//Reset frontpage after quitting login modal view
$('#loginModal').on('hidden.bs.modal', function () {
    $('#frontPageText').show();
    $('#buttonDiv').show();
    $('#playerLoginBox').hide();
    $('#clubLoginBox').hide();
    $('#chooseLogin').show();
    $('.modal-dialog').width(600);
});

//Reset frontpage after quitting register modal view
$('#registerModal').on('hidden.bs.modal', function () {
    $('#frontPageText').show();
    $('#buttonDiv').show();
    $('#chooseRegister').show();
    $('.modal-dialog').width(600);
});

//Show player login box
$('#playerLogin').click(function () {
    $('#chooseLogin').hide();
    $('#playerLoginBox').show();
    $('.modal-dialog').width(343);
});

//Show club login box
$('#clubLogin').click(function () {
    $('#chooseLogin').hide();
    $('#clubLoginBox').show();
    $('.modal-dialog').width(343);
});