function getRandomNum()
{
    return Math.floor(Math.random() * 26);
}

function generateID()
{
    let id = "";
    for(let i = 0;i < 5;i++)
    {
        id += String.fromCharCode(97 + getRandomNum());
    }
    return id;
}

for(let i = 0;i < 7;i++)
{
    console.log(generateID());
}