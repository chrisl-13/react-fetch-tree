import React, { useState, useEffect } from "react";
import ReactDOM, { render } from "react-dom";
import { fetchUser, fetchPosts } from "./fakeApi";
import obj from "./test";
import { findNodeByComponentName, Utils } from "react-fiber-traverse";
import Tree from "react-d3-tree";
import axios from 'axios';
import './style.scss'

console.log("ran");
function Fetchtree() {
  return (
    // `<Tree />` will fill width/height of its container; in this case `#treeWrapper`.
    <div id="treeWrapper" style={{ width: "80vw", height: "20vh" }}>
      <Tree data={orgChart} orientation={"vertical"} />
    </div>
  );
}

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [character, setCharacter] = useState(1);

  useEffect(() => {
    fetchUser(character).then((u) => setUser(u));
  }, [character]);

  fetch('/');
  axios.get('/');

  if (user === null) {
    return <p>Loading profile...</p>;
  }
  return (
    <div>
      <h1>{user}</h1>
      <ProfileTimeline user={user} character={character} />
      <button onClick={fetchUser}>
        Change Character
      </button>
    </div>
  );
}

function ProfileTimeline(props) {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    fetchPosts(props.character).then((p) => setPosts(p));
  }, [props.character]);

  if (posts === null) {
    return <h2>Loading posts...</h2>;
  }
  return (
    <div>
      {posts.length === 1 ? (
        <h5>
          {props.user} has been seen on {posts.length} starship
        </h5>
      ) : (
        <h5>
          {props.user} has been seen on {posts.length} starships
        </h5>
      )}
      <ul>
        {posts.map((post, idx) => (
          <li key={idx}>{post}</li>
        ))}
      </ul>
      <Fetchtree />
    </div>
  );
}

const DeleteButtonPantry = ({ _id }) => {
  const dispatch = useDispatch();

  return (
    <>
      <button
        onClick={() => dispatch(deletePantryItem(_id))}
        type="button"
        className=" items-center w-24 m-1 px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-opacity-100 bg-yellow-500 hover:bg-red-00 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Delete
      </button>
    </>
  );
};

const rootElement = document.getElementById("root");
render(<ProfilePage />, rootElement);

// console.log(rootElement);

// let fiberDOM = rootElement._reactRootContainer._internalRoot;
// console.log("fiberDOM", fiberDOM);

// let treedata = { name: "App", children: [] };
//console.log("sibling", fiberDOM.current.child.child.sibling);

const fiberwalker = (node, treedata = { name: "App", children: [] }) => {
  if (node.child.sibling) {
    node = node.child.sibling;

    if (node.elementType !== null && typeof node.elementType !== "string") {
      if (node.elementType.name) {
        treedata.children.push({
          name: node.elementType.name,
          children: [],
        });
        if (node.child !== null) {
          fiberwalker(node, treedata.children[treedata.children.length - 1]);
        }
      } else {
        if (node.child !== null) {
          fiberwalker(node, treedata);
        }
      }
    }
  }

  if (node.child) {
    node = node.child;
    if (node.elementType !== null && typeof node.elementType !== "string") {
      treedata.children.push({ name: node.elementType.name, children: [] });
      if (node.child != null) {
        fiberwalker(node, treedata.children[treedata.children.length - 1]);
      }
    } else {
      if (node.child !== null) {
        fiberwalker(node, treedata);
      }
    }
  }
  return treedata;
};
let orgChart;

// function onCommitFiberRoot(rendererID, root, priorityLevel) {
//   const mountedRoots = hook.getFiberRoots(rendererID);
//   const current = root.current;
//   const isKnownRoot = mountedRoots.has(root);
//   const isUnmounting =
//     current.memoizedState == null || current.memoizedState.element == null; // Keep track of mounted roots so we can hydrate when DevTools connect.

//   if (!isKnownRoot && !isUnmounting) {
//     mountedRoots.add(root);
//   } else if (isKnownRoot && isUnmounting) {
//     mountedRoots.delete(root);
//   }

//   const rendererInterface = rendererInterfaces.get(rendererID);

//   if (rendererInterface != null) {
//     rendererInterface.handleCommitFiberRoot(root, priorityLevel);
//   }
// }
let __ReactFiberDOM;
const devTools = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;

// if (!window.__REACT_DEVTOOLS_GLOBAL_HOOK__)
//   console.warn(
//     "[React-Sight]: React Sight requires React Dev Tools to be installed."
//   );
// const reactInstances = window.__REACT_DEVTOOLS_GLOBAL_HOOK__.renderers || null;
// const instance = reactInstances.get(1);
//
// (function installHook() {
//   // no instance of React detected
//   if (!window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
//     console.log(
//       "Error: React DevTools not present. React Sight uses React DevTools to patch React's reconciler"
//     );
//     return;
//   }
//   // React fiber (16+)
//   if (instance && instance.version) {

//let count = 0;
devTools.onCommitFiberRoot = (function (original) {
  //root
  return function (...args) {
    //if (count === 0) {
    __ReactFiberDOM = args[1];
    console.log("dom: ", __ReactFiberDOM.current);
    orgChart = fiberwalker(__ReactFiberDOM.current);
    console.log("orgChart: ", orgChart);
    // count++;
    //}
    return original(...args);
  };
})(devTools.onCommitFiberRoot);

//   }
// })();
//---------------------------------------
//REACT SIGHT RECURSIVE TREE PARSER
// let __ReactSightStore = [];
// const components = [];

// const parseFunction = (fn) => {
//   const string = `${fn}`;

//   const match = string.match(/function/);
//   if (match == null) return "fn()";

//   const firstIndex = match[0]
//     ? string.indexOf(match[0]) + match[0].length + 1
//     : null;
//   if (firstIndex == null) return "fn()";

//   const lastIndex = string.indexOf("(");
//   const fnName = string.slice(firstIndex, lastIndex);
//   if (!fnName.length) return "fn()";
//   return `${fnName} ()`;
// };

// const props16 = (node) => {
//   try {
//     const props = {};
//     const keys = Object.keys(node.memoizedProps);

//     keys.forEach((prop) => {
//       const value = node.memoizedProps[prop];
//       if (typeof value === "function") props[prop] = parseFunction(value);
//       // TODO - get these objects to work, almost always children property
//       else if (typeof node.memoizedProps[prop] === "object") {
//         // console.log("PROP Object: ", node.memoizedProps[prop]);
//         props[prop] = "object*";

//         // TODO - parse object
//       } else props[prop] = node.memoizedProps[prop];
//     });
//     return props;
//   } catch (e) {
//     return {};
//   }
// };

// const recur16 = (node, parentArr) => {
//   console.log("node", node);
//   const newComponent = {
//     name: "",
//     children: [],
//     state: null,
//     props: null,
//     id: null,
//     isDOM: null,
//   };

//   // TODO ** only works on local host **
//   // get ID
//   if (node._debugID) newComponent.id = node._debugID;

//   // get name and type
//   if (node.type) {
//     if (node.type.name) {
//       newComponent.name = node.type.name;
//       newComponent.isDOM = false;
//     } else {
//       newComponent.name = node.type;
//       newComponent.isDOM = true;
//     }
//   }

//   // get state
//   if (node.memoizedState) newComponent.state = node.memoizedState;

//   // get props
//   if (node.memoizedProps) newComponent.props = props16(node);

//   // get store
//   if (node.type && node.type.propTypes) {
//     if (node.type.propTypes.hasOwnProperty("store")) {
//       // TODO replace with safety check
//       try {
//         __ReactSightStore = node.stateNode.store.getState();
//       } catch (e) {
//         // noop
//         // console.log('Error getting store: ', e);
//       }
//     }
//   }

//   newComponent.children = [];
//   parentArr.push(newComponent);
//
// };

// const traverse16 = (fiberDOM) => {
//   recur16(fiberDOM.current.stateNode.current, components);
//   return components;
// };

// console.log("recur", traverse16(fiberDOM));

//----------------------------------------------------

// let hostRootFiberNode = fiberRoot.current;
// let hostRootFiberNodeSibling = fiberRoot.current;
// let hostRootFiberNodeChild = fiberRoot.current;
// console.log('initial hostRoot', hostRootFiberNode);

// //first child of hostRoot is ProfilePage
// let profilePageRoot = hostRootFiberNode.child;
// console.log('profilePageRoot', profilePageRoot);

// while (hostRootFiberNodeSibling) {
//   hostRootFiberNodeSibling = hostRootFiberNodeSibling.sibling;
//   console.log('hostroot in sibling loop', hostRootFiberNodeSibling);
// }

// while (hostRootFiberNodeChild) {
//   hostRootFiberNodeChild = hostRootFiberNodeChild.child;
//   console.log('hostroot in child loop', hostRootFiberNodeChild);
// }

// ReactDOM.createRoot(rootElement).render(
//   <ProfilePage />
// );

/*
//ultimate goal is to associate data requests with react components names as strings

let functions = {'fetchUser': true}
let components = {'ProfilePage': [useState, fetchUser, setUser, setCharacter]}

functions[parentName]=false;
functions[dataRequests.parentName]=true;

// Figure out all the ways to write a component

[
  {
    id: 0,
    filename: './src/index.js',
    dependencies: [ './fakeApi', './test' ],
    dataRequests: [],
    functions: {Fetchtree: [], ProfilePage: [useState, fetchUser, setUser, setCharacter]},
    mapping: { './fakeApi': 1, './test': 2 }
  },
  {
    id: 1,
    filename: '/Users/chrislung/CodesmithPTRI/react-fetch-tree/src/fakeApi.js',
    dependencies: [],
    dataRequests: [
      {
        dataRequestType: 'fetch',
        position: Position { line: 36, column: 9 },
        parentName: 'fetchPosts',
      },
      {
        dataRequestType: 'fetch',
        position: Position { line: 25, column: 8 },
        parentName: 'fetchUser'
      },]
    mapping: {}
  }
]
*/