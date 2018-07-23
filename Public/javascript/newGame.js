function startNewGameVsPC()
{
    var newSessionID = httpGet("/pcGameRequest/newGame");
    sessionStorage.setItem("sessionID",newSessionID);
}

function httpGet(url)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET",url, false );
    xmlHttp.send(null);
    return xmlHttp.responseText;
}