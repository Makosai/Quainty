/*
utils.js -
  Simple functions used to make some tasks easier in the long-run. Mainly tasks
  that would potentially become repetitive as it is used multiple times.
*/

const debug = true;

function debugMe(msg) {
  if (debug) {
    console.log(msg);
  }
}

// Grabs the contents of the body.
// Mainly used for getting the innerHTML of the body of external pages.
function getContent(content) {
  let x = content.indexOf("<body");
  x = content.indexOf(">", x);
  let y = content.lastIndexOf("</body>");
  return content.slice(x + 1, y);
}
