import UnserialisedError from '../errors/UnserialisableError';
import UnknownShipError from '../errors/UnknownShipError';
import UnknownEquipmentError from '../errors/UnknownEquipmentError';
import UnkonwnShipVoicelinesError from '../errors/UnknownShipVoicelinesError';
import UnknownBarrageError from '../errors/UnkonwnBarrageError';
import { HttpClient } from '@augu/orchid';

export type QueryLang = 'jp' | 'en' | 'cn' | 'kr' | undefined;

export type Nationality = 'USS' | 'Eagle Union' | 'HMS' | 'Royal Navy' | 'IJN' | 'Sakura Empire'
  | 'KMS' | 'Iron Blood' | 'ROC' | 'Eastern Radiance' | 'SN' | 'North Union' | 'FNFF' | 'Iris Libre'
  | 'MNF' | 'Vichya Domination' | 'RN' | 'Sardenga Empire' | 'HDN' | 'Neptunia' | 'Bilibili' | 'Utawarerumono'
  | 'KizunaAI' | 'Hololive';

export const Nationalities: {
  [x in Exclude<Nationality, 'USS' | 'HMS' | 'IJN' | 'KMS' | 'ROC' | 'SN' | 'FNFF' | 'MNF' | 'RN' | 'HDN'>]: string[]
} = {
  'Eagle Union': ['USS', 'Eagle Union'],
  'Royal Navy': ['HMS', 'Royal Navy'],
  'Sakura Empire': ['IJN', 'Sakura Empire'],
  'Iron Blood': ['KMS', 'Iron Blood'],
  'Eastern Radiance': ['ROC', 'Eastern Radiance'],
  'North Union': ['SN', 'North Union'],
  'Iris Libre': ['FFNF', 'Iris Libre'],
  'Vichya Domination': ['MNF', 'Vichya Domination'],
  'Sardenga Empire': ['RN', 'Sardegna Empire'],
  Neptunia: ['HDN', 'Neptunia'],
  Bilibili: ['Bilibili'],
  Utawarerumono: ['Utawarerumono'],
  KizunaAI: ['KizunaAI'],
  Hololive: ['Hololive']
};

/**
 * Fetcher to grab anything from the database on GitHub
 */
export default class APIFetcher {
  /**
   * The client to use to request
   */
  private http: HttpClient;

  /**
   * Creates a new [APIFetcher] instance
   */
  constructor() {
    this.http = new HttpClient({
      defaults: {
        baseUrl: 'https://raw.githubusercontent.com/AzurAPI/azurapi-js-setup/master',
        headers: {
          'Accept': 'application/json'
        }
      }
    });
  }

  /**
   * Fetches all the ships
   */
  async getDataShips() {
    const res = await this.http.get('/ships.json');
    let data: any[] = [];

    try {
      data = res.json();
    } catch(ex) {
      throw new UnserialisedError();
    }

    return data;
  }
  /**
   * Fetches ships list
   */
  async getDataShipsList() {
    const res = await this.http.get('/ships-list.json');
    let data: any[] = [];

    try {
      data = res.json();
    } catch(ex) {
      throw new UnserialisedError();
    }

    return data;
  }

  /**
   * Fetches all the equipments
   */
  async getDataEquipments() {
    const res = await this.http.get('/equipments.json');
    let data: any[] = [];

    try {
      data = res.json();
    } catch(ex) {
      throw new UnserialisedError();
    }

    return data;
  }

  /**
   * Fetches all the chapters
   */
  async getDataChapters() {
    const res = await this.http.get('/chapters.json');
    let data: any[] = [];

    try {
      data = res.json();
    } catch(ex) {
      throw new UnserialisedError();
    }

    return data;
  }

  /**
   * Fetches all the barrages
   */
  async getDataBarrage() {
    const res = await this.http.get('/barrage.json');
    let data: any[] = [];

    try {
      data = res.json();
    } catch(ex) {
      throw new UnserialisedError();
    }

    return data;
  }

  /**
   * Fetches all the voice lines
   */
  async getDataVoicelines() {
    const res = await this.http.get('/voice_lines.json');
    let data: any[] = [];

    try {
      data = res.json();
    } catch(ex) {
      throw new UnserialisedError();
    }

    return data;
  }

  /**
   * Grabs a ship from the database
   * @param id The ship's ID or name
   */
  async getShip(id: string) {
    const data = await this.getDataShips();
    const ships = data.filter(ship => {
      if (ship.id === id) return true;
      for (const key of Object.keys(ship.names)) {
        if (ship.names[key] === id) return true;
      }

      return false;
    });

    if (!ships.length) throw new UnknownShipError(id);
    return ships[0];
  }

  /**
   * Grabs a ship from the database by it's faction name
   * @param faction The faction to get from
   */
  async getShipsFromFaction(faction: Nationality) {
    const data = await this.getDataShips();
    const query = data.filter(ship => {
      if (!Nationalities.hasOwnProperty(ship.nationality)) return false;

      const nationalities = Nationalities[ship.nationality];
      return nationalities.includes(faction);
    });

    if (!query.length) throw new Error(`Couldn't find any ships with faction \`${faction}\``);

    return query;
  }

  /**
   * Grabs a equiptment from database
   * @param id The equiptment's ID or name
   */
  async getEquipment(id: string, type?: QueryLang) {
    const data = await this.getDataEquipments();
    //const escapeLatinString = (string: any) => string.toLowerCase(/*string.normalize('NFD').replace(/[\u0300-\u036f]/g, '').*/string.replace(/[!@#$%^&*(),.?":{}|<>' ]/g, ''));
    function omap(object: any, mapFn: any) {
      return Object.keys(object).reduce(function(result, key) {
        result[key] = mapFn(object[key]);
        return result;
      }, {});
    }
    let result;
    switch (type) {
      case ('en'):
        const enMap = omap(data, obj => obj.names.en);
        const enFind = Object.keys(enMap).filter(item => enMap[item] === id);
        result = data[enFind[0]];
        break;
      case ('cn'):
        const cnMap = omap(data, obj => obj.names.cn);
        const cnFind = Object.keys(cnMap).filter(item => cnMap[item] === id);
        result = data[cnFind[0]];
        break;
      case('jp'):
        const jpMap = omap(data, obj => obj.names.jp);
        const jpFind = Object.keys(jpMap).filter(item => jpMap[item] === id);
        result = data[jpFind[0]];
        break;
      case('kr'):
        const krMap = omap(data, obj => obj.names.kr);
        const krFind = Object.keys(krMap).filter(item => krMap[item] === id);
        result = data[krFind[0]];
        break;
      default:
        const find = Object.keys(data).filter(item => item === /*escapeLatinString(*/id/*)*/);
        result = data[find[0]];
    }
    if (!result) throw new UnknownEquipmentError(id);
    return (result);
  }
  /**
   * Grabs a voice line from database
   * @param id The ships's ID to get voice lines from
   */
  async getVoiceline(id: string) {
    const data = await this.getDataVoicelines();
    let find = Object.keys(data).filter(item => item === id);
    let result = data[find[0]];
    if (!result) throw new UnkonwnShipVoicelinesError(id);
    return result;
  }
  /**
   * Grab barrage from database
   * @param id The barrages name/id
   */
  async getBarrage(id: string) {
    const data = await this.getDataBarrage();
    let result = data.filter(obj => obj.id === id);
    if (!result) throw new UnknownBarrageError(id);
    return result;
  }
}
