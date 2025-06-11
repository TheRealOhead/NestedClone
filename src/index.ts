import * as Things from "./things";
import * as Elements from "./elements";
import {ThingID} from './things';

const thingContainer : HTMLElement = document.getElementById('things') as HTMLElement;

let waitingOn : number = 0;

[
    'things/cosmos.json',
    'things/earthlike.json',
    'things/life.json'
].forEach((fileName : string) : void => {
        waitingOn++;
        const filePromise : Promise<any> = fetch(fileName);
        filePromise
            .then((r : Response) => r.json())
            .then((t : any) : void => {
                Object.assign(Things.ThingInstance.thingDirectory, t);
                waitingOn--;
            });
});

const waitForLoad = setInterval(() : void => {
        if (waitingOn == 0) {

            Elements.createAtoms(Things.ThingInstance.thingDirectory);

            Things.applyInheritances();

            console.log(Things.ThingInstance.thingDirectory);

            const startThing : ThingID = new URLSearchParams(window.location.search).get('start') || 'universe';

            thingContainer.appendChild(new Things.ThingInstance(startThing).mainContainer);

            clearInterval(waitForLoad);
        }
}, 10);
