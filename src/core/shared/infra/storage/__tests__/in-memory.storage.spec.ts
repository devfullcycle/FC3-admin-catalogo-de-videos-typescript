import { InMemoryStorage } from '../in-memory.storage';

describe('InMemoryStorage', () => {
  let storage: InMemoryStorage;

  beforeEach(() => {
    storage = new InMemoryStorage();
  });

  describe('store', () => {
    it('should store data in the storage', async () => {
      const data = Buffer.from('test data');
      const id = 'test-id';
      const mime_type = 'text/plain';

      await storage.store({ data, id, mime_type });

      const storedData = storage['storage'].get(id);
      expect(storedData).toEqual({ data, mime_type });
    });
  });

  describe('get', () => {
    it('should return the stored data', async () => {
      const data = Buffer.from('test data');
      const id = 'test-id';
      const mime_type = 'text/plain';

      await storage.store({ data, id, mime_type });

      const result = await storage.get(id);
      expect(result).toEqual({ data, mime_type });
    });
  });
});
