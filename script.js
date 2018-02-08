/*eslint-env browser*/
/*eslint "no-console" : "off"*/
/*global $ data*/
$(document).ready(function () {
    window.addEventListener("load", function () {
        // Set a timeout...
        setTimeout(function () {
            // Hide the address bar!
            window.scrollTo(0, 1);
        }, 0);
    });
    $('#fullpage').fullpage();
    // Create jqxCalendar
    if ($(window).width() > 739) {
        $("#calendar").jqxCalendar({
            width: '390px',
            height: '390px',
            theme: 'black'
        });
        $('#Events').jqxPanel({
            height: '400px',
            width: '400px'
        })


    } else {
        $("#calendar").jqxCalendar({
            width: '220px',
            height: '220px',
            theme: 'black'
        });
        $('#Events').jqxPanel({
            height: '200px',
            width: '320px'
        })
    }

    $('#Events').css('border', 'none');

    $(document).on('click', '#moveSchedule', function () {
        $.fn.fullpage.moveTo(1, 0);
        $('#myNavbar').collapse('hide');
    });
    $(document).on('click', '#moveGames', function () {
        $.fn.fullpage.moveTo(1, 1);
        setTimeout($('#myNavbar').collapse('hide'), 1000);
    });
    $(document).on('click', '#moveRank', function () {
        $.fn.fullpage.moveTo(1, 2);
        $('#myNavbar').collapse('hide');
    });
    $(document).on('click', '#moveChat', function () {
        $.fn.fullpage.moveTo(1, 3);
        $('#myNavbar').collapse('hide');
    });

    $('#fullpage').on('click', function () {

        $('#myNavbar').collapse('hide');
    });
    var matches = data.matches;
    var inf = [];
    var mydate = new Date();
    var str = mydate.getDate() + '/' + (mydate.getMonth() + 1) + '/' + mydate.getFullYear();
    inf = displayMatch(str);
    var dist = displayIt(inf);
    $('#Events').jqxPanel('prepend', dist);
    $(".event_info").on('click', function () {
        var n = parseFloat($(this).attr('data-matchid'));
        populatePopUp(matches, data.locations, n)
    });
    markSpecialDates(matches);





    createTabGames(matches);
    fillTabs(matches, data.teams);

    $(".vsBlock").on('click', function () {
        var n = parseFloat($(this).attr('data-matchid'));
        populatePopUp(matches, data.locations, n)
    });

    ranking(sortArray(data.teams));

    $('#calendar').on('change viewChange', function (event) {
        var date = event.args.date;


        var str = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();

        var info = displayMatch(str);
        var dis = displayIt(info);
        $('#Events').jqxPanel('clearContent');
        if (event.type !== 'viewChange') {

            $('#Events').jqxPanel('prepend', dis);
            var matches = data.matches;
            $(".event_info").on('click', function () {
                var n = parseFloat($(this).attr('data-matchid'));
                populatePopUp(matches, data.locations, n)
            });
        }
    });
    var user = firebase.auth().currentUser;


    if (user) {
        $('#logout').show();
        $('#login').hide();
        console.log(user);

    } else {
        $('#logout').hide();
        $('#login').show();


    }
    getPost();
    document.getElementById("login").addEventListener("click", login);
    document.getElementById("logout").addEventListener("click", logout);


    document.getElementById("create-post").addEventListener("click", writeNewPost);


});



function displayMatch(date) {

    var matchArr = [];
    for (var i = 0; i < data.matches.length; i++) {
        if (data.matches[i].date == date) {
            matchArr.push(data.matches[i]);
        }

    }
    return matchArr;
}

function displayIt(array) {
    var match;
    var id;
    var time;
    var field;
    var display = [];
    if (array.length > 0) {
        for (var i = 0; i < array.length; i++) {
            match = array[i].team1 + ' ' + 'VS' + ' ' + array[i].team2;
            id = array[i].day;
            time = array[i].time;
            field = array[i].location;
            display[i] = '<div class = "event_info" data-matchid =  ' + id + ' style="margin-top: 10px;"  data-toggle = "modal" data-target = "#myModal">' + match + '<br/>' + time + '<br/>' + field + '</div>'
        }

    } else {
        display[0] = '<div class = "event_info" style="margin-top: 10px;"> No events today </div>';
    }

    var display2 = '';
    if (display.length > 1) {
        for (var m = 0; m < display.length; m++) {
            display2 += display[m] + '<br/>';
        }
    } else {
        display2 = display[0];
    }
    return display2;
}

function createTabGames(array) {
    for (var i = 0; i < array.length; i++) {
        var div = $('<div/>').addClass('match_tab');
        $('.games').append(div);
        var team1 = $('<div/>').addClass('team1');
        var vsBlock = $('<button/>').addClass('vsBlock').attr('data-matchid', i).attr('data-toggle', 'modal').attr('data-target', '#myModal');
        var team2 = $('<div/>').addClass('team2');

        $('.match_tab:eq( ' + i + ' )').append(team1);
        $('.match_tab:eq( ' + i + ' )').append(vsBlock);
        $('.match_tab:eq( ' + i + ' )').append(team2);


    }
}

function fillTabs(matches, teams) {
    for (var i = 0; i < matches.length; i++) {

        var date = $('<div/>').addClass('date').text(matches[i].date);
        var time = $('<div/>').addClass('time').text(matches[i].time);
        var vs = $('<div/>').addClass('vs').text('VS');
        var name1 = $('<div/>').addClass('name1').text(matches[i].team1);
        var logo1 = $('<img />').addClass('logo_team1').attr('src', getLogo(matches[i].team1, teams));
        var name2 = $('<div/>').addClass('name2').text(matches[i].team2);
        var logo2 = $('<img />').addClass('logo_team2').attr('src', getLogo(matches[i].team2, teams));


        $('.team1:eq( ' + i + ' )').append(logo1);
        $('.team1:eq( ' + i + ' )').append(name1);
        $('.team2:eq( ' + i + ' )').append(logo2);
        $('.team2:eq( ' + i + ' )').append(name2);
        $('.vsBlock:eq( ' + i + ' )').append(time);
        $('.vsBlock:eq( ' + i + ' )').append(vs);
        $('.vsBlock:eq( ' + i + ' )').append(date);
    }

}

function getLogo(name, teams) {
    var src;
    for (var i = 0; i < teams.length; i++) {
        if (teams[i].name === name) {
            src = teams[i].logo;
        }
    }
    return src;
}

function ranking(array) {
    for (var i = 0; i < array.length; i++) {
        var row = $('<tr/>').addClass('app-row');
        var pos = '';
        switch (i) {
            case 0:
                $(row).addClass('first');
                pos = '1st';
                break;
            case 1:
                $(row).addClass('second');
                pos = '2nd';
                break;
            case 2:
                $(row).addClass('third');
                pos = '3rd';
                break;
            case 3:
                $(row).addClass('fourth');
                pos = '4th';
                break;
            case 4:
                $(row).addClass('fifth');
                pos = '5th';
                break;
            case 5:
                $(row).addClass('sixth');
                pos = '6th';
                break;
            default:
                break;
        }
        $('.table_content').append(row);
        var name = $('<td/>').text(array[i].name);
        var points = $('<td/>').text(array[i].points);
        var position = $('<td/>').text(pos);
        row.append(name);
        row.append(points);
        row.append(position);
    }
}

function sortArray(array) {
    var sortedOnes;
    sortedOnes = array.sort(function (a, b) {
        return b.points - a.points;
    });
    return sortedOnes;
}

function markSpecialDates(array) {
    for (var i = 0; i < array.length; i++) {
        var date1 = new Date();
        var especialDate = array[i].date;
        var currentMonth = date1.getMonth() + 1;
        var fecha = especialDate.split('/');
        currentMonth = currentMonth.toString();
        date1.setDate(fecha[0]);
        if (currentMonth === fecha[1]) {
            $("#calendar").jqxCalendar('addSpecialDate', date1);
        } else {
            date1.setMonth(fecha[1] - 1);
            $("#calendar").jqxCalendar('addSpecialDate', date1);
        }

    }
}

function populatePopUp(matches, locations, n) {
    var loc = matches[n].location;
    $('.modal-title').text(matches[n].team1 + ' ' + 'VS' + ' ' + matches[n].team2);
    $('.modal-body').empty();
    var text = $('<div/>').text(loc);
    var map = '';
    for (var j = 0; j < locations.length; j++) {
        if (loc === locations[j].name) {
            map = $('<iframe/>').addClass('mapLoc').attr('src', locations[j].map);
        }
    }

    $('.modal-body').append(text);
    $('.modal-body').append(map);
}
////////////////////////////////////////////////////////////////////////////////////


function login() {

    var provaider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provaider).then(function () {
        $('#login').hide();
        $('#logout').show();
        getPost();
    });
}

function logout() {
    firebase.auth().signOut().then(function () {
        firebase.database().ref("test").off();

    });
    $('#logout').hide();
    $('#login').show();
}

function writeNewPost() {
    if (firebase.auth().currentUser == null) {
        console.log('fuckkkkk');
        return;
    }
    var userName = firebase.auth().currentUser.displayName;
    var txt = document.getElementById("body").value;

    var postData = {
        title: userName,
        body: txt
    };

    var newPostKey = firebase.database().ref().child("test").push().key;

    var updates = {};
    updates["/test/" + newPostKey] = postData;
    document.getElementById("body").value = '';
    return firebase.database().ref().update(updates);
    scrollRefresh();
}

function getPost() {
    firebase.database().ref("test").on("value", function (data) {
        var user = firebase.auth().currentUser;
        console.log(user);

        if (user) {
            $('#logout').show();
            $('#login').hide();
            console.log(user);

        } else {
            $('#logout').hide();
            $('#login').show();


        }
        var logs = document.getElementById("post");
        logs.innerHTML = "";
        var posts = data.val();

        for (var key in posts) {
            var text = document.createElement("div");
            var name = document.createElement("div");
            var message = document.createElement("div");
            text.className = 'msg';
            var msg_contain = document.createElement("div");
            var element = posts[key];

            name.append(element.title);
            name.className = 'user_name'
            message.append(element.body);
            message.className = 'msg_text';
            text.append(name);
            text.append(message);
            msg_contain.append(text);
            logs.append(msg_contain);
            var me = firebase.auth().currentUser.displayName;
            if (me == element.title) {
                text.className = 'my-msg';
                msg_contain.className = 'mine';
            } else {
                text.className = 'your-msg';
                msg_contain.className = 'yours';
            }

        }
        scrollRefresh();
    });

}

function scrollRefresh() {
    var element = $("#post");
    element.animate({
        scrollTop: element.prop("scrollHeight")
    }, 1000);
}
