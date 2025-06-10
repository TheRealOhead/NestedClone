import { chooseFromArray, chooseIntegerInRange } from './misc';

/**
 * Give thing entries that inherit from other things their children
 */
export function applyInheritances() : void {
    Object.keys(ThingInstance.thingDirectory).forEach((key : ThingID) : void => {
        const thingEntry : ThingEntry = ThingInstance.thingDirectory[key];

        (thingEntry.inheritsFrom || []).forEach((thingToInheritFromID : ThingID) : void => {
            const thingToInheritFrom : ThingEntry = ThingInstance.thingDirectory[thingToInheritFromID];

            if (typeof thingToInheritFrom.children === 'undefined')
                thingToInheritFrom.children = {} as ChildDirectory;

            Object.keys(thingToInheritFrom.children).forEach((childID : ThingID) : void => {
                const childEntry : ChildEntry = thingToInheritFrom.children[childID];

                if (typeof thingEntry.children === 'undefined')
                    thingEntry.children = {} as ChildDirectory;

                if (typeof thingEntry.children[childID] === 'undefined')
                    thingEntry.children[childID] = childEntry;
            });
        });
    });
}



/**
 * An instance of a thing. Contains fields and methods relating to HTML functionality
 */
export class ThingInstance {
    static thingDirectory : ThingDirectory = {};

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
        if (typeof ThingInstance.thingDirectory[thingID] === 'undefined') {
            console.error(`No item found called ${thingID}, defaulting to perfectly generic object`);
            thingID = 'perfectly generic object';
        }
        this.thingEntry = ThingInstance.thingDirectory[thingID];

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

        this.icon.src = this.thingEntry.imagePath ? `images/${this.thingEntry.imagePath}` : `images/${thingID}.png`;
        this.icon.addEventListener('error', () : void => {
            setTimeout(()=>{
                const image : HTMLImageElement = this.icon;
                if (image.src != 'images/missing.png') image.src = 'images/missing.png';
            }, 10)
        });

        ThingInstance.clickableToManager.set(this.clickable, this);

        this.clickable.addEventListener('click', ThingInstance.toggle);
        this.clickable.tabIndex = 0;
        this.clickable.title = `Thing ID: ${thingID}`;
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

        const childrenIDs : ThingID[] = Object.keys(instance.thingEntry.children);

        childrenIDs.forEach((childID : string) : void => {
            ThingInstance.generateChild(instance, childID);
        });

        if (instance.thingEntry.shuffleChildren === true) {
            let elements : Element[] = [...instance.children.children];
            instance.children.innerHTML = '';
            elements.sort(() => Math.random() - .5);
            elements.forEach(element => {
                instance.children.appendChild(element);
            })
        }

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
export type ThingID = string;
/**
 * Defines the chance and number of children for a thing
 */
export type ChildEntry = {
    chance?: number,
    range?: number[]
}
export interface ChildDirectory {
    [key : ThingID]: ChildEntry
}
/**
 * A type of thing
 */
export type ThingEntry = {
    label?: string[],
    children: ChildDirectory,
    inheritsFrom?: ThingID[]
    /**
     * An image path starting in the images directory
     * Ex: "example.png"
     * Derived from {@link ThingID} if not specified
     */
    imagePath?: string
    shuffleChildren?: boolean
}
export interface ThingDirectory {
    [key : ThingID]: ThingEntry
}