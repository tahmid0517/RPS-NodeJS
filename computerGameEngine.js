var readline = require('readline');
var fs = require('fs');
var promise = require('promise');

module.exports =
{
    getRandomChoice: function ()
    {
        return Math.floor(Math.random() * 2);
    },
    
    getNewSessionID: async function ()
    {
        var newID = this.generateRandomID();
        var promise = await this.doesSessionIDExist(newID);
        while(promise)
        {
            newID = this.generateRandomID();
            promise = await this.doesSessionIDExist(newID);
        }
        this.addNewSession(newID);
        return newID;
    },
    
    generateRandomID: function ()
    {
        let id = "";
        for(let i = 0;i < 5;i++)
        {
            var character = String.fromCharCode(97 + (Math.floor(Math.random() * 26)));
            id += character;
        }
        return id;
    },

    addNewSession: function (id)
    {
        fs.appendFile("./Data/vsComputerGameSessionIDs.txt","\n" + id,function (err)
        {
            if(err)
            {
                console.log("There was an error appending to the session ID list file.");
            }
        });
        fs.appendFile("./Data/scoresVsComputer.txt","\n" + id + "!0!0",function (err)
        {
            if(err)
            {
                console.log("There was an error appending to the scores data file.");
            }
        });
    },

    doesSessionIDExist: function (id)
    {
        var lineReader = readline.createInterface({input: fs.createReadStream('./Data/vsComputerGameSessionIDs.txt')});
        let doesExist;
        lineReader.on('line',function (line)
        {
            if(id == line)
            {
                doesExist = true;
            }
        });
        return new Promise(function (resolve,reject)
        {
            lineReader.on('close',function ()
            {
                if(doesExist == null)
                {
                    doesExist = false;
                }
                resolve(doesExist);
            });
        })
    },

    getGameData: function(id)
    {
        var lineReader = readline.createInterface({input: fs.createReadStream('./Data/scoresVsComputer.txt')});
        return new Promise(function (resolve,reject)
        {
            lineReader.on('line',function (line)
            {
                if(line.split("!")[0] == id)
                {
                    resolve(line);
                }
            });
        });
    }
};