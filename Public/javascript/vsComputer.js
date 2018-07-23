onload = function()
{
    var sessionID = sessionStorage.getItem("sessionID");
    document.getElementById("sessionID").innerHTML += " " + sessionID;
    document.getElementById("userChoiceClock").innerHTML = timeLeft;
    document.getElementById("submitBtn").style.visibility = "hidden";
    window.alert("Your session ID is " + sessionID + ". Remember it if you ever want to continue this game.");
}

var rockImg = 
{
    src: "/img/png/rock",
    styleForUser: "position:absolute;left:21%;top:35%",
    styleForComputer: "position:absolute;left:60%;top:35%",
    width: "20%;"
};

var paperImg = 
{
    src: "/img/png/paper",
    styleForUser: "position:absolute;left:23%;top:24%",
    styleForComputer: "position:absolute;left:60%;top:24%",
    width: "20%;"
};

var scissorsImg =
{
    src: "/img/png/scissors",
    styleForUser: "position:absolute;left:21%;top:35%",
    styleForComputer: "position:absolute;left:60%;top:35%",
    width: "20%;"
};

const ROCK = 0;
const PAPER = 1;
const SCISSORS = 2;
let currentUserSelection = -1;
function setUserSelection(selection)
{
    currentUserSelection = selection;
    if(selection == ROCK)
    {
        document.getElementById("messageToUser").innerHTML = "Choosing ROCK in:";
        var img = document.getElementById("userSelectionImg");
        img.setAttribute("src",rockImg.src);
        img.setAttribute("style",rockImg.styleForUser);
        img.setAttribute("width",rockImg.width);
    }
    else if(selection == PAPER)
    {
        document.getElementById("messageToUser").innerHTML = "Choosing PAPER in:";
        var img = document.getElementById("userSelectionImg");
        img.setAttribute("src",paperImg.src);
        img.setAttribute("style",paperImg.styleForUser);
        img.setAttribute("width",paperImg.width);
    }
    else if(selection == SCISSORS)
    {
        document.getElementById("messageToUser").innerHTML = "Choosing SCISSORS in:";
        var img = document.getElementById("userSelectionImg");
        img.setAttribute("src",scissorsImg.src);
        img.setAttribute("style",scissorsImg.styleForUser);
        img.setAttribute("width",scissorsImg.width);
    }
    document.getElementById("submitBtn").style.visibility = "visible";
}

let currentComputerSelection = -1;
function setComputerSelection(selection)
{
    currentComputerSelection = selection;
    console.log(selection);
    if(selection == ROCK)
    {
        var img = document.getElementById("computerSelectionImg");
        img.setAttribute("src",rockImg.src);
        img.setAttribute("style",rockImg.styleForComputer);
        img.setAttribute("width",rockImg.width);
    }
    else if(selection == PAPER)
    {
        var img = document.getElementById("computerSelectionImg");
        img.setAttribute("src",paperImg.src);
        img.setAttribute("style",paperImg.styleForComputer);
        img.setAttribute("width",paperImg.width);
    }
    else if(selection == SCISSORS)
    {
        var img = document.getElementById("computerSelectionImg");
        img.setAttribute("src",scissorsImg.src);
        img.setAttribute("style",scissorsImg.styleForComputer);
        img.setAttribute("width",scissorsImg.width);
    }
}

const TIME_LIMIT = 5;
let timeLeft = TIME_LIMIT;
function updateUserChoiceClock()
{
    timeLeft--;
    document.getElementById("userChoiceClock").innerHTML = timeLeft;
    if(timeLeft == 0)
    {
        playChoices();
    }
}
let updateClockCmd = setInterval(updateUserChoiceClock,1000);

function playChoices()
{
    document.getElementById("userChoiceClock").innerHTML = 0;
    clearInterval(updateClockCmd);
    var randChoice = httpGet("/pcGameRequest/getRandChoice");
    console.log(randChoice);
    setComputerSelection(parseInt(randChoice));
    let mssg = "";
    if(currentUserSelection == -1)
    {
        mssg += "You ran out of time.<br>You LOSE!";
    }
    else if(currentComputerSelection == 0)
    {
        mssg += "The computer chose ROCK.<br>";
        if(currentUserSelection == 0)
            mssg += "It's a DRAW!";
        else if(currentUserSelection == 1)
            mssg += "You WIN!";
        else if(currentUserSelection == 2)
            mssg += "You LOSE!";
    }
    else if(currentComputerSelection == 1)
    {
        mssg += "The computer chose PAPER.<br>";
        if(currentUserSelection == 0)
            mssg += "You LOSE!";
        else if(currentUserSelection == 1)
            mssg += "It's a DRAW!";
        else if(currentUserSelection == 2)
            mssg += "You WIN!";
    }
    else if(currentComputerSelection == 2)
    {
        mssg += "The computer chose SCISSORS.<br>";
        if(currentUserSelection == 0)
            mssg += "You WIN!";
        else if(currentUserSelection == 1)
            mssg += "You LOSE!";
        else if(currentUserSelection == 2)
            mssg += "It's a DRAW!";
    }
    document.getElementById("resultDisplay").innerHTML = mssg;
    setTimeout(reset,3000);
}

function resetClock()
{
    document.getElementById("messageToUser").innerHTML = "Please make your selection in: ";
    timeLeft = TIME_LIMIT + 1;
    updateClockCmd = setInterval(updateUserChoiceClock,1000);
}
function reset()
{
    resetClock();
    document.getElementById("userSelectionImg").setAttribute("src","");
    document.getElementById("computerSelectionImg").setAttribute("src","");
    document.getElementById("resultDisplay").innerHTML = "";
    currentUserSelection = -1;
    currentComputerSelection = -1;
}

function loadScore(sessionID)
{
    //var scoreData = httpGet("/pcGameRequest/getScore/")
}

function httpGet(url)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET",url,false);
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

