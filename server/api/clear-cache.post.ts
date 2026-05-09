export default defineEventHandler(async (event) => {
  const storage = useStorage('cache');
  const allKeys = await storage.getKeys();
  
  // 🎯 ESTRATÉGIA: Se não encontrar a rota exata, 
  // limpamos TUDO o que for relacionado com dados ou payloads.
  const toDelete = allKeys.filter(key => {
    return key.includes('cms-data') || key.includes('payload');
  });

  for (const key of toDelete) {
    await storage.removeItem(key);
  }

  return {
    resultado: "Varredura completa",
    chaves_removidas: toDelete,
    sobraram: await storage.getKeys()
  };
});