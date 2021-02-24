import React, { useContext } from 'react';
import rftParser from './src/parser.js';


// This component attaches itself to the root component and parses through all dependency files
// Returns an object to help visualize our ReactFetchTree in the Chrome Extension
const ReactFetchTree = ({ rootId }) => {
  rftParser(rootId);
  return null;
}

export default ReactFetchTree
