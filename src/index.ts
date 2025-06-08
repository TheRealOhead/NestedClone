const thingContainer : HTMLElement = document.getElementById('things') as HTMLElement;

function chooseIntegerInRange(range : number[]) : number {
    return Math.floor(Math.random() * range[1] + range[0]);
}

function chooseFromArray<Type>(array : Type[]) : Type {
    return array[chooseIntegerInRange([0, array.length - 1])];
}

/**
 * An instance of a thing. Contains fields and methods relating to HTML functionality
 */
class ThingInstance {
    readonly mainContainer : HTMLElement = document.createElement('div');
    readonly clickable : HTMLElement = document.createElement('div');
    readonly icon : HTMLImageElement = document.createElement('img');
    readonly label : HTMLElement = document.createElement('span');
    readonly children : HTMLElement = document.createElement('div');

    readonly thingEntry : ThingEntry;

    expanded : boolean = false;
    hasGeneratedChildren : boolean = false;

    public static clickableToManager : Map<HTMLElement, ThingInstance> = new Map<HTMLElement, ThingInstance>();

    constructor(thingID : ThingID) {
        this.thingEntry = thingDirectory[thingID] as ThingEntry;

        this.mainContainer.appendChild(this.clickable);
            this.clickable.appendChild(this.icon);
            this.clickable.appendChild(this.label);
        this.mainContainer.appendChild(this.children);

        this.mainContainer.classList.add('main-container');
        this.children.classList.add('child-container');
        this.clickable.classList.add('clickable');
        this.icon.classList.add('thing-icon');

        this.label.innerHTML = chooseFromArray(this.thingEntry.label || [thingID]); // Default to the ThingID if no label set
        this.label.classList.add('thing-label');

        this.icon.src = `images/${thingID}.png`;
        this.icon.addEventListener('error', () : void => {
            setTimeout(()=>{
                const image : HTMLImageElement = this.icon;
                if (image.src != 'images/missing.png') image.src = 'images/missing.png';
            }, 10)
        });

        ThingInstance.clickableToManager.set(this.clickable, this);

        this.clickable.addEventListener('click', ThingInstance.toggle);
    }

    /**
     * Meant to be set as the click event listener for the "clickable" div, toggles showing the children, or generates them if they have yet to exist
     */
    static toggle() : void {
        // @ts-ignore toggle() is only going to be called in a context where this is an instance of HTMLElement. Trust me, bro.
        const instance : ThingInstance = ThingInstance.clickableToManager.get(this) as ThingInstance;

        if (!instance.hasGeneratedChildren) instance.generateChildren(instance);

        instance.expanded = !instance.expanded;

        instance.children.style.display = instance.expanded ? 'block' : 'none';
    }

    /**
     * Generates the children of a {@link ThingInstance}
     * @param instance
     */
    generateChildren(instance : ThingInstance) : void {

        this.hasGeneratedChildren = true;
        if (typeof instance.thingEntry.children === 'undefined') return;

        Object.keys(instance.thingEntry.children).forEach((childID : string) : void => {
            ThingInstance.generateChild(instance, childID);
        });

    }


    static generateChild(parent : ThingInstance, childID : ThingID) : void {
        const childEntry : ChildEntry = parent.thingEntry.children[childID] as ChildEntry;

        if (Math.random() < (childEntry.chance || 1)) {

            const amount : number = chooseIntegerInRange(childEntry.range || [1, 1]);

            for (let i : number = 0; i < amount; i++) {

                parent.children.appendChild(new ThingInstance(childID).mainContainer);

            }
        }
    }
}

/**
 * A unique identifier for each thing type
 */
type ThingID = string;
/**
 * Defines the chance and number of children for a thing
 */
type ChildEntry = {
    chance?: number,
    range?: number[]
}
interface ChildDirectory {
    [key : ThingID]: ChildEntry
}
/**
 * A type of thing
 */
type ThingEntry = {
    label?: string[],
    children: ChildDirectory,
    inheritsFrom?: ThingID[]
}
interface ThingDirectory {
    [key : ThingID]: ThingEntry
}

let thingDirectory : ThingDirectory;
fetch('things.json')
    .then((r : Response) => r.json())
    .then((t: any) : void => {
        thingDirectory = t;

        // Apply inheritances
        Object.keys(thingDirectory).forEach((key : ThingID) : void => {
            const thingEntry : ThingEntry = thingDirectory[key];

            (thingEntry.inheritsFrom || []).forEach((thingToInheritFromID : ThingID) : void => {
                const thingToInheritFrom : ThingEntry = thingDirectory[thingToInheritFromID];

                Object.keys(thingToInheritFrom.children).forEach((childID : ThingID) : void => {
                    const childEntry : ChildEntry = thingToInheritFrom.children[childID];

                    if (typeof thingEntry.children[childID] === 'undefined') {
                        thingEntry.children[childID] = childEntry;
                    }
                });
            });
        });

        thingContainer.appendChild(new ThingInstance('universe').mainContainer)
    });
