import AppModel from '../models/AppModel';
import AppView from '../views/AppView';
import getDisplayedClipsQuantity from './WidthControl';

export default class App {
  constructor() {
    this.state = {
      url: 'https://www.googleapis.com/youtube/v3/search?key=AIzaSyDsfedYvk9R28i_cJVkmQlTwBO4OmrLYe4&type=video&part=snippet&maxResults=16&q=',
      requestResult: null,
      videoClips: [],
      nextPageToken: null,
      pageSize: 0,
      pageNumber: 1,
    };
    this.timerId = null;
    this.startX = null;
    this.loadNextPage = this.loadNextPage.bind(this);
    this.loadPrevPage = this.loadPrevPage.bind(this);
  }

  // This is a function that processes loading of next page
  async loadNextPage() {
    if (this.state.videoClips.length === 0) return;
    const viewedVideosQuantity = this.state.pageNumber * this.state.pageSize;
    const prevPageVideosQuantity = this.state.videoClips.length - this.state.pageSize;
    // Check if new information download is required
    if (viewedVideosQuantity === prevPageVideosQuantity) {
      const newModel = new AppModel(`${this.state.url}${document.getElementsByClassName('search-field')[0].value}&pageToken=${this.state.nextPageToken}`);
      const newRequestResult = await newModel.getClipObjects();
      const newVideos = newRequestResult.items;
      this.state.nextPageToken = newModel.getNextPageToken();
      this.state.videoClips = this.state.videoClips.concat(newVideos);
    }
    this.state.pageNumber = this.state.pageNumber + 1;
    document.querySelector('.paging-controls__page-number').innerHTML = this.state.pageNumber;
    const firstIndex = (this.state.pageNumber - 1) * this.state.pageSize;
    const lastIndex = this.state.pageNumber * this.state.pageSize;
    this.loadChunkVideos(firstIndex, lastIndex, this.state.videoClips);
  }

  // This is a function that processes loading of previous page
  async loadPrevPage() {
    if (this.state.pageNumber === 1) return;
    this.state.pageNumber = this.state.pageNumber - 1;
    document.querySelector('.paging-controls__page-number').innerHTML = this.state.pageNumber;
    const firstIndex = (this.state.pageNumber - 1) * this.state.pageSize;
    const lastIndex = this.state.pageNumber * this.state.pageSize;
    this.loadChunkVideos(firstIndex, lastIndex, this.state.videoClips);
  }

  start() {
    this.state.pageSize = getDisplayedClipsQuantity(window.innerWidth);
    const defaultView = new AppView(this.state.videoClips, this.loadPrevPage, this.loadNextPage);
    defaultView.renderDefaultLayout();
    // Add search input processing function using timeout
    const searchField = document.getElementsByClassName('search-field')[0];
    searchField.addEventListener('input', (event) => {
      event.preventDefault();
      if (this.timerId) clearTimeout(this.timerId);
      this.timerId = setTimeout(async () => {
        const url = this.state.url + document.getElementsByClassName('search-field')[0].value;
        const clipsModel = new AppModel(url);
        this.state.nextPageToken = '';
        this.state.pageNumber = 1;
        document.querySelector('.paging-controls__page-number').innerHTML = this.state.pageNumber;
        this.state.requestResult = await clipsModel.getClipObjects();
        this.state.nextPageToken = clipsModel.getNextPageToken();
        this.state.videoClips = this.state.requestResult.items;
        const firstIndex = (this.state.pageNumber - 1) * this.state.pageSize;
        const lastIndex = this.state.pageNumber * this.state.pageSize;
        this.loadChunkVideos(firstIndex, lastIndex, this.state.videoClips);
      }, 2000);
    });
    // Get 'previous' paging button and process it's events
    const prevButton = document.getElementsByClassName('paging-controls__button')[0];
    prevButton.addEventListener('click', this.loadPrevPage);
    prevButton.addEventListener('mousedown', () => {
      const tooltip = document.createElement('div');
      tooltip.classList.toggle('tooltip');
      tooltip.innerText = this.state.pageNumber - 1;
      prevButton.appendChild(tooltip);
    });
    prevButton.addEventListener('mouseup', () => {
      prevButton.innerHTML = '<<';
    });
    // Get 'next' paging button and process it's events
    const nextButton = document.getElementsByClassName('paging-controls__button')[1];
    nextButton.addEventListener('mousedown', () => {
      const tooltip = document.createElement('div');
      tooltip.classList.toggle('tooltip');
      tooltip.innerText = this.state.pageNumber + 1;
      nextButton.appendChild(tooltip);
    });
    nextButton.addEventListener('mouseup', () => {
      nextButton.innerHTML = '>>';
    });
    nextButton.addEventListener('click', this.loadNextPage);
    // Process the resizing event to display right videos from videos array
    window.addEventListener('resize', () => {
      const firstIndex = (this.state.pageNumber - 1) * this.state.pageSize;
      this.state.pageSize = getDisplayedClipsQuantity(window.innerWidth);
      this.state.pageNumber = Math.round(firstIndex / this.state.pageSize) + 1;
      const lastIndex = this.state.pageNumber * this.state.pageSize;
      document.querySelector('.paging-controls__page-number').innerHTML = this.state.pageNumber;
      this.loadChunkVideos(firstIndex, lastIndex, this.state.videoClips);
    });
  }

  // eslint-disable-next-line class-methods-use-this
  loadChunkVideos(startIndex, endIndex, videos) {
    const videosToRender = Array.from(videos).slice(startIndex, endIndex);
    const clipsView = new AppView(videosToRender, this.loadPrevPage, this.loadNextPage);
    clipsView.renderSearchResults();
  }
}
