const fiberTree = {
  child: {
    child: {
      child: {
        child: {
          child: null,
          sibling: {
            child: {
              child: null,
              sibling: {
                child: null,
                sibling: null,
                elementType: { name: "Recommendations" },
              },
              elementType: { name: "Favorites" },
            },
            sibling: {
              child: null,
              sibling: null,
              elementType: { name: "Footer" },
            },
            elementType: { name: "Body" },
          },
          elementType: { name: "NavBar" },
        },
        sibling: null,
        elementType: { name: "App" },
      },
    sibling: null,
    elementType: { $$typeof: "Symbol(react.provider)" },
    },
    sibling: null,
    elementType: { name: "Provider" },
  },
};

const fiberwalker = (
  node,
  componentStore,
  treedata = { name: "App", children: [] }
) => {
  const dataReqArr = [
    "fetch",
    "axios",
    "http",
    "https",
    "qwest",
    "superagent",
    "XMLHttpRequest",
  ];

  function Node(name) {
    this.name = name;
    this.children = [];
  }
  if (node.child.sibling) {
    node = node.child.sibling;
    let name;
    if (typeof node.elementType == "string") {
      name = node.elementType;
    } else if (node.elementType.name) {
      name = node.elementType.name;
    } else {
      name = "anon.";
    }
    const currentNode = { name, children: [] };

    if (componentStore !== undefined) {
      if (componentStore[name]) {
        //iterate through every entry and check request type
        const dataRequest = componentStore[name];
        for (let key in dataRequest) {
          if (dataReqArr.includes(dataRequest[key].reqType)) {
            currentNode.attributes = {
              containsFetch: `${dataRequest[key].reqType}`,
            };
          }
        }
      }
    }
    treedata.children.push(currentNode);

    if (node.sibling !== null) {
      node = node.sibling;
      let name;
      if (typeof node.elementType == "string") {
        name = node.elementType;
      } else if (node.elementType.name) {
        name = node.elementType.name;
      } else {
        name = "anon.";
      }
      const currentNode = { name, children: [] };
      if (componentStore !== undefined) {
        if (componentStore[name]) {
          //iterate through every entry and check request type
          const dataRequest = componentStore[name];
          for (let key in dataRequest) {
            if (dataReqArr.includes(dataRequest[key].reqType)) {
              currentNode.attributes = {
                containsFetch: `${dataRequest[key].reqType}`,
              };
            }
          }
        }
      }
      treedata.children.push(currentNode);
      if (node.child != null) {
        fiberwalker(
          node,
          componentStore,
          treedata.children[treedata.children.length - 1]
        );
      }
    }

    if (node.child != null) {
      fiberwalker(
        node,
        componentStore,
        treedata.children[treedata.children.length - 1]
      );
    }
  }

  if (node.child) {
    node = node.child;
    let name;
    if (typeof node.elementType == "string") {
      name = node.elementType;
    } else if (node.elementType.name) {
      name = node.elementType.name;
    } else {
      name = "anon.";
    }
    const currentNode = { name, children: [] };
    if (componentStore !== undefined) {
      if (componentStore[name]) {
        //iterate through every entry and check request type
        const dataRequest = componentStore[name];
        for (let key in dataRequest) {
          if (dataReqArr.includes(dataRequest[key].reqType)) {
            currentNode.attributes = {
              containsFetch: `${dataRequest[key].reqType}`,
            };
          }
        }
      }
    }
    //iterate through every entry and check request type
    treedata.children.push(currentNode);
    if (node.child != null) {
      fiberwalker(
        node,
        componentStore,
        treedata.children[treedata.children.length - 1]
      );
    }
  }
  return treedata;
};


module.exports = { fiberTree, fiberwalker };

// console.log(result.children[0].children[0].children[0].children[0])