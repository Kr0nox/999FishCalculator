/* eslint-disable prefer-const */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import fishData from '../data/Fish.json';

export function getFishParameters(id: string) {
    if (!fishData[id]){
        return null
    }
    const fishArray = fishData[id].split("/");
    const fishJson = {
        name: fishArray[0],
        difficulty: fishArray[1],
        type: fishArray[2],
        minSize: fishArray[3],
        maxSize: fishArray[4],
        time: fishArray[5].split(" "),
        season: fishArray[6],
        weather: fishArray[7],
        maxDepth: fishArray[9],
        baseRate: fishArray[10],
        depthMultiplier: fishArray[11],
        requiredLevel: fishArray[12]
    }
    return fishJson;
}
  
export function getFishNames() {
    let fishNames: string[] = []
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [index, [key, value]] of Object.entries(Object.entries(fishData))) {
        let fish = value.split("/")
        fishNames.push([key, fish[0]])
    }

    let sortedFishNames = fishNames.sort((a, b) => {
        const nameA = a[1].toLowerCase();
        const nameB = b[1].toLowerCase();
    
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });

    return sortedFishNames;
}

export function getFishIds() {
    return Object.keys(fishData)
}