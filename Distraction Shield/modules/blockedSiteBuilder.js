import {getUrlFromServer} from "./urlFormatter"
import BlockedSite from "../classes/BlockedSite"
import {addBlockedSiteToStorage} from "./storage/storageModifier"

/**
 * Constructs a new blockedSite instance using the given url, and passes it on using a promise
 * The only real right way of creating a new blocked site. For this it uses the BlockedSite and the urlFormatter.
 * It also adds it to the current list of blockedSites.
 * @param {string} newUrl the unformatted url of which to construct a BlockedSite
 */
export function createNewBlockedSite(newUrl) {
    return new Promise((resolve, reject) => {
        getUrlFromServer(newUrl, (url, title) => {
            let blockedSite = new BlockedSite(url, title);
            resolve(blockedSite);
        }, (errorMessage) => { reject(errorMessage); });
    });
}

export function createBlockedSiteAndAddToStorage(newUrl) {
    return new Promise((resolve, reject) => {
        createNewBlockedSite(newUrl)
            .then((blockedSite) => {
                return addBlockedSiteToStorage(blockedSite)
                    .catch(error => {
                        reject(error)
                    })
            })
            .catch(error => {
                reject(error)
            });
    });
}
