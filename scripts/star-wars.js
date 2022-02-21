function fetchNested(parent, url) {
  const newli = parent.appendChild(document.createElement('li'));
  fetch(url)
    .then((response) => { return response.json() })
    .catch((err) => {
      console.error(err);
      newli.textContent = '';
    })
    .then((json) => {
      newli.textContent = '';
      //console.log(json);
      addSpan(newli, json.result.properties.name);
      addul(newli, json.result.properties, true);
    });
  return newli;
}

function addNestedItem(property, object) {
  const li = document.createElement('li');
  const newul = document.createElement('ul');
  newul.classList.add('nested');

  const span = addSpan(li, formatProperty(property), (span) => {
    //console.log(span.textContent);
    if (property == 'homeworld') {
      fetchNested(newul, object[property]).textContent = 'Loading...';
    } else {
      for (const i in object[property]) {
        const newli = fetchNested(newul, object[property][i]);
        if (i == object[property].length - 1) {
          newli.textContent = 'Loading...';
        }
      }
    }
  });
  li.appendChild(newul);
  return li;
}

function formatProperty(prop) {
  return prop.replace('_', ' ').replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
}

function addSpan(parent, text, load) {
  const span = parent.appendChild(document.createElement("span"));
  span.textContent = text;
  span.classList.add('caret');

  span.addEventListener('click', function () {
    if (load != null && !this.classList.contains("loaded")) {
      load(this);
      this.classList.add("loaded");
    }
    this.classList.toggle("caret-down");
    const list = this.parentElement.querySelector(".nested");
    list.classList.toggle("active");
  });

  return span;
}

function addul(parent, object, doNested) {
  const ul = parent.appendChild(document.createElement('ul'));
  ul.classList.add('nested');
  nestedItems = [];
  for (const key in object) {
    if (nested.includes(key)) {
      if (doNested && (key == "homeworld" || object[key].length > 0)) {
        nestedItems.push(addNestedItem(key, object));
      }
    }
    else if (!skip.includes(key)) {
      const formattedKey = formatProperty(key);
      let value = object[key];
      if (key == 'release_date') {
        value = moment(value).format('MMMM Do, YYYY');
      }
      addSimpleItem(ul, formattedKey + ': ' + value);
    }
  }
  for (const i in nestedItems) {
    ul.appendChild(nestedItems[i]);
  }
  return ul;
}

function addSimpleItem(ul, content) {
  const li = ul.appendChild(document.createElement('li'));
  li.appendChild(document.createElement("h4")).textContent = content;
  return li;
}

function addFilms(json) {
  const films = document.getElementById('films');
  document.getElementById("title").textContent = 'Films';

  for (let i = 0; i < json.result.length; i++) {
    const film = json.result[i].properties;
    const item = films.appendChild(document.createElement("div"));
    item.className = 'item'

    addSpan(item, film.title);
    const filmul = addul(item, film, true);
    const crawl = addSimpleItem(filmul, film.opening_crawl);
    crawl.className = "crawl";
  }

}

const nested = ['species', 'vehicles', 'starships', 'characters', 'planets', 'homeworld', 'people', 'pilots'];
const skip = ['created', 'edited', 'url', 'opening_crawl', 'title', 'episode_id', 'films', 'name'];

document.addEventListener('DOMContentLoaded', (event) => {
  fetch('https://www.swapi.tech/api/films/')
    .then((response) => { return response.json() })
    .catch((err) => console.error(err))
    .then((json) => addFilms(json));
});