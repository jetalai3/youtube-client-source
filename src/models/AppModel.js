export default class AppModel {
  constructor(url) {
    this.API_KEY = 'AIzaSyDsfedYvk9R28i_cJVkmQlTwBO4OmrLYe4';
    this.url = url;
    this.requestResult = null;
    this.getNextPageToken = this.getNextPageToken.bind(this);
  }

  // Function which gets required videos data
  async getClipObjects() {
    const responce = await fetch(this.url);
    this.requestResult = await responce.json();
    const videoIds = this.requestResult.items.map(item => item.id.videoId).join(',');
    const resultResponce = await fetch(`https://www.googleapis.com/youtube/v3/videos?key=${this.API_KEY}&id=${videoIds}&part=snippet,statistics`);
    const resultData = await resultResponce.json();
    return resultData;
  }

  // Function which returns page token requred to fetch next chunk of information
  getNextPageToken() {
    return this.requestResult.nextPageToken ? this.requestResult.nextPageToken : '';
  }
}
