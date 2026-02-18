"use strict";
(() => {
  // src/misc.ts
  function chooseIntegerInRange(range) {
    return Math.floor(Math.random() * (range[1] - range[0] + 1) + range[0]);
  }
  function chooseFromArray(array) {
    return array[chooseIntegerInRange([0, array.length - 1])];
  }

  // src/nameGenerators.ts
  function applyIndefiniteArticle(str) {
    if ("aeiou".includes(str.charAt(0))) {
      return "an " + str;
    }
    return "a " + str;
  }
  var cardinalDirections = ["North", "South", "East", "West"];
  var foods = {
    countable: [
      "apple",
      "orange",
      "sandwich",
      "hamburger",
      "salad",
      "hotdog",
      "banana"
    ],
    uncountable: [
      "chips",
      "caviar",
      "cereal",
      "spaghetti",
      "meatloaf",
      "soup",
      "ice cream",
      "yogurt",
      "pizza"
    ]
  };
  var nameGenerator = {
    continent: () => {
      const prefixes = ["North Ame", "South Ame", "Afr", "As", "Ant", "Eur", "Oc"];
      const suffixes = ["rica", "ica", "ope", "ia", "arctica", "ceana"];
      return chooseFromArray(prefixes) + chooseFromArray(suffixes);
    },
    country: () => {
      const preprefixes = ["United States of ", "Republic of ", "", "", "", "", "", ""];
      const prefixes = ["Pak", "Nic", "Mex", "Canad", "Irel", "Chin", "Plob", "Ins", "Flub", "Glorb", "Schmub", "Plumb"];
      const suffixes = ["aria", "orus", "istan", "eria", "ico", "ula", "ebria"];
      let name = chooseFromArray(preprefixes) + chooseFromArray(prefixes) + chooseFromArray(suffixes);
      if (Math.random() < 0.1) {
        return chooseFromArray(cardinalDirections) + " " + name;
      }
      return name;
    },
    thought: () => {
      return chooseFromArray([
        "I need to pick up more milk today",
        "I miss my childhood dog",
        "I wonder if they'd notice if I left",
        "I'm having a great day today",
        "How come T-Rexes had such short arms?",
        "What was that one band called?",
        "My back itches",
        "I think I forgot how to do long division",
        "They don't make 'em like they used to",
        "I don't have a care in the world",
        "Why'd they stop making that cereal?",
        "I could go for " + applyIndefiniteArticle(chooseFromArray(foods.countable)),
        "I could go for some " + chooseFromArray(foods.uncountable),
        "What if my entire life is just a simulation? Perhaps this very thought was typed up by some college student who's supposed to be doing his homework and is working on a personal project instead? If that's so, is someone reading my thoughts? Are my thoughts randomly generated? Nah, that's too far-fetched",
        "I think I need a new computer",
        "My phone is low on battery",
        "JavaScript sucks",
        "Man, I love TypeScript",
        "That was a rude thing to say",
        "That was a funny video",
        "My mom makes the best meatloaf"
      ]);
    },
    person: () => {
      const firstNames = [
        "Alice",
        "Alex",
        "Andrew",
        "Betty",
        "Bart",
        "Cindy",
        "Charlie",
        "Calvin",
        "Dottie",
        "David",
        "Ellen",
        "Evan",
        "Evin",
        "Francene",
        "Frank",
        "Gertrude",
        "Gil",
        "Gaylord",
        "Helen",
        "Harold",
        "Ivan",
        "Jay",
        "Jennifer",
        "Jack",
        "Joshua",
        "Kisari",
        "Katelin",
        "Lillian",
        "Leo",
        "Lars",
        "May",
        "Michael",
        "Nikolai",
        "Nick",
        "Nadine",
        "Owen",
        "Olivia",
        "Parker",
        "Patrick",
        "Quinn",
        "Red",
        "Ryan",
        "Steven",
        "Sarah",
        "Tyler",
        "Tina",
        "Valorie",
        "William",
        "Xavier",
        "Yancy",
        "Zack"
      ];
      const lastNames = [
        "Andrews",
        "Adams",
        "Addams",
        "Clemonts",
        "Davidson",
        "Evans",
        "Fitzgerald",
        "Gilraine",
        "Howards",
        "Johnson",
        "Jackson",
        "Larson",
        "Michaels",
        "Myers",
        "Owens",
        "Parker",
        "Reagan",
        "Stevens",
        "Saturn",
        "Smith",
        "Smith",
        "Smith",
        "Williams",
        "White",
        "Black",
        "Brown"
      ];
      const prefixes = ["Prof. ", "Dr. ", "Rev. ", "", "", "", "", "", "", ""];
      const suffixes = [" Jr.", " Sr.", " III", "", "", "", "", "", "", "", "", "", "", "", ""];
      if (Math.random() < 1 / 2e3) {
        return chooseFromArray(["Gabe Newell", "Elvis Presley"]);
      }
      return chooseFromArray(prefixes) + chooseFromArray(firstNames) + " " + chooseFromArray(lastNames) + chooseFromArray(suffixes);
    }
  };

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
    constructor(thingID, parent) {
      this.mainContainer = document.createElement("div");
      this.clickable = document.createElement("div");
      this.icon = document.createElement("img");
      this.label = document.createElement("span");
      this.children = document.createElement("div");
      this.description = document.createElement("span");
      this.expanded = false;
      this.hasGeneratedChildren = false;
      this.parent = null;
      this.thingID = "thing";
      this.thingID = thingID;
      const originalThingID = thingID;
      this.parent = parent;
      if (typeof _ThingInstance.thingDirectory[thingID] === "undefined") {
        console.warn(`No item found called ${thingID}, defaulting to thing`);
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
      if (this.thingEntry.labelGenerator) this.label.innerHTML = nameGenerator[this.thingEntry.labelGenerator]();
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
    /**
     * Determines whether a child can be generated based on its parentBeforeUniverse predicate
     * @param childEntry 
     * @param parent 
     * @returns Whether the child should be generated
     */
    static checkParentBeforeUniversePredicate(childEntry, parent) {
      if (childEntry.predicates && childEntry.predicates.parentsBeforeUniverse) {
        for (let superParent of childEntry.predicates.parentsBeforeUniverse) {
          let invert = false;
          if (superParent.charAt(0) == "!") {
            superParent = superParent.substring(1);
            invert = true;
          }
          let current = parent;
          while (current != null && current.thingID != "universe" && current.thingID != superParent)
            current = current.parent;
          if (current == null || current.thingID == "universe")
            return invert;
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
    static generateChild(parent, childID) {
      const childEntry = parent.thingEntry.children[childID];
      if (!_ThingInstance.checkParentBeforeUniversePredicate(childEntry, parent))
        return;
      if (!childEntry.chance || Math.random() < childEntry.chance) {
        const amount = chooseIntegerInRange(childEntry.range || [childEntry.amount || 1, childEntry.amount || 1]);
        for (let i = 0; i < amount; i++) {
          parent.children.appendChild(new _ThingInstance(childID, parent).mainContainer);
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
    "things/life.json",
    "things/civilization.json",
    "things/household.json",
    "things/people.json"
  ].forEach((fileName) => {
    waitingOn++;
    const filePromise = fetch(fileName);
    filePromise.then((r) => r.json()).then((t) => {
      Object.assign(ThingInstance.thingDirectory, t);
      waitingOn--;
    });
  });
  function getStartingThingID() {
    return new URLSearchParams(window.location.search).get("start") || "universe";
  }
  var waitForLoad = setInterval(() => {
    if (waitingOn == 0) {
      createAtoms(ThingInstance.thingDirectory);
      applyInheritances();
      console.log(ThingInstance.thingDirectory);
      const startThing = getStartingThingID();
      thingContainer.appendChild(new ThingInstance(startThing).mainContainer);
      clearInterval(waitForLoad);
    }
  }, 10);
})();
