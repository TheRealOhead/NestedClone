import * as Things from "./things";
import * as Elements from "./elements";

const thingContainer : HTMLElement = document.getElementById('things') as HTMLElement;
/*
fetch('things.json')
    .then((r : Response) => r.json())
    .then((t: any) : void => {
        Things.ThingInstance.thingDirectory = t;

        Elements.createAtoms(Things.ThingInstance.thingDirectory);

        console.log(Things.ThingInstance.thingDirectory);

        Things.applyInheritances();

        thingContainer.appendChild(new Things.ThingInstance('universe').mainContainer)
    });
*/


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

                console.log(Things.ThingInstance.thingDirectory);

                Things.applyInheritances();

                thingContainer.appendChild(new Things.ThingInstance('universe').mainContainer);

                clearInterval(waitForLoad);
        }
}, 10);
