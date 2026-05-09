import { Elysia } from 'elysia';
import fs from 'node:fs/promises';
import path from 'node:path';

// =========================================================================
// 1. FUNÇÕES AUXILIARES GLOBAIS
// =========================================================================

function parseBasicFrontmatter(fileContent: string) {
  const match = fileContent.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {}; 

  const metadata: Record<string, string> = {};
  const lines = match[1].split(/\r?\n/);

  for (const line of lines) {
    const separatorIdx = line.indexOf(':');
    if (separatorIdx > 0) {
      const key = line.slice(0, separatorIdx).trim();
      let value = line.slice(separatorIdx + 1).trim();
      
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      metadata[key] = value;
    }
  }
  return metadata;
}

function getFileType(fileName: string) {
  const ext = path.extname(fileName).toLowerCase();
  
  if (['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'].includes(ext)) return 'image';
  if (['.pdf'].includes(ext)) return 'pdf';
  if (['.mp4', '.webm', '.mov'].includes(ext)) return 'video';
  if (['.doc', '.docx', '.txt', '.csv'].includes(ext)) return 'document';
  if (['.md'].includes(ext)) return 'markdown'; 
  if (['.zip', '.rar', '.tar', '.gz'].includes(ext)) return 'archive';
  
  return 'file'; 
}

function getDeepValue(obj: any, pathStr: string) {
  const normalizedPath = pathStr
    .replace(/\//g, '.')
    .replace(/\[['"]?(\w+)['"]?\]/g, '.$1')
    .replace(/^\./, '');
    
  return normalizedPath.split('.').reduce((acc, key) => {
    return (acc !== undefined && acc !== null) ? acc[key] : undefined;
  }, obj);
}

// =========================================================================
// 2. BUSCAR UM ÚNICO NÓ (VIA RÁPIDA)
// =========================================================================
async function getSingleNode(nodeRoute: string) {
  // Ajuste este caminho base conforme o local onde o Elysia está a correr
  // Se o backend estiver numa pasta paralela à public do Nuxt:
  const basePath = path.join(process.cwd(), '../public', 'data'); 
  
  const tryReadJson = async (filePath: string) => {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(content);
    } catch {
      return null;
    }
  };

  let data = await tryReadJson(path.join(basePath, `${nodeRoute}.json`));

  if (data) {
    const { blocks, ...metadata } = data;
    return {
      title: metadata.meta?.title || path.basename(nodeRoute),
      description: metadata.meta?.description || '',
      image: metadata.meta?.image || null,
      path: `/${nodeRoute}`,
      type: 'page',
      metadata: metadata,
      blocks: blocks || [] 
    };
  }

  try {
    const mdPath = path.join(basePath, `${nodeRoute}.md`);
    const mdContent = await fs.readFile(mdPath, 'utf-8');
    const metadata = parseBasicFrontmatter(mdContent);
    
    const bodyMatch = mdContent.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n([\s\S]*)$/);
    const body = bodyMatch ? bodyMatch[1].trim() : mdContent;

    return {
      title: metadata.title || path.basename(nodeRoute),
      description: metadata.description || '',
      image: metadata.image || null,
      path: `/${nodeRoute}`,
      type: 'markdown',
      metadata: metadata,
      content: body
    };
  } catch (e) {
    return { error: 'Node not found', statusCode: 404 };
  }
}

// =========================================================================
// 3. MOTOR RECURSIVO PRINCIPAL (A ÁRVORE)
// =========================================================================
async function buildTree(dirPath: string, currentRoutePath: string): Promise<any[]> {
  let childrenList = [];

  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    const jsonFiles = entries.filter(e => e.isFile() && e.name.endsWith('.json') && (!e.name.startsWith('_') || e.name === '_index.json'));
    const otherFiles = entries.filter(e => e.isFile() && !e.name.endsWith('.json') && !e.name.startsWith('_'));
    const folders = entries.filter(e => e.isDirectory() && !e.name.startsWith('_'));

    const processedFolders = new Set();

    for (const file of jsonFiles) {
      const slug = file.name.replace('.json', '');
      const filePath = path.join(dirPath, file.name);
      const fileContent = await fs.readFile(filePath, 'utf-8');
      
      let jsonData;
      try { jsonData = JSON.parse(fileContent); } catch (e) { continue; }

      const { blocks, ...pageMetadata } = jsonData;
      const nodePath = currentRoutePath === '/' ? `/${slug}` : `${currentRoutePath}/${slug}`;

      const node = {
        title: pageMetadata.meta?.title || slug,
        description: pageMetadata.meta?.description || '',
        image: pageMetadata.meta?.image || null,
        path: nodePath,
        type: 'page',
        metadata: pageMetadata,
        children: []
      };

      if (slug !== '_index') {
        const matchingFolder = folders.find(f => f.name === slug);
        if (matchingFolder) {
          const folderPath = path.join(dirPath, matchingFolder.name);
          node.children = await buildTree(folderPath, nodePath);
          processedFolders.add(matchingFolder.name);
        }
      }

      childrenList.push(node);
    }

    for (const folder of folders) {
      if (!processedFolders.has(folder.name)) {
         const folderPath = path.join(dirPath, folder.name);
         const nodePath = currentRoutePath === '/' ? `/${folder.name}` : `${currentRoutePath}/${folder.name}`;

         childrenList.push({
           title: folder.name.charAt(0).toUpperCase() + folder.name.slice(1),
           description: '',
           image: null,
           path: nodePath,
           type: 'folder',
           metadata: {},
           children: await buildTree(folderPath, nodePath)
         });
      }
    }

    for (const file of otherFiles) {
      const ext = path.extname(file.name).toLowerCase();
      const filePath = path.join(dirPath, file.name);
      let metadata = {};

      if (ext === '.md') {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        metadata = parseBasicFrontmatter(fileContent);
      }

      const fileTitle = metadata.title || file.name;

      childrenList.push({
        title: fileTitle,
        url: currentRoutePath === '/' 
          ? `/data/${file.name}` 
          : `/data/${currentRoutePath.replace(/^\//, '')}/${file.name}`,
        extension: ext,
        type: getFileType(file.name),
        metadata: metadata,
        children: [] 
      });
    }

  } catch (error) {
    // Falha silenciosa
  }

  return childrenList.sort((a, b) => {
    const isAPage = a.type === 'page' || a.type === 'folder';
    const isBPage = b.type === 'page' || b.type === 'folder';
    if (isAPage && !isBPage) return -1; 
    if (!isAPage && isBPage) return 1;  
    return a.title.localeCompare(b.title); 
  });
}

// =========================================================================
// 4. CONFIGURAÇÃO DO ELYSIA E SISTEMA DE CACHE
// =========================================================================

// Cache em RAM super-rápida nativa do Bun
const cacheStore = new Map<string, { data: any; expiry: number }>();
const CACHE_TTL = 1000 * 60 * 60; // 1 Hora em milissegundos

const app = new Elysia()
  // ✨ ENDPOINT PRINCIPAL: GET /api/tree ✨
  .get('/api/tree', async ({ query }) => {
    
    // 1. Construir chave de Cache baseada no URL completo
    // @ts-ignore (Elysia tipa a query como possível undefined, garantimos as strings abaixo)
    const cacheKey = `path:${query.path || '/'}|node:${query.node || ''}|prop:${query.prop || ''}|limit:${query.limit || ''}|page:${query.page || ''}|metaOnly:${query.metaOnly || ''}`;
    const now = Date.now();

    // 2. Verificar se existe em memória e é válido
    if (cacheStore.has(cacheKey)) {
      const cached = cacheStore.get(cacheKey)!;
      if (now < cached.expiry) {
        // console.log('⚡ Servido pela Cache em Memória!');
        return cached.data;
      }
      cacheStore.delete(cacheKey);
    }

    // --- INÍCIO DA LÓGICA SUPERTREE ---
    const targetPath = (query.path as string)?.replace(/\.\./g, '').replace(/^\//, '') || '';
    const targetProp = (query.node as string) || (query.prop as string);

    const reservedKeys = ['path', 'node', 'prop', 'limit', 'page', 'metaOnly'];
    const limit = parseInt(query.limit as string);
    const page = parseInt(query.page as string) || 1;

    let resultNode: any;

    // ✨ VIA RÁPIDA: DEEP EXTRACTION & SINGLE NODE
    const nodeData = await getSingleNode(targetPath);

    if (!nodeData.error) {
      if (targetProp) {
        let extractedValue = getDeepValue(nodeData, targetProp);
        
        if (extractedValue === undefined && nodeData.metadata) {
          extractedValue = getDeepValue(nodeData.metadata, targetProp);
        }

        if (extractedValue !== undefined) {
          if (Array.isArray(extractedValue) && !isNaN(limit) && limit > 0) {
            const startIndex = (page - 1) * limit;
            resultNode = {
              data: extractedValue.slice(startIndex, startIndex + limit),
              pagination: {
                 total: extractedValue.length, limit, currentPage: page,
                 totalPages: Math.ceil(extractedValue.length / limit),
                 hasNextPage: (startIndex + limit) < extractedValue.length,
                 hasPrevPage: page > 1
              }
            };
          } else {
            resultNode = extractedValue;
          }
        } else {
          resultNode = null; 
        }
      } else if (query.metaOnly === 'true') {
        resultNode = nodeData.metadata || {};
      } else {
        resultNode = nodeData;
      }
    } else {
      
      // ✨ VIA DE ÁRVORE: CONSTRUÇÃO DA PASTA
      // Lembre-se de ajustar este caminho para apontar para o Nuxt public/data
      const baseDirPath = path.join(process.cwd(), '../public', 'data', targetPath);
      let childrenList = await buildTree(baseDirPath, targetPath);

      // ✨ QUERY ENGINE DINÂMICO (FILTROS)
      const filterKeys = Object.keys(query).filter(key => !reservedKeys.includes(key));

      if (filterKeys.length > 0) {
        childrenList = childrenList.filter(child => {
          return filterKeys.every(filterKey => {
            const expectedValue = String((query as Record<string, any>)[filterKey]).toLowerCase();
            let actualValue = getDeepValue(child, filterKey);
            
            if (actualValue === undefined && child.metadata) {
              actualValue = getDeepValue(child.metadata, filterKey);
            }

            if (actualValue === undefined || actualValue === null) return false;
            return String(actualValue).toLowerCase() === expectedValue;
          });
        });
      }

      // ✨ PAGINAÇÃO DA LISTA DE FILHOS
      let paginationData = null;

      if (!isNaN(limit) && limit > 0) {
        const totalItems = childrenList.length;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        childrenList = childrenList.slice(startIndex, endIndex);

        paginationData = {
          total: totalItems, limit, currentPage: page,
          totalPages: Math.ceil(totalItems / limit),
          hasNextPage: endIndex < totalItems,
          hasPrevPage: page > 1
        };
      }

      // ✨ CONSTRUÇÃO DA RESPOSTA FINAL
      if (targetPath === '') {
        resultNode = { title: 'Raiz', path: '/', type: 'folder', metadata: {}, children: childrenList };
      } else {
        const parentNode = await getSingleNode(targetPath);
        if (!parentNode.error) {
          resultNode = { ...parentNode, children: childrenList };
          if (query.metaOnly === 'true') resultNode = parentNode.metadata || {};
        } else {
          resultNode = {
            title: path.basename(targetPath).charAt(0).toUpperCase() + path.basename(targetPath).slice(1),
            path: `/${targetPath}`, type: 'folder', metadata: {}, children: childrenList
          };
        }
      }

      if (paginationData && typeof resultNode === 'object' && !resultNode.data) {
          resultNode.pagination = paginationData;
      }
    }

    // 3. Salvar na Cache e devolver
    if (resultNode !== undefined && resultNode !== null) {
      cacheStore.set(cacheKey, { data: resultNode, expiry: now + CACHE_TTL });
    }

    return resultNode;
  })
  
  // =========================================================================
  // 📝 ENDPOINT 2: LEITOR DE CONTEÚDO MARKDOWN (O seu novo content.get)
  // =========================================================================
  .get('/api/content', async ({ query, set }) => {
    // 1. O Elysia já tipa a query, mas garantimos que é string
    const fileName = query.path as string;

    // 2. Validação básica do parâmetro (Substitui o createError do Nitro)
    if (!fileName) {
      set.status = 400;
      return { 
        error: 'Bad Request', 
        message: 'O parâmetro "path" é obrigatório (ex: about.md)' 
      };
    }

    try {
      // 3. Localizamos o ficheiro (Ajuste o '../data' se o backend estiver na raiz)
      const filePath = path.join(process.cwd(), '../data', fileName);
      
      // 4. Lemos o conteúdo bruto
      const fileContent = await fs.readFile(filePath, 'utf-8');
      
      // 5. ✨ PARSE DO FRONTMATTER COM GRAY-MATTER ✨
      const { data: md_data, content: md_content } = matter(fileContent);
      
      // 6. Retornamos os dados estruturados
      return {
        raw: fileContent, 
        md_data,    
        md_content, 
        fetchedAt: new Date().toISOString()
      };

    } catch (error: any) {
      console.error('Erro ao ler ou processar Markdown:', error.message);
      
      // Lança erro 404 limpo (Substitui o createError do Nitro)
      set.status = 404;
      return { 
        error: 'Not Found', 
        message: `Ficheiro não encontrado ou erro de processamento: ${fileName}` 
      };
    }
  })


  // =========================================================================
  // 🧹 ENDPOINT 3: LIMPEZA DE CACHE
  // =========================================================================
  .post('/api/clear-cache', () => {
    // cacheStore.clear(); // Se estiver a usar o sistema de cache
    return { success: true, message: 'Cache limpa!' };
  })

  // Inicia o servidor
  .listen(3001);

console.log(`🦊 Elysia (SuperTree API) a voar em ${app.server?.hostname}:${app.server?.port}`);