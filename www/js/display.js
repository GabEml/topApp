const divCountry = `<a href="__link__">__title__</a>`;
const divCountryDetails = 
   `<div class="">
      <img src="__src__" class="" />
      <div class="">
        <h5 class="description">__top__. __title__</h5>
        <p class="description">
            __description__
        </p>
      </div>
      <div class="link">
        <a href="http://localhost:5500/www/index.html"> <<<< Retour au top </a>&emsp;&emsp;&emsp;
        <a href="__link__" target="_blank">Information Complémentaire >>>> </a>
      </div>
    </div>`;
const divForms = 
   `<form class="display">
      <label for="country">Pays:</label>
      <input name="country" id="country" type="text"/>
      <label for="image">Image (url):</label>
      <input name="image" id="image" type="text"/>
      <label for="description">description:</label>
      <textarea rows="15" cols="65" name="description" id="description"></textarea>
      <button id="submitTop">Valider</button>
    </form>`;

const htmlToElement = (html) => {
  const template = document.createElement("template");
  html = html.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = html;
  return template.content.firstChild;
};

const fetchApiDone = (json) => {
  var urlcourante = document.location.href.replace(/\/$/, "");
  queue_url = urlcourante.substring (urlcourante.lastIndexOf( "/" )+1 );

  if(localStorage.getItem("addTop") != null){
    let arr = localStorage.getItem("addTop").split(' , ');
    arr.map((obj) => { json.push(JSON.parse(obj)) })
  }

  if(queue_url == "country.html"){
    const divDetails = document.getElementById("details");
    json.forEach((country, i) => {
      if(country.name == localStorage.getItem("country")){
        const newDivCountry = divCountryDetails
        .replace("__link__", country.link)
        .replace("__src__", country.img)
        .replace("__top__", i + 1)
        .replace("__title__", country.name)
        .replace("__description__", country.description);
        divDetails.appendChild(htmlToElement(newDivCountry));
      }
    });
  } else if(queue_url == "form.html"){
    const form = document.getElementById("form");
    form.appendChild(htmlToElement(divForms));
    const country = document.getElementById("country");
    const description = document.getElementById("description");
    const image = document.getElementById("image");
    document.getElementById("submitTop").addEventListener("click", (e) => {
      e.preventDefault();
      topObjet = {
        name: country.value,
        description: description.value,
        img: description.value,
        link: ""
      }
      if(localStorage.getItem("addTop") != null){
        let objectStrong = localStorage.getItem("addTop") + ' , '+ JSON.stringify(topObjet)
        localStorage.setItem("addTop", objectStrong);
        console.log(objectStrong);
      }else{
        localStorage.setItem("addTop", JSON.stringify(topObjet));
      }
      document.location.href="http://localhost:5500/www/index.html";
    })

  } else {
    const divList = document.getElementById("list");
    json.forEach((country, i) => {
      const newDivCountry = divCountry
      .replace("__link__", "country.html")
      .replace("__top__", i + 1)
      .replace("__title__", country.name)
      divList.appendChild(htmlToElement(newDivCountry));
    });
    divList.appendChild(htmlToElement("<button style='width:150px' id='addTop'>Ajouter un top</button>"));
    const linkCountry = document.body.getElementsByTagName("a");
    for (const iterator of linkCountry) {
      iterator.addEventListener("click", (event) => {
        event.preventDefault();
        localStorage.setItem("country", event.target.innerHTML);
        document.location.href="http://localhost:5500/www/country.html";
      });
    }
    document.getElementById("addTop").addEventListener("click", (e)=> {
      document.location.href="http://localhost:5500/www/form.html";
    });
    
  }
};

document.addEventListener("DOMContentLoaded", () => {
  fetch("data.json").then((response) =>
    response.json().then(fetchApiDone)
  );
});