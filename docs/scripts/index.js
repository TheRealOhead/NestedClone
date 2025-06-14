"use strict";
(() => {
  // src/misc.ts
  function chooseIntegerInRange(range) {
    return Math.floor(Math.random() * (range[1] - range[0] + 1) + range[0]);
  }
  function chooseFromArray(array) {
    return array[chooseIntegerInRange([0, array.length - 1])];
  }

  // src/things.ts
  function applyInheritances() {
    Object.keys(ThingInstance.thingDirectory).forEach((key) => {
      const thingEntry = ThingInstance.thingDirectory[key];
      (thingEntry.inheritsFrom || []).forEach((thingToInheritFromID) => {
        const thingToInheritFrom = ThingInstance.thingDirectory[thingToInheritFromID];
        if (typeof thingToInheritFrom.children === "undefined")
          thingToInheritFrom.children = {};
        Object.keys(thingToInheritFrom.children).forEach((childID) => {
          const childEntry = thingToInheritFrom.children[childID];
          if (typeof thingEntry.children === "undefined")
            thingEntry.children = {};
          if (typeof thingEntry.children[childID] === "undefined")
            thingEntry.children[childID] = childEntry;
        });
      });
    });
  }
  var ThingInstance = class _ThingInstance {
    constructor(thingID) {
      this.mainContainer = document.createElement("div");
      this.clickable = document.createElement("div");
      this.icon = document.createElement("img");
      this.label = document.createElement("span");
      this.children = document.createElement("div");
      this.description = document.createElement("span");
      this.expanded = false;
      this.hasGeneratedChildren = false;
      const originalThingID = thingID;
      if (typeof _ThingInstance.thingDirectory[thingID] === "undefined") {
        console.warn(`No item found called ${thingID}, defaulting to the thing`);
        thingID = "thing";
      }
      this.thingEntry = _ThingInstance.thingDirectory[thingID];
      this.mainContainer.appendChild(this.clickable);
      this.clickable.appendChild(this.icon);
      this.clickable.appendChild(this.label);
      this.clickable.appendChild(this.description);
      this.mainContainer.appendChild(this.children);
      this.mainContainer.classList.add("main-container");
      this.children.classList.add("child-container");
      this.clickable.classList.add("clickable");
      this.icon.classList.add("thing-icon");
      this.description.classList.add("description");
      this.description.innerHTML = this.thingEntry.description || "";
      if (this.thingEntry === _ThingInstance.thingDirectory["thing"] && originalThingID != thingID) {
        this.description.innerHTML = `This thing was supposed to be "${originalThingID}", but Owen messed up!`;
      }
      this.label.innerHTML = chooseFromArray(this.thingEntry.label || [thingID]);
      this.label.classList.add("thing-label");
      this.icon.src = this.thingEntry.imagePath ? `images/${this.thingEntry.imagePath}` : `images/${thingID}.png`;
      this.icon.addEventListener("error", () => {
        setTimeout(() => {
          const image = this.icon;
          if (image.src != "images/missing.png") image.src = "images/missing.png";
        }, 10);
      });
      _ThingInstance.clickableToManager.set(this.clickable, this);
      this.clickable.addEventListener("click", _ThingInstance.toggle);
      this.clickable.tabIndex = 0;
      this.clickable.title = `Thing ID: ${thingID}`;
    }
    static {
      this.thingDirectory = {};
    }
    static {
      this.clickableToManager = /* @__PURE__ */ new Map();
    }
    /**
     * Meant to be set as the click event listener for the "clickable" div, toggles showing the children, or generates them if they have yet to exist
     */
    static toggle() {
      const instance = _ThingInstance.clickableToManager.get(this);
      if (!instance.hasGeneratedChildren) instance.generateChildren(instance);
      instance.expanded = !instance.expanded;
      instance.children.style.display = instance.expanded ? "block" : "none";
    }
    /**
     * Generates the children of a {@link ThingInstance}
     * @param instance
     */
    generateChildren(instance) {
      this.hasGeneratedChildren = true;
      if (typeof instance.thingEntry.children === "undefined") return;
      const childrenIDs = Object.keys(instance.thingEntry.children);
      childrenIDs.forEach((childID) => {
        _ThingInstance.generateChild(instance, childID);
      });
      if (instance.thingEntry.shuffleChildren === true) {
        let elements = [...instance.children.children];
        instance.children.innerHTML = "";
        elements.sort(() => Math.random() - 0.5);
        elements.forEach((element) => {
          instance.children.appendChild(element);
        });
      }
    }
    static generateChild(parent, childID) {
      const childEntry = parent.thingEntry.children[childID];
      if (Math.random() < (childEntry.chance || 1)) {
        const amount = chooseIntegerInRange(childEntry.range || [1, 1]);
        for (let i = 0; i < amount; i++) {
          parent.children.appendChild(new _ThingInstance(childID).mainContainer);
        }
      }
    }
  };

  // src/elements.ts
  var data = [
    ["hydrogen", 0],
    ["helium", 4],
    ["lithium", 7],
    ["beryllium", 9],
    ["", 0],
    ["carbon", 12],
    ["nitrogen", 14],
    ["oxygen", 16],
    ["", 0],
    ["", 0],
    ["", 0],
    ["magnesium", 24],
    ["", 0],
    ["silicon", 28],
    ["phosphorus", 31],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["calcium", 40],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["iron", 56],
    ["", 0],
    ["nickel", 58],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0],
    ["", 0]
  ];
  function createAtoms(thingDirectory) {
    let atomicNumber = 1;
    data.forEach((elementData) => {
      let elementName = elementData[0];
      let atomicWeight = elementData[1];
      thingDirectory[elementName] = {
        children: {
          proton: {
            range: [atomicNumber, atomicNumber]
          },
          electron: {
            range: [atomicNumber, atomicNumber]
          },
          neutron: {
            range: [atomicWeight - atomicNumber, atomicWeight - atomicNumber]
          }
        },
        imagePath: "atom.png"
      };
      atomicNumber++;
    });
  }

  // src/index.ts
  var thingContainer = document.getElementById("things");
  var waitingOn = 0;
  [
    "things/compounds.json",
    "things/cosmos.json",
    "things/earthlike.json",
    "things/life.json"
  ].forEach((fileName) => {
    waitingOn++;
    const filePromise = fetch(fileName);
    filePromise.then((r) => r.json()).then((t) => {
      Object.assign(ThingInstance.thingDirectory, t);
      waitingOn--;
    });
  });
  var waitForLoad = setInterval(() => {
    if (waitingOn == 0) {
      createAtoms(ThingInstance.thingDirectory);
      applyInheritances();
      console.log(ThingInstance.thingDirectory);
      const startThing = new URLSearchParams(window.location.search).get("start") || "universe";
      thingContainer.appendChild(new ThingInstance(startThing).mainContainer);
      clearInterval(waitForLoad);
    }
  }, 10);
})();
