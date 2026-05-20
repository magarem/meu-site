import { promises as fs } from 'node:fs'
import path from 'node:path'

const STORAGE_ROOT = process.env.SIRIUS_STORAGE_ROOT
  ?? path.join(process.cwd(), '..', '..', '..', 'storage')

interface Inscricao {
  id: string
  nome: string
  email: string
  whatsapp: string
  nascimento: string
  cpf: string
  endereco: string
  metodoPagamento: string
  inscritoEm: string
}

export default defineEventHandler(async (event) => {
  const siteId = event.context.siteId as string
  const inscricoesFile = path.join(STORAGE_ROOT, siteId, '_inscricoes', 'inscricoes.json')

  async function readInscricoes(): Promise<Inscricao[]> {
    try {
      const raw = await fs.readFile(inscricoesFile, 'utf-8')
      return JSON.parse(raw)
    } catch {
      return []
    }
  }

  async function writeInscricoes(list: Inscricao[]): Promise<void> {
    await fs.mkdir(path.dirname(inscricoesFile), { recursive: true })
    await fs.writeFile(inscricoesFile, JSON.stringify(list, null, 2), 'utf-8')
  }

  const body = await readBody(event)

  const nome   = (body?.nome   || '').trim()
  const email  = (body?.email  || '').trim().toLowerCase()
  const whatsapp = (body?.whatsapp || '').trim()

  if (!nome)  throw createError({ statusCode: 400, statusMessage: 'Nome é obrigatório.' })
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    throw createError({ statusCode: 400, statusMessage: 'Email inválido.' })
  if (!whatsapp) throw createError({ statusCode: 400, statusMessage: 'WhatsApp é obrigatório.' })

  const inscricoes = await readInscricoes()

  if (inscricoes.some(i => i.email === email)) {
    throw createError({ statusCode: 409, statusMessage: 'Este email já possui uma inscrição.' })
  }

  const nova: Inscricao = {
    id: crypto.randomUUID(),
    nome,
    email,
    whatsapp,
    nascimento:       (body?.nascimento       || '').trim(),
    cpf:              (body?.cpf              || '').trim(),
    endereco:         (body?.endereco         || '').trim(),
    metodoPagamento:  body?.metodoPagamento   || 'pix',
    inscritoEm:       new Date().toISOString(),
  }

  inscricoes.push(nova)
  await writeInscricoes(inscricoes)

  return { success: true, message: 'Inscrição realizada com sucesso.' }
})
