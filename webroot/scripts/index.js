"use strict";
const thingContainer = document.getElementById('things');
function chooseIntegerInRange(range) {
    return Math.floor(Math.random() * range[1] + range[0]);
}
function chooseFromArray(array) {
    return array[chooseIntegerInRange([0, array.length - 1])];
}
/**
 * An instance of a thing. Contains fields and methods relating to HTML functionality
 */
class ThingInstance {
    constructor(thingID) {
        this.mainContainer = document.createElement('div');
        this.clickable = document.createElement('div');
        this.icon = document.createElement('img');
        this.label = document.createElement('span');
        this.children = document.createElement('div');
        this.expanded = false;
        this.hasGeneratedChildren = false;
        this.thingEntry = thingDirectory[thingID];
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
        this.icon.addEventListener('error', () => {
            setTimeout(() => {
                const image = this.icon;
                if (image.src != 'images/missing.png')
                    image.src = 'images/missing.png';
            }, 10);
        });
        ThingInstance.clickableToManager.set(this.clickable, this);
        this.clickable.addEventListener('click', ThingInstance.toggle);
    }
    /**
     * Meant to be set as the click event listener for the "clickable" div, toggles showing the children, or generates them if they have yet to exist
     */
    static toggle() {
        // @ts-ignore toggle() is only going to be called in a context where this is an instance of HTMLElement. Trust me, bro.
        const instance = ThingInstance.clickableToManager.get(this);
        if (!instance.hasGeneratedChildren)
            instance.generateChildren(instance);
        instance.expanded = !instance.expanded;
        instance.children.style.display = instance.expanded ? 'block' : 'none';
    }
    /**
     * Generates the children of a {@link ThingInstance}
     * @param instance
     */
    generateChildren(instance) {
        this.hasGeneratedChildren = true;
        if (typeof instance.thingEntry.children === 'undefined')
            return;
        Object.keys(instance.thingEntry.children).forEach((childID) => {
            ThingInstance.generateChild(instance, childID);
        });
    }
    static generateChild(parent, childID) {
        const childEntry = parent.thingEntry.children[childID];
        if (Math.random() < (childEntry.chance || 1)) {
            const amount = chooseIntegerInRange(childEntry.range || [1, 1]);
            for (let i = 0; i < amount; i++) {
                parent.children.appendChild(new ThingInstance(childID).mainContainer);
            }
        }
    }
}
ThingInstance.clickableToManager = new Map();
let thingDirectory;
fetch('things.json')
    .then((r) => r.json())
    .then((t) => {
    thingDirectory = t;
    // Apply inheritances
    Object.keys(thingDirectory).forEach((key) => {
        const thingEntry = thingDirectory[key];
        (thingEntry.inheritsFrom || []).forEach((thingToInheritFromID) => {
            const thingToInheritFrom = thingDirectory[thingToInheritFromID];
            Object.keys(thingToInheritFrom.children).forEach((childID) => {
                const childEntry = thingToInheritFrom.children[childID];
                if (typeof thingEntry.children[childID] === 'undefined') {
                    thingEntry.children[childID] = childEntry;
                }
            });
        });
    });
    thingContainer.appendChild(new ThingInstance('universe').mainContainer);
});
