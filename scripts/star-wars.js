function addNestedItem(json, ul, primary){
  console.log(json);
  console.log(ul);
}

function addFilms(json){
  const films = document.getElementById('films');

  for (let i = 0; i < json.results.length; i++){
    const film = json.results[i];
    const item = films.appendChild(document.createElement("div"));
    item.className = 'item'
    
    const span = item.appendChild(document.createElement("span"));
    span.textContent = film.title;
    span.classList.add('caret');

    const ul = item.appendChild(document.createElement('ul'));
    ul.classList.add('nested');

    for (const key in film){
      if (nested.includes(key)){

      }
      else if (!skip.includes(key)){
        const li = ul.appendChild(document.createElement('li'));
        const formattedKey = key.replace('_', ' ').replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
        let value = film[key];
        if (key == 'release_date'){
          value = moment(value).format('MMMM Do, YYYY');
        }
        li.appendChild(document.createElement("h4")).textContent = formattedKey + ': ' + value;
      }
    }

    span.addEventListener('click', function(){
      this.classList.toggle("caret-down");
      const list = this.parentElement.querySelector(".nested");
      list.classList.toggle("active");
    });
    
  }
  
  
}

const nested = ['films', 'species', 'vehicles', 'starships', 'characters', 'planets'];
const skip = ['created', 'edited', 'url', 'opening_crawl', 'title', 'episode_id', 'films'];

document.addEventListener('DOMContentLoaded', (event) => {
  fetch('https://swapi.dev/api/films/')
    .then((response) => {return response.json()})
    .then((json) => addFilms(json));
});