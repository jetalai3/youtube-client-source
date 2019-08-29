export default class AppView {
  constructor(videos, loadPrevPage, loadNextPage) {
    this.videos = videos;
    this.startX = 0;
    this.scrollLeft = 0;
    this.loadPrevPage = loadPrevPage;
    this.loadNextPage = loadNextPage;
    this.moveContent = this.moveContent.bind(this);
    this.handleContentMove = this.handleContentMove.bind(this);
    this.moveContent = this.moveContent.bind(this);
    this.touchContent = this.touchContent.bind(this);
    this.handleContentAnimations = this.handleContentAnimations.bind(this);
  }

  // Function which renders initial layout with search field and paging
  renderDefaultLayout() {
    const searchContainer = document.createElement('div');
    searchContainer.classList.toggle('search-bar');

    const searchForm = document.createElement('form');
    searchForm.classList.toggle('search-bar__form');

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search...';
    searchInput.classList.toggle('search-field');

    const content = document.createElement('div');
    content.classList.toggle('content');

    const paging = document.createElement('div');
    paging.classList.toggle('paging');

    const pagingControls = document.createElement('div');
    pagingControls.classList.toggle('paging-controls');

    const pagingPrev = document.createElement('button');
    pagingPrev.innerText = '<<';
    pagingPrev.classList.toggle('paging-controls__button');

    const pagingCur = document.createElement('div');
    pagingCur.innerText = '1';
    pagingCur.classList.toggle('paging-controls__page-number');

    const pagingNext = document.createElement('button');
    pagingNext.innerText = '>>';
    pagingNext.classList.toggle('paging-controls__button');

    // Bunch of event listeners required for mouse and touch swipes
    content.addEventListener('mousedown', (event) => {
      content.addEventListener('mousemove', this.moveContent);
      this.startX = event.pageX;
      content.classList.remove('swipe-prev-page');
      content.classList.remove('swipe-next-page');
    });

    content.addEventListener('mouseup', (event) => {
      content.removeEventListener('mousemove', this.moveContent);
      const offset = this.startX - event.pageX;
      this.handleContentAnimations(content, offset);
    });

    content.addEventListener('touchstart', (event) => {
      content.addEventListener('touchmove', this.touchContent);
      this.startX = event.changedTouches[0].pageX;
    });

    content.addEventListener('touchend', (event) => {
      content.removeEventListener('touchmove', this.touchContent);
      const offset = this.startX - event.changedTouches[0].pageX;
      this.handleContentAnimations(content, offset);
    });

    pagingControls.appendChild(pagingPrev);
    pagingControls.appendChild(pagingCur);
    pagingControls.appendChild(pagingNext);
    paging.appendChild(pagingControls);
    searchForm.appendChild(searchInput);
    searchContainer.appendChild(searchForm);
    document.body.appendChild(searchContainer);
    document.body.appendChild(content);
    document.body.appendChild(paging);
  }

  handleContentAnimations(element, offset) {
    const content = element;
    if (Math.abs(offset) / window.innerWidth < 0.25) return;
    content.classList.remove(['swipe-prev-page', 'swipe-next-page']);
    if (offset < 0) {
      this.loadPrevPage().then(content.classList.add('swipe-prev-page'));
    } else {
      this.loadNextPage().then(content.classList.add('swipe-next-page'));
    }
    content.style.left = 0;
  }

  handleContentMove(offset) {
    const content = document.querySelector('.content');
    const x = offset - this.startX;
    content.style.left = `${x}px`;
  }

  moveContent(event) {
    event.preventDefault();
    const offset = event.pageX;
    this.handleContentMove(offset);
  }

  touchContent(event) {
    event.preventDefault();
    const offset = event.changedTouches[0].pageX;
    this.handleContentMove(offset);
  }

  renderSearchResults() {
    const content = document.querySelector('.content');
    content.innerHTML = '';
    Array.from(this.videos).forEach((data) => {
      const element = document.createElement('div');
      element.classList.toggle('search-result-element');
      const searchPreview = document.createElement('div');
      searchPreview.classList.toggle('search-result-element__preview');
      const image = document.createElement('img');
      image.src = data.snippet.thumbnails.medium.url;
      image.classList.toggle('search-result-element__preview-image');
      const previewName = document.createElement('div');
      previewName.classList.toggle('search-result-element__preview-name');
      const titleLink = document.createElement('a');
      titleLink.href = `https://www.youtube.com/watch?v=${data.id}`;
      titleLink.innerText = data.snippet.title;
      titleLink.classList.toggle('search-result-element__title-link');
      titleLink.setAttribute('target', '_blank');
      const details = document.createElement('div');
      details.classList.toggle('search-result-element__details');
      const channel = document.createElement('div');
      channel.classList.toggle('search-result-element__channel');
      const channelLink = document.createElement('a');
      channelLink.classList.toggle('search-result-element__channel-link');
      channelLink.href = `https://www.youtube.com/channel/${data.snippet.channelId}`;
      channelLink.setAttribute('target', '_blank');
      channelLink.innerText = data.snippet.channelTitle;
      const dateText = document.createElement('p');
      const dateString = new Date(data.snippet.publishedAt).toISOString().slice(0, 10);
      dateText.innerText = `Uploaded on ${dateString}`;
      dateText.classList.toggle('search-result-element__date-text');
      const viewCount = document.createElement('p');
      viewCount.innerText = `${data.statistics.viewCount} views`;
      viewCount.classList.toggle('search-result-element__view-count');
      const description = document.createElement('p');
      description.innerText = data.snippet.description;
      description.classList.toggle('search-result-element__description');
      previewName.appendChild(titleLink);
      searchPreview.appendChild(image);
      searchPreview.appendChild(previewName);
      element.appendChild(searchPreview);
      channel.appendChild(channelLink);
      details.appendChild(channel);
      details.appendChild(dateText);
      details.appendChild(viewCount);
      element.appendChild(details);
      element.appendChild(description);
      content.appendChild(element);
    });
  }
}
