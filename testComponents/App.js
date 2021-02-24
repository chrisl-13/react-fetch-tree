import React, { useState, useEffect } from "react";
import ReactDOM, { render } from "react-dom";
import { fetchUser, fetchPosts } from "./fakeApi";
import obj from "./test";
import { findNodeByComponentName, Utils } from "react-fiber-traverse";
import Tree from "react-d3-tree";
import axios from 'axios';

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
