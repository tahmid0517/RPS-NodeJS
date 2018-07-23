var http = require('http');
var fs = require('fs');
var computerEngine = require('./computerGameEngine');

const PORT = 3200;
const isOnActualServer = false;

http.createServer(onRequest).listen(PORT);
console.log('Starting server on port 3200...');

var serverPath = ".";
if(isOnActualServer)
{
    serverPath = "/home/tahmid0517/RPS_Server";
}

function onRequest(request,response)
{
    var requestArray = request.url.split("/");
    var firstPartOfRequestURL = requestArray[1].replace(/\s+/, "");
    if(firstPartOfRequestURL == "")
    {
        sendHTMLData(response,"index");
        console.log("Sending client to home page...");
    }
    else if(firstPartOfRequestURL == "page")
    {
        console.log("Client is requesting a particular page...");
        var page = requestArray[2];
        sendHTMLData(response,page);
        console.log("Sent HTML data to client.");
    }
    else if(firstPartOfRequestURL == "js")
    {
        console.log("Client is requesting Javascript data...");
        var scriptName = requestArray[2];
        sendJSData(response,scriptName);
        console.log("Sent Javascript data to client.");
    }
    else if(firstPartOfRequestURL == "img")
    {
        var extension = requestArray[2];
        var imgName = requestArray[3];
        console.log("Client is requesting image data: " + imgName + "...");
        sendImageData(response,imgName,extension);
        console.log("Sent image data to client.");
    }
    else if(firstPartOfRequestURL == "css")
    {
        var fileName = requestArray[2];
        console.log("Client request CSS data...");
        sendCSSData(response,fileName);
        console.log("Sent CSS data to client.");
    }
    else if(firstPartOfRequestURL == "pcGameRequest")
    {
        console.log("Handling PC game request...");
        handlePCGameRequest(requestArray,response);
    }
    else
    {
        console.log("Sending 404 reponse...");
        send404Response(response);
    }
}

function sendHTMLData(response,page)
{
    response.writeHead(200,getTextContentType("html"));
    fs.createReadStream(serverPath + "/Public/views/" + page + ".html").pipe(response);
}

function sendJSData(response,script) 
{
    response.writeHead(200,getTextContentType("javascript"));
    fs.createReadStream(serverPath + "/Public/javascript/" + script + ".js").pipe(response);
}

function sendImageData(response,imageName,extension)
{
    fs.readFile(serverPath + "/Public/images/" + imageName + "." + extension,function(err,content)
    {
        if(err)
        {
            response.writeHead(400,getTextContentType("plain"));
            response.end("NO SUCH IMAGE FOUND");
            console.log("Image was not found.");
        }
        else
        {
            response.writeHead(200,{"Content-Type": "image/" + extension});
            response.end(content);
            console.log("Image send was successful.");
        }
    });
}

function sendCSSData(response,cssFile)
{
    response.writeHead(200,getTextContentType("css"));
    fs.createReadStream(serverPath + "/Public/css/" + cssFile + ".css").pipe(response);
}

async function handlePCGameRequest(requestArray,response)
{
    response.writeHead(200,getTextContentType("text/plain"));
    if(requestArray[2] == "loadGame")
    {
        console.log("User wants to load a game against the computer...");
        var promise = await computerEngine.doesSessionIDExist(requestArray[3]);
        //Response for if session ID exist. Returns game data if valid ID. -1 if not.
        if(promise == true)
        {
            var gameData = await computerEngine.getGameData(requestArray[3]);
            response.write(gameData);
        }
        else if(promise == false)
        {
            response.write("-1");
        }
    }
    else if(requestArray[2] == "newGame")
    {
        console.log("User wants to start a new game against the computer...");
        var newSessionID = await computerEngine.getNewSessionID();
        response.write(newSessionID);
    }
    else if(requestArray[2] == "getRandChoice")
    {
        console.log("User is requesting a random choice from the server...");
        var randChoice = computerEngine.getRandomChoice();
        console.log("Sending user Choice: " + randChoice);
        response.write(randChoice.toString());
    }
    else if(requestArray[2] == "getScore")
    {
        console.log("User is requesting score for a game...");
        var scoreData = computerEngine.getGameData(requestArray[3]);
        response.write(scoreData);
    }
    response.end();
}

function send404Response(response)
{
    response.writeHead(404,getTextContentType("text/plain"));
    response.write("Content wasn't found. Maybe you typed in the wrong address?");
    response.end();
}

function getTextContentType(type)
{
    return {"Content-Type": "text/" + type};
}



