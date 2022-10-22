const names = require('./names.json') //json with names of players
const fs = require('fs')
const axios = require('axios');
const LOL_KEY = 'api key here'


let arrayOfPuuIds = require('./puuids.json')
let num = 0

timer()
async function timer() {

    let status = await getPuuid(names[num])
    num++
    status && console.log(status);

    if (status == 429) {
        console.log('waiting');
        setTimeout(() => {
            console.log('returning');
            timer()
        }, 1000 * 30 * 1);
    } else {
        timer()
    }


}


async function getPuuid(name) {
    const info = await axios.get(`https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}`,
        { headers: { 'X-Riot-Token': LOL_KEY } }).then(resp => {
            return resp.data
        }).catch((e) => {
            
            console.log(e.response.status);
            return e.response.status


        })
    if (info == 429) {
        return info
    }
    console.log(num);
    console.log(info?.name, info?.puuid);
    info?.puuid && arrayOfPuuIds.push(info.puuid)

    info?.puuid && fs.writeFileSync('./puuids.json', JSON.stringify(arrayOfPuuIds))
}
