import {atom} from 'jotai';
import {createJSONStorage, atomWithStorage} from 'jotai/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type FormState = {
  name: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  card: string;
  expiry: string;
  cvv: string;
};

const FormAtom = atom<FormState>({
  name: '',
  email: '',
  street: '',
  city: '',
  state: '',
  zip: '',
  phone: '',
  card: '',
  expiry: '',
  cvv: '',
});

const storage = createJSONStorage<FormState[]>(() => AsyncStorage);
const AddressAtom = atomWithStorage<FormState[]>('addresses', [], storage);

const fetchaddress = atom(async get => {
  const addresses = get(AddressAtom);
  const data = await addresses;
  return data;
});

const addAddress = atom(null, async (get, set, form: FormState) => {
  const addresses = await get(AddressAtom);
  set(AddressAtom, [...addresses, form]);
});

export {FormAtom, fetchaddress, addAddress};
