/*
main.js -
  Loads documents for everything in the navbar. This handles the one-page design's
  content.
*/

const navitems = ['Home', 'Chat', 'Bot'];

/*
Usage:
  'navitem': [{
    type: 'type here' // REQUIRED
    text: '' // OPTIONAL
    width: px // OPTIONAL (coming soon)
    height: px // OPTIONAL (coming soon)
    img: 'link or path' // OPTIONAL (coming soon)
    imgPos: '' // OPTIONAL (coming soon)
    imgOff: [0,0] // OPTIONAL (coming soon)
  }]

Types:
  bar
  header
  button
    Valid extra variables:
      onClick: 'javascript:function();'
  img (coming soon)

imgPos:
  left
  center
  right

imgOff:
  [x offset, y offset]
*/
const menuitems = {
  'Home': [{
    type: 'bar',
    text: 'test1'
  }, {
    type: 'bar',
    text: 'test2'
  }],
  'Chat': [{
    type: 'header',
    text: 'Single Channels'
  }, {
    type: 'bar',
    text: 'test3'
  }, {
    type: 'button',
    text: 'New',
    onClick: 'javascript:newChannel(this);'
  }, {
    type: 'header',
    text: 'Merged Channels'
  }, {
    type: 'bar',
    text: 'test3.2'
  }, {
    type: 'bar',
    text: 'test4.2'
  }],
  'Bot': [{
    type: 'bar',
    text: 'test5'
  }, {
    type: 'bar',
    text: 'test6'
  }]
};

const navbar = document.getElementById('navbar');
const page = document.getElementById('page');

// Set up the menu-btn
navbar.innerHTML +=
  '<a href="#" onclick="menuClick();return false;" id="menu-btn">&#9776;</a>';

const menu = document.getElementById('menu-btn');
const menubars = document.getElementById('menubars');

let val = 0;

// Each navbar item (Home, Chat, etc)
navitems.forEach(function(item) {
  navbar.innerHTML +=
    '<a href="#" title="' + item.toLowerCase() +
    '" onclick="navigate(this);return false;"> ' +
    item +
    ' </a>';
  page.innerHTML += '<div id="page_' + item.toLowerCase() +
    '" style="display:none;"></div>';

  menubars.innerHTML += '<div id="menubar_' + item.toLowerCase() +
    '" style="display:none;"></div>';

  // Menu Bars Content
  const curMenubar = document.getElementById('menubar_' + item.toLowerCase());
  let barContainer;
  menuitems[item].forEach(function(barItem) {
    let elem;

    switch (barItem.type) {
      case 'bar':
        if (!barContainer) {
          barContainer = document.createElement('ul');
          curMenubar.appendChild(barContainer);
        }
        elem = document.createElement('li');
        elem.setAttribute('class', barItem.type);
        elem.innerHTML = barItem.text;
        barContainer.appendChild(li);
        break;

      case 'header':
        barContainer = null;
        elem = document.createElement('div');
        elem.setAttribute('class', barItem.type);
        elem.innerHTML = barItem.text;
        curMenubar.appendChild(div);
        break;

      case 'button':
        if (!barContainer) {
          barContainer = document.createElement('ul');
          curMenubar.appendChild(barContainer);
        }
        elem = document.createElement('li');
        elem.setAttribute('class', barItem.type);
        elem.setAttribute('onClick', barItem.onClick);
        elem.innerHTML = barItem.text;
        barContainer.appendChild(li);
        break;
    }
  });

  // Load other pages
  const xmlhttp = new XMLHttpRequest();
  xmlhttp.open('GET', '/src/' + item.toLowerCase() + '.html', true);

  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState === 4) { // DONE
      if (xmlhttp.status === 200) { // OK
        const pageDoc = document.getElementById('page_' + item.toLowerCase());
        pageDoc.innerHTML = getContent(xmlhttp.responseText);

        // eval() the new scripts
        const scripts = pageDoc.getElementsByTagName('script');
        if (scripts.length > 0) {
          for (const element of scripts) {
            eval(element.innerHTML);
          }
        }
      } else {
        document.getElementById('page_' + item.toLowerCase()).innerHTML =
          'Sorry, an error occurred.';
      }
    }
  };

  xmlhttp.send();
});

navigate(navbar.getElementsByTagName('a')[1]);

let currentTab, currentPage;

// Switch between navbar items
function navigate(item) {
  if (currentTab) {
    currentTab.id = '';
  }

  if (currentPage) {
    currentPage.style.display = 'none';
  }

  currentTab = item;
  currentTab.id = 'current';

  currentPage = page.querySelector('#page_' + currentTab.title);
  currentPage.style.display = 'block';

  closeMenubar();

  currentMenubar = menubars.querySelector('#menubar_' + currentTab.title);
}

let currentMenubar;
let menuOpened = false;

function closeMenubar() {
  if (currentMenubar) {
    currentMenubar.style.left = '-300px';
    setTimeout(function() {
      currentMenubar.style.display = 'none';
    }, 150);
    menuOpened = false;
  }
}

function openMenubar() {
  if (currentMenubar) {
    currentMenubar.style.display = 'block';
    setTimeout(function() {
      currentMenubar.style.left = '0px';
    }, 1);

    menuOpened = true;
  }
}

function menuClick() {
  if (menuOpened) {
    closeMenubar();
  } else {
    openMenubar();
  }
}
