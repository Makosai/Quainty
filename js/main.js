var navitems = ['Home', 'Chat', 'Bot'];

var navbar = document.getElementById('navbar');
var page = document.getElementById('page');

navbar.innerHTML +=
  '<a href="#" onclick="menuClick();return false;" id="menu-btn">&#9776;</a>';

var menu = document.getElementById('menu-btn');
var menubars = document.getElementById('menubars');

var val = 0;

navitems.forEach(function(item) {
  navbar.innerHTML +=
    '<a href="#" title="' + item.toLowerCase() +
    '" onclick="navigate(this);return false;"> ' +
    item +
    ' </a>';
  page.innerHTML += '<div id="page_' + item.toLowerCase() +
    '" style="display:none;">This is the ' +
    item + ' content.</div>';

  menubars.innerHTML += '<div id="menubar_' + item.toLowerCase() +
    '" style="display:none;"><ul><li>test' + ++val + '</li><li>test' + ++
    val + '</li></ul></div>';

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open('GET', '../src/' + item.toLowerCase() + '.html', true);

  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState === 4) { // DONE
      if (xmlhttp.status === 200) { // OK
        var pageDoc = document.getElementById('page_' + item.toLowerCase());
        pageDoc.innerHTML =
          getContent(xmlhttp
            .responseText);

        var scripts = pageDoc.getElementsByTagName('script');
        if (scripts.length > 0) {
          for (var i = 0; i < scripts.length; i++) {
            eval(scripts[i].innerHTML);
          }
        }
      } else {
        document.getElementById('page_' + item.toLowerCase()).innerHTML =
          'Sorry, an error occured.';
      }
    }
  };

  xmlhttp.send();
});

navigate(navbar.getElementsByTagName('a')[1]);

var currentTab, currentPage;

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

var currentMenubar;
var menuOpened = false;

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
