import { chooseFromArray, chooseIntegerInRange } from './misc';
import { nameGenerator } from './nameGenerators';

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
    readonly description : HTMLElement = document.createElement('span');

    readonly thingEntry : ThingEntry;

    expanded : boolean = false;
    hasGeneratedChildren : boolean = false;

    parent : ThingInstance | null = null;
    thingID : ThingID = 'thing';

    public static clickableToManager : Map<HTMLElement, ThingInstance> = new Map<HTMLElement, ThingInstance>();

    constructor(thingID : ThingID, parent : ThingInstance | null) {
        this.thingID = thingID;
        const originalThingID : ThingID = thingID;
        this.parent = parent;

        if (typeof ThingInstance.thingDirectory[thingID] === 'undefined') {
            console.warn(`No item found called ${thingID}, defaulting to thing`);
            thingID = 'thing';
        }
        this.thingEntry = ThingInstance.thingDirectory[thingID];

        this.mainContainer.appendChild(this.clickable);
        this.clickable.appendChild(this.icon);
        this.clickable.appendChild(this.label);
        this.clickable.appendChild(this.description);
        this.mainContainer.appendChild(this.children);

        this.mainContainer.classList.add('main-container');
        this.children.classList.add('child-container');
        this.clickable.classList.add('clickable');
        this.icon.classList.add('thing-icon');
        this.description.classList.add('description');

        this.description.innerHTML = this.thingEntry.description || '';

        if (this.thingEntry === ThingInstance.thingDirectory['thing'] && originalThingID != thingID) {
            this.description.innerHTML = `This thing was supposed to be "${originalThingID}", but Owen messed up!`
        }

        this.label.innerHTML = chooseFromArray(this.thingEntry.label || [thingID]); // Default to the ThingID if no label set
        if (this.thingEntry.labelGenerator) this.label.innerHTML = nameGenerator[this.thingEntry.labelGenerator](); // Generate a label instead if a generator is specified
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

    /**
     * Determines whether a child can be generated based on its parentBeforeUniverse predicate
     * @param childEntry 
     * @param parent 
     * @returns Whether the child should be generated
     */
    private static checkParentBeforeUniversePredicate(childEntry : ChildEntry, parent : ThingInstance) {
        if (childEntry.predicates && childEntry.predicates.parentsBeforeUniverse) {
            for (let superParent of childEntry.predicates.parentsBeforeUniverse) {
                let invert : boolean = false;
                if (superParent.charAt(0) == '!') {
                    superParent = superParent.substring(1);
                    invert = true;
                }

                // Climb tree
                let current : ThingInstance | null = parent;
                while (current != null && current.thingID != 'universe' && current.thingID != superParent)
                    current = current.parent;

                // Got to universe first
                if (current == null || current.thingID == 'universe')
                    return invert;

                // Got to superParent first
                return !invert;
            }
        }
        return true;
    }

    /**
     * Generates a single child of a {@link ThingInstance}
     * @param parent Parent {@link ThingInstance}
     * @param childID {@link ThingID} of the child
     */
    static generateChild(parent : ThingInstance, childID : ThingID) : void {
        const childEntry : ChildEntry = parent.thingEntry.children[childID] as ChildEntry;

        if (!ThingInstance.checkParentBeforeUniversePredicate(childEntry, parent))
            return;

        if (!childEntry.chance || Math.random() < childEntry.chance) {

            const amount : number = chooseIntegerInRange(childEntry.range || [childEntry.amount || 1, childEntry.amount || 1])

            for (let i : number = 0; i < amount; i++) {

                parent.children.appendChild(new ThingInstance(childID, parent).mainContainer);

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
    range?: number[],
    amount?: number,
    predicates?: {
        parentsBeforeUniverse?: string[]
    }
}
export interface ChildDirectory {
    [key : ThingID]: ChildEntry
}
/**
 * A type of thing
 */
export type ThingEntry = {
    parent: ThingEntry | null,
    label?: string[],
    children: ChildDirectory,
    labelGenerator?: string,
    inheritsFrom?: ThingID[],
    /**
     * An image path starting in the images directory
     * Ex: "example.png"
     * Derived from {@link ThingID} if not specified
     */
    imagePath?: string,
    shuffleChildren?: boolean,
    description?: string
}
export interface ThingDirectory {
    [key : ThingID]: ThingEntry
}