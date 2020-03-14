import api from './api';

class App {
  constructor() {
    this.repositories = [];
    this.formEl = document.getElementById('repo-form');
    this.listEl = document.getElementById('repo-list');
    this.inputElement = document.querySelector('input[name=repository]');

    this.registerHandlers();
  }

  registerHandlers() {
    this.formEl.onsubmit = event => this.addRepository(event);
  }

  setLoading(loading = true){
    if (loading === true) {
      let loadingEl = document.createElement('span');
      loadingEl.appendChild(document.createTextNode('Carregando'));
      loadingEl.setAttribute('id', 'loading');

      this.formEl.appendChild(loadingEl);
    } else {
      document.getElementById('loading').remove();
    }
  }

  async addRepository(event) {
    event.preventDefault();
    
    const repoInput = this.inputElement.value;

    if(repoInput.length === 0){
      return;
    }

    this.setLoading();

    try {
      const response = await api.get(`https://api.github.com/repos/${repoInput}`);
  
      const { name, description, html_url, owner: {avatar_url}} = response.data;
  
      this.repositories.push({
        name,
        description,
        avatar_url,
        html_url
      })
  
      this.inputElement.value = '';
  
      this.render();      
    } catch (error) {
      alert('O repositório não existe');
    }

    this.setLoading(false);
  }

  render() {
    this.listEl.innerHTML = '';

    this.repositories.forEach(repo => {
      let imgEl = document.createElement('img');
      imgEl.setAttribute('src', repo.avatar_url);

      let titleEl = document.createElement('strong');
      titleEl.appendChild(document.createTextNode(repo.name));

      let descriptionEl = document.createElement('p');
      descriptionEl.appendChild(document.createTextNode(repo.description));

      let linkEl = document.createElement('a');
      linkEl.setAttribute('target', '_blank');
      linkEl.setAttribute('href', repo.html_url);
      linkEl.appendChild(document.createTextNode('Acessar'))

      let liEl = document.createElement('li');
      liEl.appendChild(imgEl);
      liEl.appendChild(titleEl);
      liEl.appendChild(descriptionEl);
      liEl.appendChild(linkEl);

      this.listEl.appendChild(liEl);
    })

  }
  
}

new App();