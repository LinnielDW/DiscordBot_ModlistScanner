import axios from 'axios';
import { config } from '../config';

export async function getPastebinContent(pasteUrl: string): Promise<string | null> {
  try {

    const response = await axios.get(pasteUrl);

    if (response.status === 200) {
      return response.data;
    } else {
      console.error(`Error: Unable to retrieve content. Status Code: ${response.status}`);
      return null;
    }
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    return null;
  }
}

export async function getBadModList(): Promise<string[] | null> {
  try {
    const response = await axios.get(config.BADMODLIST);
    if (response.status === 200) {
      const dat: string = response.data;

      return dat.split(/\r?\n/);

    } else {
      console.error(`Error: Unable to retrieve content. Status Code: ${response.status}`);
      return null;
    }
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    return null;
  }
}